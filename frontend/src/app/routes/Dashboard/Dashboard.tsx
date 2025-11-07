import { useAuth } from "@/hooks/useAuth";
import { RawRole } from "@/lib/roles";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import AdminView from "./components/AdminView";
import DonatorView from "./components/DonatorView";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader message="Estamos dejando todo listo para ti!" />;
  }

  if (!user?.role) {
    return <FullScreenLoader message="Cargando tu panel de control..." />;
  }

  switch (user.role) {
    case RawRole.ADMIN:
      return <AdminView />;
    case RawRole.DONATOR:
      return <DonatorView />;
    default:
      return <FullScreenLoader message="Rol no reconocido..." />;
  }
}
