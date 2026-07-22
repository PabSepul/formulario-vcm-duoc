export function createEmptyStudentRow() {
  return { rowId: `row-${Date.now()}-${Math.random().toString(16).slice(2)}`, rut: "", teamNumber: "" };
}
