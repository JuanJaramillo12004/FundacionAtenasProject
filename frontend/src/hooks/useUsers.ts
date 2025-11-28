import { useState, useEffect } from "react";
import { userService } from "@/api/services";
import type { User, UserRole } from "@/api/types/database.types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAll();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getById(userId);
        setUser(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}

/**
 * Hook para obtener usuarios por rol
 */
export function useUsersByRole(role: UserRole) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getByRole(role);
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await userService.getByRole(role);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch };
}
