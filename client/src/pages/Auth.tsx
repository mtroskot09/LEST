import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import LanguageSwitch from "@/components/LanguageSwitch";
import ThemeToggle from "@/components/ThemeToggle";

export default function Auth() {
  const { user, loginMutation } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return <Redirect to="/schedule" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col p-6 lg:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Scissors className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">{t.appName}</h1>
              <p className="text-sm text-muted-foreground">{t.salon}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">
                  {t.auth.welcomeBack}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t.auth.loginSubtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t.auth.username}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isPending}
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.auth.password}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isPending}
                    data-testid="input-password"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isPending}
                  data-testid="button-submit"
                >
                  {t.auth.login}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-primary p-12">
        <div className="max-w-md text-primary-foreground space-y-6">
          <Scissors className="h-16 w-16" />
          <h2 className="text-3xl font-semibold">{t.landing.title}</h2>
          <p className="text-lg opacity-90">{t.landing.description}</p>
        </div>
      </div>
    </div>
  );
}
