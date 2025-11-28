import { Navigate } from "react-router-dom";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useAuth } from "@/hooks/useAuth";
import { normalizeRawRole } from "@/lib/roles";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles?: string[];
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const metaRole =
      typeof meta?.["role"] === "string" ? (meta["role"] as string) : undefined;

    const raw = (user?.role as string | undefined) ?? metaRole;
    const normalized = raw ? normalizeRawRole(raw) : undefined;

    if (!normalized || !allowedRoles.includes(normalized)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
