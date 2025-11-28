import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { getRoleLabel } from "@/lib/roles";
import { toast } from "sonner";
import type { UserData } from "@/models/types/user.type";
import { DatePickerField } from "@/components/common/DatePickerField";
import { updateUserSchema } from "@/models/schemas/user.schema";
import { validateClient } from "@/lib/zodUtils";
import UploadAvatar from "@/components/common/UploadAvatar";
import { userService } from "@/api/services";

type DonatorProfileProps = {
  user: UserData;
};

export default function DonatorProfile({ user }: DonatorProfileProps) {
  const [first_name, setFirstName] = useState<string>(user?.first_name ?? "");
  const [last_name, setLastName] = useState<string>(user?.last_name ?? "");
  const [birthdate, setBirthdate] = useState<string>(user?.birthdate ?? "");
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [phone, setPhone] = useState<string>(user?.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.profile_images_id ?? "");
  const [saving, setSaving] = useState(false);

  const roleLabel = getRoleLabel(user.role ?? "DONATOR");

  const handleAvatarUpload = async (url: string) => {
    try {
      await userService.updateProfileImage(user.id, url);
      setAvatarUrl(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "No se pudo actualizar la foto de perfil.";
      toast.error("Error al actualizar la foto de perfil", {
        description: msg,
      });
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      // Preparar datos para validación
      const dataToUpdate = {
        first_name,
        last_name,
        birthdate,
        username,
        phone: phone || undefined,
      };

      // Validar datos con Zod
      const validation = validateClient(updateUserSchema, dataToUpdate);

      if (!validation.success) {
        toast.error("Datos inválidos", {
          description: validation.error,
        });
        setSaving(false);
        return;
      }

      if (!validation.data) {
        toast.error("Error en la validación");
        setSaving(false);
        return;
      }

      await userService.update(user.id, validation.data);
      toast.success("Perfil actualizado", {
        description: "Tus cambios se han guardado correctamente",
      });
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo guardar el perfil.";
      toast.error("Error al guardar", {
        description: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección de foto de perfil */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Foto de perfil */}
            <UploadAvatar 
              userId={user.id} 
              currentAvatar={avatarUrl} 
              onUpload={handleAvatarUpload} 
            />

            {/* Información básica */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">
                {first_name && last_name
                  ? `${first_name} ${last_name}`
                  : "Tu nombre"}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {roleLabel}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección de información personal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
            <CardDescription>Actualiza tus datos personales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name" className="mb-2">
                  Nombre
                </Label>
                <Input
                  id="first_name"
                  className="w-full"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <Label htmlFor="last_name" className="mb-2">
                  Apellido
                </Label>
                <Input
                  id="last_name"
                  className="w-full"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username" className="mb-2">
                  Nombre de usuario
                </Label>
                <Input
                  id="username"
                  className="w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usuario123"
                />
              </div>
              <div>
                <Label htmlFor="birthdate" className="mb-2">
                  Fecha de nacimiento
                </Label>
                <DatePickerField
                  value={birthdate}
                  onChange={setBirthdate}
                  placeholder="Selecciona tu fecha de nacimiento"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de contacto</CardTitle>
            <CardDescription>
              Administra tu información de contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="mb-2">
                Correo electrónico
              </Label>
              <Input
                id="email"
                className="w-xs"
                value={user.email ?? ""}
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">
                El correo no puede ser modificado
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="mb-2">
                Teléfono
              </Label>
              <Input
                id="phone"
                className="w-xs"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón de guardar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
