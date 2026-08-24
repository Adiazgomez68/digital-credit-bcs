import { View } from "@/components/shared/view";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <View
        size="wide"
        className="flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left"
      >
        <p className="text-xs text-text-faint">
          © 2026 Crédito Libre Destino. Producto de crédito de libre destino.
        </p>

        <p className="text-xs text-text-faint">
          Simulación preliminar, no vinculante. Sujeta a verificación y
          políticas vigentes.
        </p>
      </View>
    </footer>
  );
}
