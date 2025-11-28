import { useAuth } from "@/hooks/useAuth";
import { RawRole, normalizeRawRole } from "@/lib/roles";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import AdminView from "./components/AdminView";
import DonatorView from "./components/DonatorView";
import DirectorView from "./components/DirectorView";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader message="Estamos dejando todo listo para ti!" />;
  }

  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const metaRole = typeof meta?.["role"] === "string" ? (meta["role"] as string) : undefined;
  const role = normalizeRawRole(user?.role ?? metaRole);

  switch (role) {
    case RawRole.ADMIN:
      return <AdminView />;
    case RawRole.DIRECTOR:
      return <DirectorView />;
    case RawRole.DONATOR:
      return <DonatorView />;
    default:
      return <FullScreenLoader message="Rol no reconocido..." />;
  }
}
