import { useEffect, useState } from "react";
import { client } from "@/api/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { RawRole } from "@/lib/roles";

interface UserWithRole extends User {
  role?: RawRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await client.auth.getSession();

        if (session?.user) {
          const { data: userData, error } = await client
            .from("user")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (!error && userData) {
            setUser({ ...session.user, role: userData.role as RawRole });
          } else {
            setUser({ ...session.user, role: undefined });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Obtener el rol del usuario desde la base de datos
        const { data: userData, error } = await client
          .from("user")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && userData) {
          setUser({ ...session.user, role: userData.role as RawRole });
        } else {
          setUser({ ...session.user, role: undefined });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await client.auth.signOut();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };
};
