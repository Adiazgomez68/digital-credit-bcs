import { View } from "@/components/shared/view";

const STATS = [
  { value: "+180.000", label: "solicitudes procesadas en línea" },
  { value: "< 3 min", label: "para obtener tu simulación preliminar" },
  { value: "100%", label: "digital, sin desplazamientos a oficina" },
] as const;

export function TrustStats() {
  return (
    <section className="border-t border-b border-border bg-surface-2">
      <View size="wide" className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="text-2xl font-semibold text-primary">
              {stat.value}
            </div>

            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </View>
    </section>
  );
}
