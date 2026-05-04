import { connection } from "next/server";

import {
  SectionShell,
} from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { SiteSettingsClient } from "./site-settings-client";

export default async function SiteSettingsPage() {
  await connection();
  const { siteSettings } = await getAdminPageData();

  return (
    <SectionShell title="Pengaturan Web">
      <SiteSettingsClient siteSettings={siteSettings} />
    </SectionShell>
  );
}
