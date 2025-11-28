import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { normalizeRawRole, type RawRole } from "@/lib/roles";
import { authService, userService } from "@/api/services";

interface UserWithRole extends User {
  role?: RawRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await authService.getSession();

        if (session?.user) {
          // Intentar obtener el rol desde la tabla "user" usando el servicio
          const role = await userService.getUserRole(session.user.id);

          const meta = session.user.user_metadata ?? {};
          const metaRole =
            typeof meta["role"] === "string" ? (meta["role"] as string) : undefined;

          const finalRole = role
            ? (normalizeRawRole(role as string) as RawRole)
            : (normalizeRawRole(metaRole) as RawRole);

          setUser({ ...session.user, role: finalRole });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error cargando sesión:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Escucha cambios de autenticación
    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        const metaRole =
          typeof meta["role"] === "string" ? (meta["role"] as string) : undefined;

        setUser({
          ...session.user,
          role: normalizeRawRole(metaRole),
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };
};
