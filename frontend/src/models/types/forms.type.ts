export type FieldConfig = {
  label: string
  type: string
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}

export type StepConfig = {
  title?: string;
  fields: Record<string, FieldConfig>;
};