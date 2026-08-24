import { ApplicationStoreProvider } from "@/providers/application-store-provider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ApplicationStoreProvider>{children}</ApplicationStoreProvider>;
}
