import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { ServicesTableClient } from "./services-client";

export default async function ServicesPage() {
  await connection();
  const { services } = await getAdminPageData();

  return (
    <SectionShell title="Layanan">
      <ServicesTableClient initialServices={services} />
    </SectionShell>
  );
}
