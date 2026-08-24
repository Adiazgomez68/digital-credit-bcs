import { Header } from "@/components/layout/header";
import { MarketingNav } from "@/components/layout/marketing-nav";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header>
        <MarketingNav />
      </Header>

      {children}
    </>
  );
}
