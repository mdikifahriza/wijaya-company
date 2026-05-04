import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { PackagesTableClient } from "./packages-client";

export default async function PackagesPage() {
  await connection();
  const { packagePlans } = await getAdminPageData();

  return (
    <SectionShell title="Paket Website">
      <PackagesTableClient initialPackages={packagePlans} />
    </SectionShell>
  );
}
