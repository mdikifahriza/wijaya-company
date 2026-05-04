import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { HeroTableClient } from "./hero-client";

export default async function HeroPage() {
  await connection();
  const { heroSections } = await getAdminPageData();

  return (
    <SectionShell title="Hero">
      <HeroTableClient initialHero={heroSections} />
    </SectionShell>
  );
}
