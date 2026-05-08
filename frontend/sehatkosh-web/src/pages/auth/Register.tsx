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
  User,
  Stethoscope,
  Users,
} from "lucide-react";
import { register as registerUser } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.email(),
  password: z.string().min(6, "Min. 6 characters"),
  role: z.enum(["Patient", "Doctor"]),
});
type FormData = z.infer<typeof schema>;

const stats = [
  { value: "2,000+", label: "Patients" },
  { value: "150+", label: "Doctors" },
  { value: "5,000+", label: "Appointments" },
  { value: "99%", label: "Satisfaction" },
];

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "Patient" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await registerUser(data);
      setAuth(res);
      navigate("/dashboard");
    } catch (err: unknown) {
      const apiMsg =
        err != null &&
        typeof err === "object" &&
        "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError("root", { message: apiMsg ?? "Registration failed. Please try again." });
    }
  };

  const inp = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: 36,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    border: hasError ? "1.5px solid #f87171" : "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: 13,
    background: hasError ? "#fff5f5" : "#f8fafc",
    outline: "none",
    color: "#1e293b",
    transition: "all 0.15s",
  });
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "#059669";
    e.target.style.background = "white";
    e.target.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.1)";
  };
  const onBlur = (err: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = err ? "#f87171" : "#e2e8f0";
    e.target.style.background = err ? "#fff5f5" : "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  return (
    /* height:100vh + overflow:hidden = no scrollbar ever */
    <div style={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "48%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          background:
            "linear-gradient(135deg,#059669 0%,#0d9488 55%,#0891b2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-70px",
            left: "-70px",
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
            top: "48%",
            right: "-80px",
            width: 240,
            height: 240,
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
            gap: 10,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
            SehatKosh
          </span>
        </div>

        {/* Hero */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: "0 0 10px",
            }}
          >
            Join Thousands
            <br />
            of Patients &<br />
            Doctors
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: 14,
              lineHeight: 1.65,
              margin: "0 0 24px",
            }}
          >
            Create your account and take control
            <br />
            of your healthcare journey.
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.13)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <p
                  style={{
                    color: "white",
                    fontSize: 22,
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    margin: "2px 0 0",
                  }}
                >
                  {s.label}
                </p>
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
            borderRadius: 14,
            padding: "16px 18px",
            border: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: 12,
              lineHeight: 1.65,
              fontStyle: "italic",
              margin: "0 0 12px",
            }}
          >
            "Joining SehatKosh as a doctor was the best decision. Patient
            management is now effortless and organized."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#99f6e4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#065f46",
                fontWeight: 700,
                fontSize: 11,
                flexShrink: 0,
              }}
            >
              DR
            </div>
            <div>
              <p
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Dr. Amrit Manjhi
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 11,
                  margin: 0,
                }}
              >
                Cardiologist
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel — overflow:hidden, no scrollbar ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "#f8fafc",
          overflow: "hidden" /* 👈 kills the scrollbar */,
        }}
      >
        <div style={{ width: "100%", maxWidth: 430 }}>
          {/* Mobile logo */}
          <div
            className="flex lg:hidden"
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={16} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>
              SehatKosh
            </span>
          </div>

          {/* Card */}
          <div
            style={{
              background: "white",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              padding: "26px 30px",
              boxShadow:
                "0 1px 4px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 3px",
                }}
              >
                Create account
              </h2>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
                Join SehatKosh — it's free
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Role selector */}
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 7,
                  }}
                >
                  I am a
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {(
                    [
                      {
                        value: "Patient",
                        icon: Users,
                        desc: "Looking for care",
                      },
                      {
                        value: "Doctor",
                        icon: Stethoscope,
                        desc: "Providing care",
                      },
                    ] as const
                  ).map(({ value, icon: Icon, desc }) => {
                    const active = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("role", value)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 4,
                          padding: "11px 8px",
                          borderRadius: 11,
                          cursor: "pointer",
                          border: active
                            ? "2px solid #059669"
                            : "2px solid #e2e8f0",
                          background: active ? "#f0fdf4" : "white",
                          color: active ? "#059669" : "#64748b",
                          transition: "all 0.15s",
                        }}
                      >
                        <Icon size={18} />
                        <span style={{ fontSize: 12, fontWeight: 700 }}>
                          {value}
                        </span>
                        <span style={{ fontSize: 10, opacity: 0.75 }}>
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                {(["firstName", "lastName"] as const).map((field, i) => (
                  <div key={field}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 5,
                      }}
                    >
                      {i === 0 ? "First Name" : "Last Name"}
                    </label>
                    <div style={{ position: "relative" }}>
                      <User
                        size={13}
                        style={{
                          position: "absolute",
                          left: 11,
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                        }}
                      />
                      <input
                        {...register(field)}
                        placeholder={i === 0 ? "Kundan" : "Nirala"}
                        style={inp(!!errors[field])}
                        onFocus={onFocus}
                        onBlur={onBlur(!!errors[field])}
                      />
                    </div>
                    {errors[field] && (
                      <p
                        style={{
                          color: "#ef4444",
                          fontSize: 11,
                          margin: "3px 0 0",
                        }}
                      >
                        {errors[field]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email */}
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={13}
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    style={inp(!!errors.email)}
                    onFocus={onFocus}
                    onBlur={onBlur(!!errors.email)}
                  />
                </div>
                {errors.email && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 11,
                      margin: "3px 0 0",
                    }}
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={13}
                    style={{
                      position: "absolute",
                      left: 11,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    style={{ ...inp(!!errors.password), paddingRight: 40 }}
                    onFocus={onFocus}
                    onBlur={onBlur(!!errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 11,
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
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 11,
                      margin: "3px 0 0",
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
                    borderRadius: 9,
                    padding: "9px 13px",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#ef4444",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "#dc2626", fontSize: 12 }}>
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
                  padding: "12px 0",
                  background: isSubmitting ? "#6ee7b7" : "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: 11,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 10px rgba(5,150,105,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#047857";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#059669";
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin"
                      width={15}
                      height={15}
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
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <div
              style={{
                borderTop: "1px solid #f1f5f9",
                marginTop: 16,
                paddingTop: 14,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#059669",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
