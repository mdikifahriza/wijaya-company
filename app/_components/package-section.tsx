function isExternalUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  );
}

type PackageFeature = {
  id: string;
  featureText: string;
  sortOrder: number;
};

type PackagePlan = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  priceLabel: string;
  priceAmount: number;
  renewalLabel: string | null;
  ctaLabel: string;
  ctaUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  packageFeatures: PackageFeature[];
};

export function PackageSection({
  packagePlans,
  defaultCtaHref,
}: {
  packagePlans: PackagePlan[];
  defaultCtaHref: string;
}) {
  return (
    <section id="packages" className="bg-white py-[var(--section-py)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Packages
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-ink sm:text-5xl">
            Paket Website
          </h2>
          <p className="mt-4 text-base leading-8 text-ink-muted sm:text-lg">
            Pilih paket yang paling pas untuk kebutuhan bisnis, lalu sesuaikan
            detailnya bersama tim kami.
          </p>
        </div>

        <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,320px))]">
          {packagePlans.map((plan) => {
            const href = plan.ctaUrl || defaultCtaHref;
            const isExternal = isExternalUrl(href);

            return (
              <article
                key={plan.id}
                className={`relative flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-[var(--radius-md)] border p-7 shadow-[0_14px_36px_rgba(45,51,25,0.08)] transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${
                  plan.isFeatured
                    ? "border-accent bg-ink text-white xl:-translate-y-2"
                    : "border-border bg-surface text-ink"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                      plan.isFeatured
                        ? "border-white/15 bg-white/8 text-white"
                        : "border-border bg-white text-accent"
                    }`}
                  >
                    <i className="bi bi-patch-check-fill text-xl"></i>
                  </div>

                  {plan.isFeatured ? (
                    <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                      Favorit
                    </span>
                  ) : null}
                </div>

                <div className="mt-8">
                  <h3 className="font-display text-[2rem] font-bold leading-none">
                    {plan.name}
                  </h3>
                </div>

                <div className="mt-7">
                  <div
                    className={`inline-flex rounded-full border px-5 py-2.5 text-lg font-semibold ${
                      plan.isFeatured
                        ? "border-white/15 bg-white/8 text-white"
                        : "border-border bg-white text-accent"
                    }`}
                  >
                    {plan.priceLabel}
                  </div>
                </div>

                <details
                  className={`group mt-8 overflow-hidden rounded-[1.5rem] border transition-colors ${
                    plan.isFeatured
                      ? "border-white/12 bg-white/6"
                      : "border-border bg-white"
                  }`}
                >
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] [&::-webkit-details-marker]:hidden ${
                      plan.isFeatured ? "text-white" : "text-ink"
                    }`}
                  >
                    <span>Detail</span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-open:rotate-180 ${
                        plan.isFeatured ? "bg-white/10" : "bg-accent/8"
                      }`}
                    >
                      <i className="bi bi-chevron-down text-base"></i>
                    </span>
                  </summary>

                  <div
                    className={`border-t px-5 pb-5 pt-4 ${
                      plan.isFeatured ? "border-white/10" : "border-border"
                    }`}
                  >
                    <ul className="space-y-3">
                      {plan.packageFeatures
                        .slice()
                        .sort((left, right) => left.sortOrder - right.sortOrder)
                        .map((feature) => (
                          <li
                            key={feature.id}
                            className="flex items-start gap-3 text-sm leading-6"
                          >
                            <i
                              className={`bi bi-dot text-2xl leading-none ${
                                plan.isFeatured
                                  ? "text-white/70"
                                  : "text-accent"
                              }`}
                            ></i>
                            <span
                              className={
                                plan.isFeatured
                                  ? "text-white/88"
                                  : "text-ink-muted"
                              }
                            >
                              {feature.featureText}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </details>

                <div className="mt-6">
                  <p
                    className={`text-sm ${
                      plan.isFeatured ? "text-white/72" : "text-ink-muted"
                    }`}
                  >
                    {plan.renewalLabel ??
                      "Konsultasikan kebutuhan perpanjangan sesuai paket."}
                  </p>
                </div>

                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer noopener" : undefined}
                  className={`mt-8 inline-flex items-center justify-center gap-3 rounded-full px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] transition-transform hover:-translate-y-1 ${
                    plan.isFeatured
                      ? "bg-white text-ink"
                      : "bg-accent text-white"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <i className="bi bi-whatsapp text-base"></i>
                  </span>
                  {plan.ctaLabel}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
