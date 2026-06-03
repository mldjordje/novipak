import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { categories, getCategory } from "@/lib/catalog";
import { ContactSection, ProductCard, SectionHead, SiteShell } from "../../site-ui";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};

  return {
    title: `${category.name} | Novi Pak`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  return (
    <SiteShell>
      <main>
        <section className="subhero subhero--category">
          <div className="shell subhero__grid">
            <div>
              <span className="eyebrow">Kategorija {category.no}</span>
              <h1 className="display">{category.name}</h1>
              <p>{category.description}</p>
              <Link href="/proizvodi" className="text-link">
                Nazad na katalog <ArrowRight aria-hidden size={16} />
              </Link>
            </div>
            <div className="subhero__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.image} alt={category.name} />
            </div>
          </div>
        </section>

        <section className="block">
          <div className="shell">
            <SectionHead
              label="Artikli"
              title={
                <>
                  Proizvodi iz kategorije <em>{category.shortName}</em>
                </>
              }
              text="Svaki proizvod ima svoju stranicu sa opisom, formatima pakovanja i direktnim pozivom za upit."
            />
            <div className="product-grid">
              {category.products.map((product) => (
                <ProductCard key={product.slug} category={category} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="block category-note">
          <div className="shell category-note__box reveal-up">
            <h2 className="display">Pakovanja i saradnja</h2>
            <p>
              Za kategoriju {category.name.toLowerCase()} moguće je planirati
              različite gramaže, retail pakovanja, transportna pakovanja i količine
              prema potrebama partnera.
            </p>
            <Link href="/#kontakt" className="btn">
              Zatraži ponudu <ArrowRight aria-hidden size={18} />
            </Link>
          </div>
        </section>

        <ContactSection />
      </main>
    </SiteShell>
  );
}
