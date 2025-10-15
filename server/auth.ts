import passport from "passport";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import connectPg from "connect-pg-simple";

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

async function comparePasswords(supplied: string, stored: string) {
  return await bcrypt.compare(supplied, stored);
}

async function ensureAdminUser() {
  const adminUsername = "admin@lest.hr";
  const adminPassword = "fIqM&3G)]LRojQ4v";
  
  try {
    const existingUser = await storage.getUserByUsername(adminUsername);
    if (!existingUser) {
      console.log("Creating admin user...");
      const hashedPassword = await hashPassword(adminPassword);
      await storage.createUser({
        username: adminUsername,
        password: hashedPassword,
      });
      console.log("Admin user created successfully");
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}

export async function setupAuth(app: Express) {
  await ensureAdminUser();
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (user) {
        const { password, ...sanitized } = user;
        done(null, sanitized);
      } else {
        done(null, null);
      }
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const { password: _, ...sanitized } = user;
      req.login(sanitized, (err) => {
        if (err) return next(err);
        res.status(200).json(sanitized);
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user); // Already sanitized by deserializeUser
  });
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}
