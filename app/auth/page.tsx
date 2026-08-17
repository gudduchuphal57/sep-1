"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import BrandLogo from "../../components/ui/brand-logo";

type AuthMode = "login" | "signup";
type RecoveryStep = "email" | "otp" | null;

const inputClass =
  "h-full w-full rounded-full border-0 bg-transparent px-4 pr-11 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 [&:-webkit-autofill]:[-webkit-text-fill-color:#18181b] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#fff_inset]";
const fieldClass =
  "relative flex h-11 items-center rounded-full border border-zinc-300 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>(null);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const isLogin = mode === "login";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const saved = window.localStorage.getItem("lestow-user");
    const existing = saved ? JSON.parse(saved) : null;
    const name = isLogin
      ? existing?.email === email
        ? existing.name
        : email.split("@")[0]
      : String(data.get("name") || "").trim();
    window.localStorage.setItem(
      "lestow-user",
      JSON.stringify({ name, email, password, avatar: existing?.avatar }),
    );
    router.push("/dashboard");
  };

  const switchMode = (next: AuthMode) => { 
    setMode(next);
    setRecoveryStep(null);
    setShowPassword(false);
  };

  return (
    <main className="h-dvh overflow-hidden bg-white text-zinc-950">
      <section
        className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,13fr)_minmax(0,7fr)]"
        aria-label="Account access"
      >
        <aside className="relative hidden h-dvh min-w-0 overflow-hidden bg-[#020711] text-white lg:flex lg:flex-col">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            aria-hidden="true"
          >
            <source src="/a4.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(1,6,18,.78)_0%,rgba(1,8,22,.52)_52%,rgba(1,6,18,.2)_100%),linear-gradient(180deg,rgba(1,5,14,.2),rgba(0,4,13,.52))]" />

          <div className="relative z-20 mt-[clamp(54px,8vh,96px)] w-full max-w-[900px] px-[clamp(44px,6vw,108px)]">
            <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.16em] text-blue-300 before:size-2 before:rounded-full before:bg-blue-400 before:shadow-[0_0_14px_#4695ff]">
              Lestow AI Website Builder
            </div>
            <h1 className="mt-4 max-w-[720px] text-[clamp(42px,4.4vw,78px)] font-medium leading-[.98] tracking-[-.05em] text-white [text-shadow:0_4px_28px_rgba(0,0,0,.95)]">
              One idea.
              <br />A complete{" "}
              <em className="font-serif font-bold">website.</em>
            </h1>
            <p className="mt-5 max-w-[500px] text-sm font-medium leading-6 text-white/90 2xl:text-base 2xl:leading-7 [text-shadow:0_3px_18px_rgba(0,0,0,1)]">
              Describe your business and watch Lestow shape the structure, copy,
              visuals, and responsive experience in real time.
            </p>

            <div className="mt-9 max-w-[650px] text-white [text-shadow:0_2px_14px_rgba(0,0,0,.95)]">
              <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[.16em] text-blue-200">
                <span>Lestow build path</span>
                <span className="h-px flex-1 bg-gradient-to-r from-blue-300/70 to-transparent" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <span>
                  <small className="text-[8px] font-bold text-cyan-300">
                    01
                  </small>
                  <b className="mt-1 block text-[12px] font-semibold">
                    Your brief
                  </b>
                  <em className="mt-1 block text-[12px] not-italic text-white/55">
                    Business and goals
                  </em>
                </span>
                <span>
                  <small className="text-[8px] font-bold text-blue-300">
                    02
                  </small>
                  <b className="mt-1 block text-[12px] font-semibold">
                    AI composition
                  </b>
                  <em className="mt-1 block text-[12px] not-italic text-white/55">
                    Pages and content
                  </em>
                </span>
                <span>
                  <small className="text-[8px] font-bold text-violet-300">
                    03
                  </small>
                  <b className="mt-1 block text-[12px] font-semibold">
                    Brand polish
                  </b>
                  <em className="mt-1 block text-[12px] not-italic text-white/55">
                    Style and visuals
                  </em>
                </span>
                <span>
                  <small className="text-[8px] font-bold text-emerald-300">
                    04
                  </small>
                  <b className="mt-1 block text-[12px] font-semibold">
                    Live website
                  </b>
                  <em className="mt-1 block text-[12px] not-italic text-white/55">
                    Responsive and ready
                  </em>
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div
          className={`flex h-dvh min-h-0 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_100%_100%,rgba(219,232,255,.62),transparent_35%),#fff] px-6 sm:px-10 lg:px-[clamp(26px,3vw,54px)] ${!isLogin && !recoveryStep ? "py-2" : "py-4"}`}
        >
          <div
            className={`w-full max-w-[410px] 2xl:max-w-[470px] ${!isLogin && !recoveryStep ? "text-[.94rem]" : ""}`}
          >
            <div
              className={`flex justify-start ${!isLogin && !recoveryStep ? "mb-2 h-9 origin-left items-center overflow-visible [&>span]:origin-left [&>span]:scale-[.78]" : "mb-4"}`}
            >
              <BrandLogo />
            </div>

            {recoveryStep ? (
              <RecoveryView
                step={recoveryStep}
                email={recoveryEmail}
                setEmail={setRecoveryEmail}
                onBack={() =>
                  setRecoveryStep(recoveryStep === "otp" ? "email" : null)
                }
                onNext={() => setRecoveryStep("otp")}
                onResetComplete={() => {
                  setMode("login");
                  setRecoveryStep(null);
                }}
              />
            ) : (
              <>
                <div>
                  <h2
                    className={`${isLogin ? "text-lg 2xl:text-2xl" : "text-base 2xl:text-xl"} font-medium tracking-[-.02em]`}
                  >
                    {isLogin ? "Welcome back." : "Create your account"}
                  </h2>
                  <p
                    className="mb-3 mt-1 text-xs text-zinc-400 2xl:text-sm"
                  >
                    {isLogin
                      ? "What can we create next?"
                      : "Start building smarter with AI today."}
                  </p>
                </div>

                <div
                  className="mb-3 grid grid-cols-2 rounded-full border border-zinc-300 bg-zinc-50 p-1"
                  role="tablist"
                  aria-label="Account action"
                >
                  {(["login", "signup"] as AuthMode[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={mode === tab}
                      onClick={() => switchMode(tab)}
                      className={`h-8 rounded-full text-sm font-medium transition ${mode === tab ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200" : "text-zinc-900"}`}
                    >
                      {tab === "login" ? "Log In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                <form
                  className="flex flex-col gap-2.5"
                  onSubmit={submit}
                >
                  {!isLogin && (
                    <Field label="Full name">
                      <input
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={inputClass}
                        required
                      />
                      <User className="absolute right-4 size-4 text-zinc-400" />
                    </Field>
                  )}
                  <Field label="Email">
                    <input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={inputClass}
                      required
                    />
                    <Mail className="absolute right-4 size-4 text-zinc-400" />
                  </Field>
                  <Field label="Password">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={
                        isLogin ? "Enter your password" : "Create a password"
                      }
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      minLength={6}
                      className={inputClass}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 grid size-7 place-items-center text-zinc-400"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </Field>
                  <div className="flex items-center justify-between text-[12px]">
                    <label className="flex items-center gap-1.5 text-zinc-500">
                      <input
                        type="checkbox"
                        className="size-3 accent-blue-600"
                      />
                      {isLogin ? "Remember me" : "I agree to the terms"}
                    </label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setRecoveryStep("email")}
                        className="text-blue-700"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="mt-1 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-sm font-medium text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
                  >
                    {isLogin ? "Start creating" : "Create account"}
                  </button>
                </form>

                <div
                  className="my-3 flex items-center gap-3 text-[12px] text-zinc-500 before:h-px before:flex-1 before:bg-zinc-200 after:h-px after:flex-1 after:bg-zinc-200"
                >
                  OR
                </div>
                <div className="flex items-center justify-center gap-8">
                  <button
                    type="button"
                    aria-label={`${isLogin ? "Login" : "Sign up"} with Google`}
                    title={`${isLogin ? "Login" : "Sign up"} with Google`}
                    className="grid size-10 place-items-center rounded-full bg-transparent transition hover:scale-110"
                  >
                    <FcGoogle className="size-6" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`${isLogin ? "Login" : "Sign up"} with Apple`}
                    title={`${isLogin ? "Login" : "Sign up"} with Apple`}
                    className="grid size-10 place-items-center rounded-full bg-transparent text-zinc-950 transition hover:scale-110 hover:text-blue-700"
                  >
                    <FaApple className="size-6" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
  compact = false,
}: {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label
      className={`grid ${compact ? "gap-1" : "gap-1.5"} text-xs font-medium text-zinc-700 2xl:text-sm`}
    >
      <span>{label}</span>
      <span className={`${fieldClass} ${compact ? "!h-9" : ""}`}>
        {children}
      </span>
    </label>
  );
}

function RecoveryView({
  step,
  email,
  setEmail,
  onBack,
  onNext,
  onResetComplete,
}: {
  step: Exclude<RecoveryStep, null>;
  email: string;
  setEmail: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onResetComplete: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpStatus, setOtpStatus] = useState<"error" | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (otpVerified) {
            setOtpVerified(false);
            setOtp(["", "", "", "", "", ""]);
            return;
          }
          onBack();
        }}
        className="mb-8 flex items-center gap-2 text-[11px] text-zinc-500 hover:text-blue-700"
      >
        <ArrowLeft className="size-4" />
        {otpVerified
          ? "Back to verification"
          : step === "otp"
            ? "Change email"
            : "Back to login"}
      </button>
      <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200">
        {step === "email" ? (
          <Mail className="size-5" />
        ) : (
          <ShieldCheck className="size-5" />
        )}
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        {step === "email"
          ? "Forgot your password?"
          : resetSuccess
            ? "Password reset successfully"
          : otpVerified
            ? "Create a new password"
            : "Enter verification code"}
      </h2>
      <p className="mb-7 mt-2 text-xs leading-5 text-zinc-500">
        {step === "email"
          ? "Enter the email linked to your account and we’ll send you a verification code."
          : resetSuccess
            ? "Your password has been updated. Redirecting you to login..."
          : otpVerified
            ? "Choose a strong password for your account."
            : `We sent a 6-digit code to ${email}.`}
      </p>
      {step === "email" ? (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onNext();
          }}
        >
          <Field label="Email address">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
              className={inputClass}
              required
            />
            <Mail className="absolute right-4 size-4 text-zinc-400" />
          </Field>
          <button
            className="h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-sm font-medium text-white shadow-lg shadow-blue-200"
            type="submit"
          >
            Send verification code
          </button>
        </form>
      ) : resetSuccess ? (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          <ShieldCheck className="size-5 shrink-0" />
          Password changed successfully.
        </div>
      ) : otpVerified ? (
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const password = String(data.get("newPassword") ?? "");
            const confirmation = String(data.get("confirmNewPassword") ?? "");

            if (password !== confirmation) {
              setPasswordError("Passwords do not match.");
              return;
            }

            setPasswordError(null);
            setResetSuccess(true);
            window.setTimeout(onResetComplete, 1500);
          }}
        >
          <Field label="Enter new password">
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              autoComplete="new-password"
              minLength={6}
              autoFocus
              className={inputClass}
              onChange={() => setPasswordError(null)}
              required
            />
          </Field>
          <Field label="Re-enter new password">
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Re-enter new password"
              autoComplete="new-password"
              minLength={6}
              className={inputClass}
              onChange={() => setPasswordError(null)}
              required
            />
          </Field>
          {passwordError && (
            <p role="alert" className="text-[11px] font-medium text-red-600">
              {passwordError}
            </p>
          )}
          <button
            className="mt-1 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-sm font-medium text-white shadow-lg shadow-blue-200"
            type="submit"
          >
            Reset password
          </button>
        </form>
      ) : (
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (otp.join("") === "123456") {
              setOtpStatus(null);
              setOtpVerified(true);
              return;
            }
            setOtpStatus("error");
          }}
        >
          <fieldset>
            <legend className="mb-2 text-[11px]">Verification code</legend>
            <div
              className="grid grid-cols-6 gap-2"
              onPaste={(event) => {
                const digits = event.clipboardData
                  .getData("text")
                  .replace(/\D/g, "")
                  .slice(0, 6);

                if (!digits) return;

                event.preventDefault();
                setOtp(
                  Array.from({ length: 6 }, (_, index) => digits[index] ?? ""),
                );
                setOtpStatus(null);

                const inputs = event.currentTarget.querySelectorAll("input");
                window.requestAnimationFrame(() => {
                  inputs[Math.min(digits.length, 6) - 1]?.focus();
                });
              }}
            >
              {Array.from({ length: 6 }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={otp[index]}
                  aria-label={`Digit ${index + 1}`}
                  aria-invalid={otpStatus === "error"}
                  autoFocus={index === 0}
                  onChange={(event) => {
                    const value = event.currentTarget.value
                      .replace(/\D/g, "")
                      .slice(-1);
                    setOtp((current) =>
                      current.map((digit, digitIndex) =>
                        digitIndex === index ? value : digit,
                      ),
                    );
                    setOtpStatus(null);
                    if (value)
                      (
                        event.currentTarget
                          .nextElementSibling as HTMLInputElement | null
                      )?.focus();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !event.currentTarget.value)
                      (
                        event.currentTarget
                          .previousElementSibling as HTMLInputElement | null
                      )?.focus();
                  }}
                  className="aspect-square min-w-0 rounded-xl border border-zinc-300 text-center text-xl font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              ))}
            </div>
            {otpStatus && (
              <p
                role="alert"
                className="mt-2 text-[11px] font-medium text-red-600"
              >
                Incorrect code. Please try again.
              </p>
            )}
          </fieldset>
          <button
            className="h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-sm font-medium text-white shadow-lg shadow-blue-200"
            type="submit"
          >
            Verify code
          </button>
          <p className="text-center text-[11px] text-zinc-500">
            Didn’t receive the code?{" "}
            <button type="button" className="font-semibold text-blue-700">
              Resend code
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
