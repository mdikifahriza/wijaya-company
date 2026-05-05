import { resolveMediaUrl } from "@/lib/media-url";

type PaymentPartnerItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  linkUrl: string | null;
};

function isExternalUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

function PartnerCard({ partner }: { partner: PaymentPartnerItem }) {
  const logoUrl = resolveMediaUrl(partner.logoUrl);
  const cardInner = (
    <div className="flex h-20 w-full items-center justify-center rounded-xl bg-white/75 px-3 shadow-[0_6px_16px_rgba(63,91,63,0.08)] sm:h-24 sm:rounded-2xl sm:px-4">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={partner.name}
          className="max-h-9 w-full max-w-[140px] object-contain sm:max-h-12 sm:max-w-[170px]"
        />
      ) : (
        <span className="text-sm font-semibold text-[#3f5b3f]">{partner.name}</span>
      )}
    </div>
  );

  if (!partner.linkUrl?.trim()) {
    return cardInner;
  }

  const external = isExternalUrl(partner.linkUrl);

  return (
    <a
      href={partner.linkUrl}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="block transition-transform hover:-translate-y-0.5"
    >
      {cardInner}
    </a>
  );
}

export function PaymentPartnersSection({
  partners,
}: {
  partners: PaymentPartnerItem[];
}) {
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#c8dbbf] py-[var(--section-py)]">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-3xl font-bold text-[#3f5b3f] sm:text-4xl">
          Payment Partner
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
