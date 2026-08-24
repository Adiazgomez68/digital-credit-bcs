"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { View } from "@/components/shared/view";

interface HeaderProps {
  isAdvisor?: boolean;
  onLogout?: () => void;
  children?: React.ReactNode;
}

export function Header({
  isAdvisor,
  onLogout,
  children,
}: Readonly<HeaderProps>) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <View size="wide" className="flex items-center justify-between py-5">
        <div className="font-heading text-xl font-semibold">
          Crédito Libre Destino
        </div>

        {isAdvisor ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <Avatar size="sm">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium">Asesor</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={onLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">{children}</div>
        )}
      </View>
    </header>
  );
}
