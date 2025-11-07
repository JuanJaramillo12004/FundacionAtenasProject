// Utilidades y definiciones relacionadas con Roles de usuario

export const RawRole = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  DONATOR: 'DONATOR',
} as const;

export type RawRole = typeof RawRole[keyof typeof RawRole];

const ALL_ROLE_VALUES: RawRole[] = Object.values(RawRole);

// Mapeo a etiquetas legibles para UI.
const roleLabels: Record<RawRole, string> = {
  [RawRole.ADMIN]: 'Admin',
  [RawRole.DIRECTOR]: 'Director',
  [RawRole.DONATOR]: 'Donador',
};

// Normaliza una cadena proveniente del backend a un RawRole conocido.
export function normalizeRawRole(raw?: string | null): RawRole {
  if (!raw || typeof raw !== 'string') return RawRole.DONATOR;
  const upper = raw.trim().toUpperCase();
  return (ALL_ROLE_VALUES.includes(upper as RawRole) ? (upper as RawRole) : RawRole.DONATOR);
}

export function getRoleLabel(role: RawRole | string | null | undefined): string {
  if (!role) return roleLabels[RawRole.DONATOR];
  const normalized = normalizeRawRole(String(role));
  return roleLabels[normalized];
}

export interface NormalizedRoleInfo {
  role: RawRole;
  label: string;
}

export function buildRoleInfo(raw?: string | null): NormalizedRoleInfo {
  const role = normalizeRawRole(raw);
  return { role, label: getRoleLabel(role) };
}
