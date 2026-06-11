import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { useActionData, useNavigate } from "react-router";
import { AuthForm } from "~/components/auth/AuthForm";
import { setSession } from "~/lib/auth";
import { ApiError } from "~/lib/http";
import { login } from "~/services/auth.service";
import type { AuthResponse } from "~/types/auth";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  try {
    return await login({ email, password });
  } catch (e) {
    if (e instanceof ApiError) return { error: "errors.loginFailed" };
    throw e;
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (actionData && "accessToken" in actionData) {
      setSession(actionData as AuthResponse);
      navigate("/tournaments");
    }
  }, [actionData, navigate]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6">
      <div className="cr-card w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-arena-mid)]/80 p-8">
        {actionData && "error" in actionData && (
          <p className="mb-6 font-ui text-sm text-[var(--color-battle)]">{t(actionData.error)}</p>
        )}
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
