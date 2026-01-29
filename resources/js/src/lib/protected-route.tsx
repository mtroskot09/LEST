import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  console.log('[ProtectedRoute]', { path, location, user, isLoading });

  // Only render if we're on the correct path
  if (location !== path) {
    return null;
  }

  if (isLoading) {
    console.log('[ProtectedRoute] Loading, showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /');
    return <Redirect to="/" />;
  }

  console.log('[ProtectedRoute] User authenticated, rendering component');
  return <Component />;
}
