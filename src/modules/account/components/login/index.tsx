"use client";

import { useState } from "react";
import Input from "@modules/common/components/input";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import ErrorMessage from "@modules/checkout/components/error-message";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import { useLogin } from "hooks/useLogin";
import { useRouter } from "next/navigation";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
  const { login, isLoading, error } = useLogin();
  const [message, setMessage] = useState<string | null>(null);
  const {push,replace,refresh}=useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null); // Reset error message

    const formData = new FormData(event.currentTarget);

    const values = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
  

    try {
      await login(values);
      // Redirect user after successful login (if necessary)
    refresh()

    } catch (err) {
      setMessage("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="max-w-sm flex flex-col items-center" data-testid="login-page">
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input label="Email" name="email" type="email" required autoComplete="email" data-testid="email-input" />
          <Input label="Password" name="password" type="password" required autoComplete="current-password" data-testid="password-input" />
        </div>
        <ErrorMessage error={message || error?.message} data-testid="login-error-message" />
        <SubmitButton className="w-full mt-6" data-testid="sign-in-button" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)} className="underline" data-testid="register-button">
          Join us
        </button>.
      </span>
    </div>
  );
};

export default Login;
