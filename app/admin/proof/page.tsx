import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { ProofTableClient } from "./proof-client";

export default async function SocialProofPage() {
  await connection();
  const { socialProof } = await getAdminPageData();

  return (
    <SectionShell title="Testimonial">
      <ProofTableClient initialProof={socialProof} />
    </SectionShell>
  );
}
