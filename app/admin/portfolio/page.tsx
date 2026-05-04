import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { PortfolioTableClient } from "./portfolio-client";

export default async function PortfolioPage() {
  await connection();
  const { portfolios } = await getAdminPageData();

  return (
    <SectionShell title="Referensi Web">
      <PortfolioTableClient initialPortfolios={portfolios} />
    </SectionShell>
  );
}
