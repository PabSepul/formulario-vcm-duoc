import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  ShieldCheck,
  UserCog,
  UserRoundCheck,
} from "lucide-react";
import { AuthShell, ActionButton, Notice, RoleBadge, TextInput } from "../components/VcmUI";
import { demoUsers, ensureVcmData, roles, setSession } from "../data/vcmPlatform";

const roleIcons = {
  admin: <UserCog className="h-6 w-6" />,
  vcm: <ShieldCheck className="h-6 w-6" />,
  ee: <Building2 className="h-6 w-6" />,
  jc: <GraduationCap className="h-6 w-6" />,
  docente: <UserRoundCheck className="h-6 w-6" />,
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("admin@duoc.cl");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const selectedDemo = useMemo(() => demoUsers.find((user) => user.role === selectedRole), [selectedRole]);

  const chooseRole = (role) => {
    const user = demoUsers.find((item) => item.role === role);
    setSelectedRole(role);
    setEmail(user?.email || "");
    setPassword("demo123");
    setError("");
  };

  const submit = (event) => {
    event.preventDefault();
    ensureVcmData();

    const user = demoUsers.find((item) => item.role === selectedRole && item.email === email && item.password === password);
    if (!user) {
      setError("Credenciales demo no válidas para el rol seleccionado.");
      return;
    }

    setSession({
      role: user.role,
      email: user.email,
      name: user.name,
      school: user.school,
      career: user.career,
      careers: user.careers,
      subjects: user.subjects,
      loggedAt: new Date().toISOString(),
    });
    navigate(roles[user.role].route);
  };

  return (
    <AuthShell>
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b68400]">Acceso a plataforma</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-neutral-950">Iniciar sesión</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-500">
          Selecciona un rol para probar las bandejas y acciones del flujo propuesto.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {Object.entries(roles).map(([key, role]) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseRole(key)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedRole === key ? "border-[#f5b400] bg-[#fff8df]" : "border-neutral-200 bg-white hover:bg-neutral-50"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-neutral-950">{roleIcons[key]}</div>
                <RoleBadge role={key} />
              </div>
              <p className="text-sm font-black text-neutral-950">{role.label}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">{role.description}</p>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-5">
            <Notice type="error">{error}</Notice>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5">
          <TextInput label="Correo" type="email" value={email} onChange={setEmail} placeholder={selectedDemo?.email || "correo@duoc.cl"} required />
          <TextInput label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="demo123" required />

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
            <p className="font-black text-neutral-950">Credenciales demo</p>
            <p className="mt-1">Usa la contraseña <span className="font-black">demo123</span>. Al elegir un rol se completa su correo de prueba.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/registro" className="text-sm font-extrabold text-neutral-700 underline decoration-[#f5b400] decoration-2 underline-offset-4">
              Registrar Socio formador
            </Link>
            <ActionButton type="submit" icon={<ArrowRight className="h-5 w-5" />}>
              Entrar
            </ActionButton>
          </div>
        </form>
      </section>
    </AuthShell>
  );
}
