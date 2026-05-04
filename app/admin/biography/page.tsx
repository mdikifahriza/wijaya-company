import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { BioTableClient } from "./bio-client";

export default async function BiographyPage() {
  await connection();
  const { biographies } = await getAdminPageData();

  return (
    <SectionShell title="Biografi">
      <BioTableClient initialBio={biographies} />
    </SectionShell>
  );
}
