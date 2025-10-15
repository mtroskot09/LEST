export const translations = {
  hr: {
    // General
    appName: "Frizerski studio LEST",
    salon: "Frizerski salon u Zagrebu",
    
    // Auth page
    auth: {
      welcomeBack: "Dobrodošli natrag",
      createAccount: "Kreirajte račun",
      loginSubtitle: "Prijavite se kako biste pristupili svom rasporedu",
      registerSubtitle: "Registrirajte se kako biste počeli upravljati terminima",
      username: "Korisničko ime",
      password: "Lozinka",
      login: "Prijavite se",
      register: "Registrirajte se",
      haveAccount: "Već imate račun?",
      noAccount: "Nemate račun?",
      switchToLogin: "Prijavite se",
      switchToRegister: "Registrirajte se",
    },
    
    // Landing page
    landing: {
      title: "Upravljajte rasporedom vašeg salona",
      description: "Sustav za planiranje termina s povuci-i-ispusti funkcionalnosti. Organizirajte termine vaših frizera jednostavno i efikasno.",
      getStarted: "Počnite",
      signIn: "Prijavite se",
      features: {
        scheduling: {
          title: "Planiranje po vremenskim blokovima",
          description: "Kreirajte i upravljajte vremenskim blokovima s preciznošću od 15 minuta. Kliknite ili povucite za planiranje.",
        },
        collaboration: {
          title: "Timska suradnja",
          description: "Upravljajte s više frizera i premještajte termine između članova tima bez napora.",
        },
        calendar: {
          title: "Kalendarski prikaz",
          description: "Vizualno sučelje kalendara koje prikazuje sve rasporede na prvi pogled. Navigirajte po danu ili tjednu.",
        },
      },
    },
    
    // Navigation & Header
    nav: {
      employees: "Frizeri",
      today: "Danas",
      signOut: "Odjavite se",
    },
    
    // Date navigation
    date: {
      previous: "Prethodni dan",
      next: "Sljedeći dan",
      today: "Danas",
    },
    
    // Employees
    employees: {
      title: "Frizeri",
      add: "Dodaj",
      addNew: "Dodaj novog frizera",
      name: "Ime frizera",
      namePlaceholder: "npr. Ana Horvat",
      cancel: "Odustani",
      confirm: "Dodaj frizera",
      deleteConfirm: "Jeste li sigurni?",
    },
    
    // Time blocks
    timeBlock: {
      add: "Dodaj termin",
      startTime: "Početno vrijeme",
      endTime: "Završno vrijeme",
      clientName: "Ime i prezime klijenta",
      clientNamePlaceholder: "npr. Ana Marić",
      task: "Usluga (neobavezno)",
      taskPlaceholder: "npr. Šišanje i feniranje",
      create: "Kreiraj termin",
      cancel: "Odustani",
    },
    
    // Messages
    messages: {
      unauthorized: "Neovlašteno",
      loggingIn: "Prijavljujete se...",
      loginFailed: "Prijava neuspješna",
      registerFailed: "Registracija neuspješna",
      logoutFailed: "Odjava neuspješna",
      error: "Greška",
      failedToCreateEmployee: "Nije moguće kreirati frizera",
      failedToDeleteEmployee: "Nije moguće obrisati frizera",
      failedToCreateBlock: "Nije moguće kreirati termin",
      failedToUpdateBlock: "Nije moguće ažurirati termin",
      failedToDeleteBlock: "Nije moguće obrisati termin",
      invalidStartTime: "Početno vrijeme mora biti na :00, :15, :30 ili :45",
      invalidEndTime: "Završno vrijeme mora biti na :00, :15, :30 ili :45",
      minimumDuration: "Minimalno trajanje je 15 minuta",
      invalidDuration: "Završno vrijeme mora biti nakon početnog vremena",
      timeConflict: "Ovaj termin se preklapa s postojećim terminom",
      outsideHours: "Termini moraju biti unutar radnog vremena (9:00-19:00)",
    },
    
    // Time labels
    time: "Vrijeme",
    name: "Ime",
    service: "Usluga",
  },
  
  en: {
    // General
    appName: "Frizerski studio LEST",
    salon: "Hair Salon in Zagreb",
    
    // Auth page
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create an account",
      loginSubtitle: "Sign in to access your schedule",
      registerSubtitle: "Register to start managing appointments",
      username: "Username",
      password: "Password",
      login: "Sign In",
      register: "Register",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      switchToLogin: "Sign in",
      switchToRegister: "Register",
    },
    
    // Landing page
    landing: {
      title: "Manage Your Salon's Schedule",
      description: "Drag-and-drop appointment scheduling. Organize your hairdressers' schedules easily and efficiently.",
      getStarted: "Get Started",
      signIn: "Sign In",
      features: {
        scheduling: {
          title: "Time Block Scheduling",
          description: "Create and manage time blocks with 15-minute precision. Click or drag to schedule.",
        },
        collaboration: {
          title: "Team Collaboration",
          description: "Manage multiple hairdressers and transfer appointments between team members effortlessly.",
        },
        calendar: {
          title: "Calendar View",
          description: "Visual calendar interface showing all schedules at a glance. Navigate by day or week.",
        },
      },
    },
    
    // Navigation & Header
    nav: {
      employees: "Hairdressers",
      today: "Today",
      signOut: "Sign Out",
    },
    
    // Date navigation
    date: {
      previous: "Previous day",
      next: "Next day",
      today: "Today",
    },
    
    // Employees
    employees: {
      title: "Hairdressers",
      add: "Add",
      addNew: "Add New Hairdresser",
      name: "Hairdresser Name",
      namePlaceholder: "e.g. John Doe",
      cancel: "Cancel",
      confirm: "Add Hairdresser",
      deleteConfirm: "Are you sure?",
    },
    
    // Time blocks
    timeBlock: {
      add: "Add Appointment",
      startTime: "Start Time",
      endTime: "End Time",
      clientName: "Client Name",
      clientNamePlaceholder: "e.g. John Smith",
      task: "Service (Optional)",
      taskPlaceholder: "e.g. Haircut and styling",
      create: "Create Appointment",
      cancel: "Cancel",
    },
    
    // Messages
    messages: {
      unauthorized: "Unauthorized",
      loggingIn: "Logging in again...",
      loginFailed: "Login failed",
      registerFailed: "Registration failed",
      logoutFailed: "Logout failed",
      error: "Error",
      failedToCreateEmployee: "Failed to create hairdresser",
      failedToDeleteEmployee: "Failed to delete hairdresser",
      failedToCreateBlock: "Failed to create appointment",
      failedToUpdateBlock: "Failed to update appointment",
      failedToDeleteBlock: "Failed to delete appointment",
      invalidStartTime: "Start time must be at :00, :15, :30, or :45",
      invalidEndTime: "End time must be at :00, :15, :30, or :45",
      minimumDuration: "Minimum duration is 15 minutes",
      invalidDuration: "End time must be after start time",
      timeConflict: "This time slot conflicts with an existing appointment",
      outsideHours: "Appointments must be within business hours (9:00-19:00)",
    },
    
    // Time labels
    time: "Time",
    name: "Name",
    service: "Service",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.hr;
