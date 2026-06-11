import { Crown } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      <Form method="post">
        <div className="flex flex-col gap-6">
          {/* Brand + heading + cross-link */}
          <div className="flex flex-col items-center gap-2">
            <span className="flex flex-col items-center gap-2 font-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-gold)] drop-shadow-[0_0_10px_rgba(201,164,75,0.6)]">
                <Crown className="size-6" />
              </span>
              <span className="sr-only">{t("nav.brand")}</span>
            </span>
            <h1
              className="font-heading text-xl font-bold uppercase tracking-widest text-[var(--color-text-bright)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("auth.welcome")}
            </h1>
            <p className="font-heading text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-gold)]">
              {t("nav.brand")}
            </p>
            <div className="text-center text-sm font-ui text-[var(--color-text-muted)]">
              {isLogin ? (
                <>
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/register"
                    className="text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-gold-bright)]"
                  >
                    {t("auth.register")}
                  </Link>
                </>
              ) : (
                <>
                  {t("auth.haveAccount")}{" "}
                  <Link
                    to="/login"
                    className="text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-gold-bright)]"
                  >
                    {t("auth.login")}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label
                htmlFor="auth-email"
                className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]"
              >
                {t("auth.email")}
              </Label>
              <Input
                id="auth-email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                autoComplete="email"
                className="h-10 rounded-sm border-[var(--color-border)] bg-[var(--color-arena-surface)] font-ui text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="auth-password"
                className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]"
              >
                {t("auth.password")}
              </Label>
              <Input
                id="auth-password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="h-10 rounded-sm border-[var(--color-border)] bg-[var(--color-arena-surface)] font-ui text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20"
              />
            </div>

            <Button type="submit" className="w-full">
              {t("auth.submit")}
            </Button>
          </div>
        </div>
      </Form>

      <p className="text-balance text-center text-xs font-ui text-muted-foreground">
        {t("auth.terms")}
      </p>
    </div>
  );
}
