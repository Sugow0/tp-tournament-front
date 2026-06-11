import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { useActionData, useNavigate } from "react-router";
import { AuthForm } from "~/components/auth/AuthForm";
import { PageHeader } from "~/components/layout/PageHeader";
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
    <>
      <PageHeader title={t("auth.login")} />
      <div className="px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12">
        {actionData && "error" in actionData && (
          <p className="text-[var(--color-battle)] text-sm mb-6 font-ui">{t(actionData.error)}</p>
        )}
        <AuthForm mode="login" />
      </div>
    </>
  );
}
