import { useState } from "react";
import { client } from "@/api/supabase/client";
import { Camera, User } from "lucide-react";
import { toast } from "sonner";

interface UploadAvatarProps {
  userId: string;
  currentAvatar?: string;
  onUpload: (url: string) => void;
}

export default function UploadAvatar({
  userId,
  currentAvatar,
  onUpload,
}: UploadAvatarProps) {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        toast.error("Error", {
          description: "Debe seleccionar una imagen",
        });
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await client.storage
        .from("profile_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data, error: signedUrlError } = await client.storage
        .from("profile_images")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365);

      if (signedUrlError) throw signedUrlError;
      
      toast.success("Foto actualizada", {
        description: "Tu foto de perfil se ha actualizado correctamente",
      });
      
      onUpload(data.signedUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Ocurrió un error inesperado";
      toast.error("Error al subir la imagen", {
        description: message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-lg overflow-hidden">
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={64} strokeWidth={1.5} />
        )}
      </div>
      <label
        htmlFor={`avatar-upload-${userId}`}
        className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/90 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
      >
        <Camera size={20} />
        <input
          id={`avatar-upload-${userId}`}
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
