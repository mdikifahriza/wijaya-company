import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { CtaTableClient } from "./cta-client";

export default async function CtaPage() {
  await connection();
  const { ctaSections } = await getAdminPageData();

  return (
    <SectionShell title="Call to Action">
      <CtaTableClient initialCta={ctaSections} />
    </SectionShell>
  );
}
