import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default function DirectorView() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Director</CardTitle>
          <CardDescription>
            Bienvenido. Aquí podrás ver un resumen de tus campañas y métricas clave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Stat label="Campañas activas" value="0" />
            <Stat label="Fondos recaudados" value="$0" />
            <Stat label="Donadores recurrentes" value="0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4 bg-background">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
