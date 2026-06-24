import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";
import { clearSession, getNavigationForRole, getRoleHome, getSession, roles, roleStyles, statusMeta } from "../data/vcmPlatform";

export function AppShell({ children, active = "dashboard" }) {
  const navigate = useNavigate();
  const session = getSession();

  const logout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <header className="border-b-2 border-[#f5b400] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to={getRoleHome(session?.role)} className="text-3xl font-black tracking-tight">
            <span className="text-[#f5b400]">Duoc</span>
            <span className="text-neutral-950">UC</span>
          </Link>

          <nav className="hidden items-center gap-2 text-sm font-bold lg:flex">
            {getNavigationForRole(session?.role).map((item) => (
              <NavLink key={item.to} active={active === item.active} to={item.to}>{item.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 sm:flex">
              <UserCircle className="h-6 w-6" />
              <div className="leading-tight">
                <p className="text-xs font-black text-neutral-950">{session?.name || "Usuario demo"}</p>
                <p className="text-[11px] font-semibold text-neutral-500">{roles[session?.role]?.label || "Sin rol"}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-extrabold text-neutral-950 transition hover:bg-neutral-100"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-9">{children}</div>
    </main>
  );
}

function NavLink({ active, to, children }) {
  return (
    <Link
      to={to}
      className={`rounded-xl px-4 py-2 transition ${active ? "bg-[#f5b400] text-neutral-950" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"}`}
    >
      {children}
    </Link>
  );
}

export function AuthShell({ children }) {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-neutral-950">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="rounded-3xl bg-neutral-950 p-8 text-white shadow-sm">
          <div className="text-4xl font-black tracking-tight">
            <span className="text-[#f5b400]">Duoc</span>
            <span>UC</span>
          </div>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#f5b400]">Plataforma VCM</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Gestión de proyectos con Socio formador</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-neutral-300">
            Acceso por rol para registrar propuestas, validar con contraparte, asignar académicamente, ejecutar hitos y cerrar proyectos.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {Object.entries(roles).map(([key, role]) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-black text-white">{role.short}</p>
                <p className="mt-1 text-sm text-neutral-300">{role.label}</p>
              </div>
            ))}
          </div>
        </section>
        {children}
      </div>
    </main>
  );
}

export function PageIntro({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b68400]">{eyebrow}</p>
        <h1 className="text-4xl font-black tracking-tight text-neutral-950">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-base leading-7 text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function Section({ number, title, subtitle, children, className = "", headerClassName = "" }) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${className}`}>
      <div className={`mb-5 flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3 ${headerClassName}`}>
        {number && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f5b400] text-sm font-extrabold text-neutral-950">
            {number}
          </div>
        )}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-950">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children, required = false }) {
  return (
    <label className="mb-2 block text-sm font-bold text-neutral-950">
      {children} {required && <span className="text-red-600">*</span>}
    </label>
  );
}

export function TextInput({ label, value, onChange, placeholder, required, type = "text", icon, readOnly }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-neutral-500">{icon}</div>}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30 ${icon ? "pl-10" : ""} ${readOnly ? "bg-neutral-100 font-bold" : ""}`}
        />
      </div>
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, required, rows = 4, maxLength }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <FieldLabel required={required}>{label}</FieldLabel>
        {maxLength && (
          <span className="mb-2 text-xs font-semibold text-neutral-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options, placeholder, required }) {
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-neutral-300 bg-white px-4 pr-10 text-sm text-neutral-800 outline-none transition focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/30"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const valueOption = typeof option === "string" ? option : option.value;
            const labelOption = typeof option === "string" ? option : option.label;
            return (
              <option key={valueOption} value={valueOption}>
                {labelOption}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-neutral-500" />
      </div>
    </div>
  );
}

export function ActionButton({ children, icon, variant = "primary", onClick, disabled, type = "button" }) {
  const variants = {
    primary: "bg-[#f5b400] text-neutral-950 hover:bg-[#d99d00]",
    dark: "bg-neutral-950 text-white hover:bg-neutral-800",
    outline: "border border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-100",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-extrabold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function RoleBadge({ role }) {
  const roleKey = role || "sis";
  const label = roles[roleKey]?.short || "SIS";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${roleStyles[roleKey] || roleStyles.sis}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const tone = statusMeta[status]?.tone || "neutral";
  const styles = {
    neutral: "border-neutral-200 bg-neutral-100 text-neutral-700",
    warning: "border-[#f5b400]/40 bg-[#fff8df] text-[#6b4a00]",
    success: "border-green-200 bg-green-50 text-green-900",
    danger: "border-red-200 bg-red-50 text-red-900",
    info: "border-sky-200 bg-sky-50 text-sky-900",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${styles[tone]}`}>
      {status}
    </span>
  );
}

export function StatCard({ icon, label, value, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-[#fff8df] p-2 text-[#b68400]">{icon}</div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wide text-neutral-400">{label}</p>
          <p className="mt-1 truncate text-base font-black text-neutral-950">{value}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Notice({ type = "info", children }) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-neutral-200 bg-white text-neutral-800",
    warning: "border-[#f5b400]/40 bg-[#fff8df] text-[#6b4a00]",
  };

  return <div className={`rounded-2xl border p-4 text-sm font-semibold shadow-sm ${styles[type]}`}>{children}</div>;
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
      <p className="text-lg font-black text-neutral-950">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
