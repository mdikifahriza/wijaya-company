import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { FooterTableClient } from "./footer-client";

export default async function FooterPage() {
  await connection();
  const { footerColumns } = await getAdminPageData();

  return (
    <SectionShell title="Footer">
      <FooterTableClient initialColumns={footerColumns} />
    </SectionShell>
  );
}
