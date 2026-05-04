import { connection } from "next/server";

import { EmptyState, SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { SeoTableClient } from "./seo-client";

export default async function SeoPage() {
  await connection();
  const { seoMetadata } = await getAdminPageData();

  return (
    <SectionShell title="SEO">
      {seoMetadata.length === 0 ? (
        <EmptyState message="Belum ada metadata SEO." />
      ) : (
        <SeoTableClient initialSeo={seoMetadata} />
      )}
    </SectionShell>
  );
}
