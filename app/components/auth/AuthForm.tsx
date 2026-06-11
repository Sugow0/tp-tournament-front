import { useTranslation } from "react-i18next";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const { t } = useTranslation();
  const isLogin = mode === "login";

  return (
    <Form method="post" className="flex flex-col gap-5 w-full max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="auth-email"
          className="font-ui text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest"
        >
          {t("auth.email")}
        </Label>
        <Input
          id="auth-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all h-10 rounded-sm font-ui"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="auth-password"
          className="font-ui text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest"
        >
          {t("auth.password")}
        </Label>
        <Input
          id="auth-password"
          name="password"
          type="password"
          required
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all h-10 rounded-sm font-ui"
        />
      </div>

      <Button type="submit" className="self-start">
        {t("auth.submit")}
      </Button>

      <p className="font-ui text-sm text-[var(--color-text-muted)]">
        {isLogin ? (
          <>
            {t("auth.noAccount")}{" "}
            <Link to="/register" className="text-[var(--color-gold)] hover:underline">
              {t("auth.register")}
            </Link>
          </>
        ) : (
          <>
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="text-[var(--color-gold)] hover:underline">
              {t("auth.login")}
            </Link>
          </>
        )}
      </p>
    </Form>
  );
}
