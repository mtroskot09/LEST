import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Users, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Schedule Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleLogin} data-testid="button-login">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Manage Your Team's Schedule
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drag-and-drop scheduling for employee time blocks. Collaborate with your team
              and transfer shifts seamlessly.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleLogin} data-testid="button-get-started">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="space-y-3 p-6 rounded-lg bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Time Block Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage time blocks with 15-minute precision. Click or drag to schedule.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Team Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Manage multiple employees and transfer shifts between team members effortlessly.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-card hover-elevate">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Calendar View</h3>
              <p className="text-sm text-muted-foreground">
                Visual calendar interface showing all schedules at a glance. Navigate by day or week.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
