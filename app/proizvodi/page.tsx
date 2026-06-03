import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allProducts, categories } from "@/lib/catalog";
import { CategoryCard, ContactSection, ProductCard, SectionHead, SiteShell } from "../site-ui";

export const metadata: Metadata = {
  title: "Katalog proizvoda | Novi Pak",
  description:
    "Pregled Novi Pak proizvoda: praškasti proizvodi, zrnasti apetisani, sitna pakovanja, začini i ostali proizvodi.",
};

export default function ProductsPage() {
  return (
    <SiteShell>
      <main>
        <section className="subhero">
          <div className="shell subhero__grid">
            <div>
              <span className="eyebrow">Katalog</span>
              <h1 className="display">Svi Novi Pak proizvodi</h1>
              <p>
                Statički katalog sa zasebnim stranicama za svaku kategoriju i svaki
                proizvod, spreman za Google, AI pretragu i brze B2B upite.
              </p>
            </div>
            <Link href="/#kontakt" className="btn">
              Pošalji upit <ArrowRight aria-hidden size={18} />
            </Link>
          </div>
        </section>

        <section className="block catalog-band">
          <div className="shell">
            <SectionHead
              label="Kategorije"
              title={
                <>
                  Izaberite <em>asortiman</em>
                </>
              }
            />
            <div className="prod__grid">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>

        <section className="block">
          <div className="shell">
            <SectionHead
              label="Proizvodi"
              title={
                <>
                  Pojedinačne <em>stranice proizvoda</em>
                </>
              }
              text="Svaki artikal vodi na svoju stranicu sa opisom, pakovanjima i pozivom za ponudu."
            />
            <div className="product-grid">
              {allProducts.map(({ category, ...product }) => (
                <ProductCard
                  key={`${category.slug}-${product.slug}`}
                  category={category}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
    </SiteShell>
  );
}
