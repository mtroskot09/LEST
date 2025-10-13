export const translations = {
  hr: {
    // General
    appName: "Frizerski studio LEST",
    salon: "Frizerski salon u Zagrebu",
    
    // Landing page
    landing: {
      title: "Upravljajte rasporedom svog tima",
      description: "Sustav za planiranje termina s povuci-i-ispusti funkcionalnosti za blokove vremena. Surađujte s timom i premještajte termine jednostavno.",
      getStarted: "Počnite",
      signIn: "Prijavite se",
      features: {
        scheduling: {
          title: "Planiranje po vremenskim blokovima",
          description: "Kreirajte i upravljajte vremenskim blokovima s preciznošću od 15 minuta. Kliknite ili povucite za planiranje.",
        },
        collaboration: {
          title: "Timska suradnja",
          description: "Upravljajte s više zaposlenika i premještajte termine između članova tima bez napora.",
        },
        calendar: {
          title: "Kalendarski prikaz",
          description: "Vizualno sučelje kalendara koje prikazuje sve rasporede na prvi pogled. Navigirajte po danu ili tjednu.",
        },
      },
    },
    
    // Navigation & Header
    nav: {
      employees: "Zaposlenici",
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
      title: "Zaposlenici",
      add: "Dodaj",
      addNew: "Dodaj novog zaposlenika",
      name: "Ime zaposlenika",
      namePlaceholder: "npr. Ana Horvat",
      cancel: "Odustani",
      confirm: "Dodaj zaposlenika",
      deleteConfirm: "Jeste li sigurni?",
    },
    
    // Time blocks
    timeBlock: {
      add: "Dodaj vremenski blok",
      startTime: "Početno vrijeme",
      endTime: "Završno vrijeme",
      task: "Zadatak (neobavezno)",
      taskPlaceholder: "npr. Šišanje i bojanje",
      create: "Kreiraj blok",
      cancel: "Odustani",
    },
    
    // Messages
    messages: {
      unauthorized: "Neovlašteno",
      loggingIn: "Prijavljujete se...",
      error: "Greška",
      failedToCreateEmployee: "Nije moguće kreirati zaposlenika",
      failedToDeleteEmployee: "Nije moguće obrisati zaposlenika",
      failedToCreateBlock: "Nije moguće kreirati vremenski blok",
      failedToUpdateBlock: "Nije moguće ažurirati vremenski blok",
      failedToDeleteBlock: "Nije moguće obrisati vremenski blok",
    },
    
    // Time labels
    time: "Vrijeme",
  },
  
  en: {
    // General
    appName: "Frizerski studio LEST",
    salon: "Hair Salon in Zagreb",
    
    // Landing page
    landing: {
      title: "Manage Your Team's Schedule",
      description: "Drag-and-drop scheduling for employee time blocks. Collaborate with your team and transfer shifts seamlessly.",
      getStarted: "Get Started",
      signIn: "Sign In",
      features: {
        scheduling: {
          title: "Time Block Scheduling",
          description: "Create and manage time blocks with 15-minute precision. Click or drag to schedule.",
        },
        collaboration: {
          title: "Team Collaboration",
          description: "Manage multiple employees and transfer shifts between team members effortlessly.",
        },
        calendar: {
          title: "Calendar View",
          description: "Visual calendar interface showing all schedules at a glance. Navigate by day or week.",
        },
      },
    },
    
    // Navigation & Header
    nav: {
      employees: "Employees",
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
      title: "Employees",
      add: "Add",
      addNew: "Add New Employee",
      name: "Employee Name",
      namePlaceholder: "e.g. John Doe",
      cancel: "Cancel",
      confirm: "Add Employee",
      deleteConfirm: "Are you sure?",
    },
    
    // Time blocks
    timeBlock: {
      add: "Add Time Block",
      startTime: "Start Time",
      endTime: "End Time",
      task: "Task (Optional)",
      taskPlaceholder: "e.g. Haircut and styling",
      create: "Create Block",
      cancel: "Cancel",
    },
    
    // Messages
    messages: {
      unauthorized: "Unauthorized",
      loggingIn: "Logging in again...",
      error: "Error",
      failedToCreateEmployee: "Failed to create employee",
      failedToDeleteEmployee: "Failed to delete employee",
      failedToCreateBlock: "Failed to create time block",
      failedToUpdateBlock: "Failed to update time block",
      failedToDeleteBlock: "Failed to delete time block",
    },
    
    // Time labels
    time: "Time",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.hr;
