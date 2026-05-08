import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Shield,
  Clock,
} from "lucide-react";
import { login } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

const features = [
  { icon: Activity, text: "Real-time health monitoring" },
  { icon: Shield, text: "Secure & private records" },
  { icon: Clock, text: "24/7 appointment booking" },
];

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data);
      setAuth(res);
      navigate("/dashboard");
    } catch {
      setError("root", {
        message: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "50%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          background:
            "linear-gradient(135deg,#059669 0%,#0d9488 55%,#0891b2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles — clipped by overflow:hidden on parent */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "52%",
            right: "-90px",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "38%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={22} color="white" fill="white" />
          </div>
          <span
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            SehatKosh
          </span>
        </div>

        {/* Hero text + features */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              color: "white",
              fontSize: 42,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 14px",
            }}
          >
            Your Health,
            <br />
            Our Priority
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: 16,
              lineHeight: 1.65,
              margin: "0 0 32px",
            }}
          >
            Manage appointments, records, and connect
            <br />
            with top doctors — all in one place.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{ display: "flex", alignItems: "center", gap: 14 }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 11,
                    background: "rgba(255,255,255,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} color="white" />
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.13)",
            borderRadius: 16,
            padding: "20px 22px",
            border: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 13,
              lineHeight: 1.7,
              fontStyle: "italic",
              margin: "0 0 14px",
            }}
          >
            "SehatKosh ne meri health management bilkul aasan kar di. Doctors se
            connect karna aur appointments lena ab bahut easy hai."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#6ee7b7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#065f46",
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              AK
            </div>
            <div>
              <p
                style={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Rahul Dev
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                Patient since 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "#f8fafc",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <div
            className="flex lg:hidden"
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={18} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
              SehatKosh
            </span>
          </div>

          {/* Card */}
          <div
            style={{
              background: "white",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              padding: "36px 38px",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 4px",
                }}
              >
                Welcome back
              </h2>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                Sign in to your SehatKosh account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 7,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={15}
                    style={{
                      position: "absolute",
                      left: 13,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      paddingLeft: 40,
                      paddingRight: 16,
                      paddingTop: 13,
                      paddingBottom: 13,
                      border: errors.email
                        ? "1.5px solid #f87171"
                        : "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      fontSize: 14,
                      background: errors.email ? "#fff5f5" : "#f8fafc",
                      outline: "none",
                      color: "#1e293b",
                      transition: "all 0.15s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#059669";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5,150,105,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email
                        ? "#f87171"
                        : "#e2e8f0";
                      e.target.style.background = errors.email
                        ? "#fff5f5"
                        : "#f8fafc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                {errors.email && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 12,
                      margin: "5px 0 0",
                    }}
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 7,
                  }}
                >
                  <label
                    style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    style={{
                      fontSize: 12,
                      color: "#059669",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={15}
                    style={{
                      position: "absolute",
                      left: 13,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      paddingLeft: 40,
                      paddingRight: 44,
                      paddingTop: 13,
                      paddingBottom: 13,
                      border: errors.password
                        ? "1.5px solid #f87171"
                        : "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      fontSize: 14,
                      background: errors.password ? "#fff5f5" : "#f8fafc",
                      outline: "none",
                      color: "#1e293b",
                      transition: "all 0.15s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#059669";
                      e.target.style.background = "white";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5,150,105,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password
                        ? "#f87171"
                        : "#e2e8f0";
                      e.target.style.background = errors.password
                        ? "#fff5f5"
                        : "#f8fafc";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 12,
                      margin: "5px 0 0",
                    }}
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Root error */}
              {errors.root && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: 10,
                    padding: "11px 15px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#ef4444",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#dc2626", fontSize: 13 }}>
                    {errors.root.message}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: isSubmitting ? "#6ee7b7" : "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 10px rgba(5,150,105,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#047857";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 14px rgba(5,150,105,0.45)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#059669";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 2px 10px rgba(5,150,105,0.35)";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="4"
                      />
                      <path fill="white" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                marginTop: 24,
                paddingTop: 20,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#059669",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 18,
            }}
          >
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
