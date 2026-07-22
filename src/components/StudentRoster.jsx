import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { ActionButton, EmptyState, SelectField, TextInput } from "./VcmUI";
import { normalizeStudentRut } from "../utils/studentRut";
import { createEmptyStudentRow } from "../utils/studentRoster";

export function StudentRosterEditor({ rows, onChange, teamCount }) {
  const teamOptions = Array.from({ length: Number(teamCount) || 0 }, (_, index) => ({
    value: String(index + 1),
    label: `Equipo ${index + 1}`,
  }));

  const updateRow = (index, field, value) => {
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [field]: value } : row)));
  };

  const removeRow = (index) => {
    const next = rows.filter((_, rowIndex) => rowIndex !== index);
    onChange(next.length ? next : [createEmptyStudentRow()]);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="hidden grid-cols-[minmax(0,1fr)_220px_48px] gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-neutral-500 md:grid">
          <span>RUT del alumno</span>
          <span>Equipo</span>
          <span className="sr-only">Acciones</span>
        </div>
        <div className="divide-y divide-neutral-100">
          {rows.map((row, index) => (
            <div key={row.rowId || index} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px_48px] md:items-end">
              <TextInput
                label={index === 0 ? "RUT del alumno" : `Alumno ${index + 1}`}
                required
                value={row.rut}
                onChange={(value) => updateRow(index, "rut", normalizeStudentRut(value))}
                placeholder="12345678-5"
              />
              <SelectField
                label="Equipo opcional"
                value={row.teamNumber || ""}
                onChange={(value) => updateRow(index, "teamNumber", value)}
                options={teamOptions}
                placeholder="Sin asignar"
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                aria-label={`Eliminar alumno ${index + 1}`}
                title="Eliminar alumno"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-neutral-500">
          {rows.filter((row) => row.rut).length} alumno(s) ingresado(s)
        </p>
        <ActionButton variant="outline" icon={<Plus className="h-5 w-5" />} onClick={() => onChange([...rows, createEmptyStudentRow()])}>
          Agregar alumno
        </ActionButton>
      </div>
    </div>
  );
}

export function StudentRosterSummary({ participants, emptyDescription = "La cantidad histórica existe, pero aún no se han registrado RUT." }) {
  if (!participants?.length) {
    return <EmptyState title="Nómina pendiente" description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2 text-neutral-700">
          <Users className="h-5 w-5" />
          <p className="text-sm font-black">Alumnos registrados</p>
        </div>
        <span className="text-sm font-black text-neutral-950">{participants.length}</span>
      </div>
      <div className="divide-y divide-neutral-100">
        {participants.map((participant) => (
          <div key={participant.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <code className="font-black text-neutral-950">{participant.rut}</code>
            <span className="font-semibold text-neutral-500">
              {participant.teamNumber ? `Equipo ${participant.teamNumber}` : "Equipo sin asignar"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentRosterCompactSummary({ participants, onUpdate }) {
  if (!participants?.length) return null;

  const assignedTeams = new Set(participants.map((participant) => participant.teamNumber).filter(Boolean)).size;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-700 ring-1 ring-neutral-200">
          <Users className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black text-neutral-950">Nómina guardada</p>
          <p className="mt-1 text-sm font-semibold text-neutral-500">
            {participants.length} alumno(s) · {assignedTeams || 0} equipo(s) con integrantes
          </p>
        </div>
      </div>
      {onUpdate && (
        <ActionButton variant="outline" icon={<Pencil className="h-5 w-5" />} onClick={onUpdate}>
          Actualizar
        </ActionButton>
      )}
    </div>
  );
}
