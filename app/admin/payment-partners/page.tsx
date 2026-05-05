import { connection } from "next/server";

import { SectionShell } from "@/app/admin/_components/admin-ui";
import { getAdminPageData } from "@/lib/admin-content";
import { PaymentPartnersTableClient } from "./payment-partners-client";

export default async function PaymentPartnersPage() {
  await connection();
  const { paymentPartners } = await getAdminPageData();

  return (
    <SectionShell title="Payment Partner">
      <PaymentPartnersTableClient initialPartners={paymentPartners} />
    </SectionShell>
  );
}
