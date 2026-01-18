/**
 * Page de connexion admin
 * Utilise Supabase Auth avec email/password
 */
import { Suspense } from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md h-96 bg-white rounded-lg animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
