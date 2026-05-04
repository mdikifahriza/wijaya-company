import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { SocialLinksTableClient } from "./social-client";

export default async function SocialLinksPage() {
  await connection();
  const { socialLinks } = await getAdminPageData();

  return (
    <SectionShell title="Tautan Sosial">
      <SocialLinksTableClient initialLinks={socialLinks} />
    </SectionShell>
  );
}
