import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { categories, getProduct } from "@/lib/catalog";
import { ContactSection, ProductCard, SiteShell } from "../../../site-ui";

export function generateStaticParams() {
  return categories.flatMap((category) =>
    category.products.map((product) => ({
      category: category.slug,
      product: product.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { category, product } = await params;
  const result = getProduct(category, product);
  if (!result) return {};

  return {
    title: `${result.product.name} | ${result.category.name} | Novi Pak`,
    description: result.product.summary,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;
  const result = getProduct(categorySlug, productSlug);
  if (!result) notFound();

  const { category, product } = result;
  const related = category.products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <SiteShell>
      <main>
        <section className="subhero product-hero">
          <div className="shell product-hero__grid">
            <div>
              <span className="eyebrow">{category.name}</span>
              <h1 className="display">{product.name}</h1>
              <p>{product.summary}</p>
              <div className="hero__actions">
                <Link href="/#kontakt" className="btn">
                  Pošalji upit <ArrowRight aria-hidden size={18} />
                </Link>
                <Link href={`/proizvodi/${category.slug}`} className="btn btn--ghost">
                  Cela kategorija
                </Link>
              </div>
            </div>
            <div className="product-hero__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.image} alt={product.name} />
            </div>
          </div>
        </section>

        <section className="block product-detail">
          <div className="shell product-detail__grid">
            <article className="detail-panel reveal-up">
              <h2 className="display">Detalji proizvoda</h2>
              <p>
                {product.name} je deo Novi Pak asortimana u kategoriji{" "}
                {category.name.toLowerCase()}. Stranica je pripremljena da kupcu brzo
                pokaže namenu proizvoda i da vodi ka direktnom upitu.
              </p>
              <ul className="check-list">
                <li>
                  <CheckCircle2 aria-hidden size={18} />
                  Kontrolisano pakovanje i jasna deklaracija
                </li>
                <li>
                  <CheckCircle2 aria-hidden size={18} />
                  Pogodno za maloprodaju, veleprodaju i partnere
                </li>
                <li>
                  <CheckCircle2 aria-hidden size={18} />
                  Format pakovanja uskladiv sa potrebama kanala prodaje
                </li>
              </ul>
            </article>

            <aside className="spec-card reveal-up">
              <h2>Specifikacija</h2>
              <dl>
                <div>
                  <dt>Kategorija</dt>
                  <dd>{category.name}</dd>
                </div>
                <div>
                  <dt>Namena</dt>
                  <dd>{product.use}</dd>
                </div>
                <div>
                  <dt>Pakovanja</dt>
                  <dd>{product.packs.join(", ")}</dd>
                </div>
                <div>
                  <dt>Upit</dt>
                  <dd>gramaža, količina i saradnja po dogovoru</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="block">
            <div className="shell">
              <div className="section-head reveal-up">
                <span className="eyebrow">Povezano</span>
                <h2 className="display">
                  Još iz <em>{category.shortName}</em>
                </h2>
              </div>
              <div className="product-grid product-grid--compact">
                {related.map((item) => (
                  <ProductCard key={item.slug} category={category} product={item} />
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <ContactSection />
      </main>
    </SiteShell>
  );
}
