import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { normalizeRawRole, type RawRole } from "@/lib/roles";
import { authService, userService } from "@/api/services";

interface UserWithRole extends User {
  role?: RawRole;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Enriquece el usuario de Supabase con datos de la base de datos
const enrichUserWithDBData = async (supabaseUser: User): Promise<UserWithRole> => {
  const dbUser = await userService.getById(supabaseUser.id);
  const meta = supabaseUser.user_metadata ?? {};
  const metaRole = typeof meta["role"] === "string" ? meta["role"] : undefined;

  const finalRole = dbUser?.role
    ? (normalizeRawRole(dbUser.role as string) as RawRole)
    : (normalizeRawRole(metaRole) as RawRole);

  return {
    ...supabaseUser,
    role: finalRole,
    username: dbUser?.username,
    first_name: dbUser?.first_name,
    last_name: dbUser?.last_name,
  };
};

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await authService.getSession();

        if (session?.user) {
          const enrichedUser = await enrichUserWithDBData(session.user);
          setUser(enrichedUser);
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
    } = authService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const enrichedUser = await enrichUserWithDBData(session.user);
          setUser(enrichedUser);
        } catch (err) {
          console.error("Error actualizando usuario:", err);
          const meta = session.user.user_metadata ?? {};
          setUser({
            ...session.user,
            role: normalizeRawRole(meta["role"] as string | undefined),
          });
        }
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
