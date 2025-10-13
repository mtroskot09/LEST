import passport from "passport";
import { Express } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

export function setupAuth(app: Express) {
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
      maxAge: sessionTtl,
    },
  };

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin@lest.hr";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "fIqM&3G)]LRojQ4v";
  
  const ADMIN_USER = {
    id: "admin",
    username: ADMIN_USERNAME,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser((id: string, done) => {
    if (id === "admin") {
      done(null, ADMIN_USER);
    } else {
      done(null, null);
    }
  });

  app.post("/api/login", (req, res, next) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      req.login(ADMIN_USER, (err) => {
        if (err) return next(err);
        res.status(200).json(ADMIN_USER);
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
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
