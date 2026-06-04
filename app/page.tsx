import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { categories, allProducts } from "@/lib/catalog";
import {
  CategoryCard,
  ContactSection,
  processItems,
  qualityItems,
  SectionHead,
  SiteShell,
} from "./site-ui";
import { HeroPeanutScene } from "./HeroPeanutScene";

export default function Page() {
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <SiteShell>
      <header className="hero" id="pocetna">
        <div className="hero__sticky">
          <HeroPeanutScene />
          <div className="hero__shine" aria-hidden />
          <div className="hero__floaters" aria-hidden>
            {categories.map((category, index) => (
              <span key={category.slug} className={`floater f${index + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.image} alt="" />
              </span>
            ))}
          </div>
          <div className="hero__content">
            <h1>
              <span className="display hero__line hero__line--1">Novi</span>
              <span className="display hero__line hero__line--2">Pak</span>
            </h1>
            <p className="hero__sub">
              Premium snack proizvodi, praškaste mešavine i začini, pažljivo
              prerađeni i upakovani za police koje privlače pogled.
            </p>
            <div className="hero__actions">
              <Link href="/proizvodi" className="btn" data-magnetic>
                Pogledaj katalog <ArrowRight aria-hidden size={18} />
              </Link>
              <Link href="#kontakt" className="btn btn--ghost">
                Pošalji upit
              </Link>
            </div>
          </div>
          <div className="scroll-hint">
            <span>Skroluj</span>
            <span className="bar" />
          </div>
        </div>
      </header>

      <section className="block intro" id="onama">
        <div className="shell intro__grid">
          <div className="intro__text reveal-up">
            <span className="eyebrow">Novi Pak Premijum</span>
            <h2 className="display">Snack brend koji izgleda sveže na polici</h2>
            <p>
              Novi Pak Premijum doo iz Niša više od dve decenije prerađuje i pakuje
              snack proizvode, praškaste proizvode, začine i dodatke za domaće i
              regionalno tržište.
            </p>
            <p>
              Novi dizajn sajta postavlja proizvod u prvi plan: svetla pozadina,
              energični crveno-zlatni akcenti i katalog koji kupcu brzo pokazuje šta
              može da naruči.
            </p>
          </div>
          <div className="intro__stats reveal-up">
            <div>
              <strong className="display">20+</strong>
              <span>godina iskustva</span>
            </div>
            <div>
              <strong className="display">50+</strong>
              <span>članova tima</span>
            </div>
            <div>
              <strong className="display">4</strong>
              <span>glavne kategorije</span>
            </div>
          </div>
        </div>
      </section>

      <section className="block catalog-band" id="proizvodi">
        <div className="shell">
          <SectionHead
            label="Asortiman"
            title={
              <>
                Katalog <em>proizvoda</em>
              </>
            }
            text="Četiri kategorije, jasno razdvojene stranice i detalji za svaki proizvod, tako da sajt radi i kao prodajni katalog i kao SEO osnova."
          />
          <div className="prod__grid">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="block product-strip">
        <div className="shell">
          <SectionHead
            label="Istaknuti proizvodi"
            title={
              <>
                Brz ulaz u <em>najtraženije artikle</em>
              </>
            }
            text="Svaki proizvod ima svoju statičku SEO stranicu sa opisom, namenom, formatima pakovanja i pozivom za upit."
          />
          <div className="mini-products">
            {featuredProducts.map(({ category, ...product }) => (
              <Link
                key={`${category.slug}-${product.slug}`}
                href={`/proizvodi/${category.slug}/${product.slug}`}
                className="mini-product reveal-up"
              >
                <span>{category.shortName}</span>
                <strong>{product.name}</strong>
                <ArrowRight aria-hidden size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block process" id="proces">
        <div className="shell">
          <SectionHead
            label="Proces"
            title={
              <>
                Od sirovine do <em>premium pakovanja</em>
              </>
            }
            text="Landing sada objašnjava kako Novi Pak radi, ne samo šta prodaje. To pomaže kupcima, Google-u i AI pretrazi."
            center
          />
          <div className="process__grid">
            {processItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="process-card reveal-up">
                  <Icon aria-hidden />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="block partnership">
        <div className="shell partnership__grid">
          <div className="partnership__media reveal-up">
            {categories.slice(0, 3).map((category) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={category.slug} src={category.image} alt={category.name} />
            ))}
          </div>
          <div className="partnership__text reveal-up">
            <span className="eyebrow">Saradnja</span>
            <h2 className="display">Uslužno pakovanje i veleprodaja</h2>
            <p>
              Sajt sada jasno komunicira da Novi Pak može biti dobavljač, proizvođač
              i partner za pakovanje. To je važno za B2B upite, distributere i
              kupce koji traže pouzdanu proizvodnju.
            </p>
            <ul className="check-list">
              {[
                "Pakovanja i gramaže po dogovoru",
                "Snack, praškasti proizvodi, začini i dodaci",
                "Stabilan kvalitet za ponovljene narudžbine",
              ].map((item) => (
                <li key={item}>
                  <CheckCircle2 aria-hidden size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="#kontakt" className="btn" data-magnetic>
              Zatraži ponudu <ArrowRight aria-hidden size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="block quality" id="kvalitet">
        <div className="shell">
          <SectionHead
            label="Kvalitet"
            title={
              <>
                Standard koji se <em>vidi i oseća</em>
              </>
            }
            center
          />
          <div className="quality__grid">
            {qualityItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="quality-card reveal-up">
                  <Icon aria-hidden />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="block faq">
        <div className="shell faq__grid">
          <SectionHead
            label="FAQ"
            title={
              <>
                Pitanja koja kupci <em>najčešće postavljaju</em>
              </>
            }
            text="FAQ blokovi su korisni za posetioce, ali i za SEO i AI optimizaciju jer daju direktne odgovore."
          />
          <div className="faq__items reveal-up">
            {[
              [
                "Da li radite različite gramaže?",
                "Da. Pakovanja i gramaže se mogu uskladiti sa kategorijom, kanalom prodaje i potrebama partnera.",
              ],
              [
                "Koje kategorije proizvoda nudite?",
                "Praškaste proizvode, zrnaste apetisane, sitna pakovanja začina i dodataka, kao i dopunski asortiman.",
              ],
              [
                "Da li je sajt spreman za SEO?",
                "Da. Svaka kategorija i svaki proizvod imaju zasebnu statičku stranicu, jasne naslove, opise i interne linkove.",
              ],
            ].map(([question, answer]) => (
              <article key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </SiteShell>
  );
}
