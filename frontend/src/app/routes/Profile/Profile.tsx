import { useEffect, useState } from "react";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
import { useAuth } from "@/hooks/useAuth";
import { RawRole, normalizeRawRole } from "@/lib/roles";
import DonatorProfile from "./components/DonatorProfile";
import DirectorProfile from "./components/DirectorProfile";
import type { UserData } from "@/models/types/user.type";
import { userService } from "@/api/services";

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        const data = await userService.getById(user.id);

        if (!data) {
          // Si no hay datos en la base de datos, usar metadata del usuario
          const meta = user.user_metadata as Record<string, unknown> | undefined;
          setUserData({
            id: user.id,
            first_name: meta?.first_name as string | undefined,
            last_name: meta?.last_name as string | undefined,
            birthdate: meta?.birthdate as string | undefined,
            username: meta?.username as string | undefined,
            phone: meta?.phone as string | undefined,
            email: user.email ?? undefined,
            role: meta?.role as string | undefined,
          });
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (isLoading || loadingData) {
    return <FullScreenLoader message="Estamos dejando todo listo para ti!" />;
  }

  if (!user || !userData) {
    return <FullScreenLoader message="Cargando tu perfil..." />;
  }

  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  const metaRole = typeof meta?.["role"] === "string" ? (meta["role"] as string) : undefined;
  const role = normalizeRawRole(userData.role ?? user?.role ?? metaRole);

  switch (role) {
    case RawRole.DIRECTOR:
      return <DirectorProfile user={userData} />;
    case RawRole.DONATOR:
      return <DonatorProfile user={userData} />;
    default:
      return <FullScreenLoader message="Rol no reconocido..." />;
  }
}

