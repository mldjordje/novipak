import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  BadgeCheck,
  Factory,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { categories, type Category, type Product } from "@/lib/catalog";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="scroll-progress" id="scrollProgress" />
      <div className="cursor-dot" />
      <div className="cursor-ring" />

      <nav className="nav" id="nav">
        <Link href="/#pocetna" className="nav__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/novipak-logo.png" alt="Novi Pak" />
        </Link>
        <div className="nav__links">
          <Link href="/#pocetna">Početna</Link>
          <Link href="/proizvodi">Proizvodi</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/proizvodi/${category.slug}`}>
              {category.shortName}
            </Link>
          ))}
          <Link href="/#kontakt">Kontakt</Link>
        </div>
        <Link href="/#kontakt" className="nav__cta">
          Upit
        </Link>
        <button className="burger" id="burger" aria-label="Meni">
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className="mobile-menu" id="mobileMenu">
        <Link href="/#pocetna">Početna</Link>
        <Link href="/proizvodi">Proizvodi</Link>
        <Link href="/#proces">Proces</Link>
        <Link href="/#kvalitet">Kvalitet</Link>
        <Link href="/#kontakt">Kontakt</Link>
      </div>

      {children}
      <Footer />
      <Script src="/novipak.js" strategy="afterInteractive" />
    </>
  );
}

export function SectionHead({
  label,
  title,
  text,
  center = false,
}: {
  label: string;
  title: React.ReactNode;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={`section-head reveal-up ${center ? "section-head--center" : ""}`}>
      <span className="eyebrow">{label}</span>
      <h2 className="display">{title}</h2>
      {text ? <p className="section-lede">{text}</p> : null}
    </div>
  );
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="pcard reveal-up">
      <span className="pcard__no">{category.no}</span>
      <Link href={`/proizvodi/${category.slug}`} className="pcard__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image} alt={category.name} loading="lazy" />
      </Link>
      <div className="pcard__body">
        <h3>{category.name}</h3>
        <p>{category.summary}</p>
        <Link href={`/proizvodi/${category.slug}`} className="pcard__link">
          Pogledaj kategoriju <ArrowRight aria-hidden size={16} />
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({
  category,
  product,
}: {
  category: Category;
  product: Product;
}) {
  return (
    <article className="product-card reveal-up">
      <Link href={`/proizvodi/${category.slug}/${product.slug}`} className="product-card__image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={category.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card__body">
        <span>{category.name}</span>
        <h3>{product.name}</h3>
        <p>{product.summary}</p>
        <Link href={`/proizvodi/${category.slug}/${product.slug}`} className="text-link">
          Detalji proizvoda <ArrowRight aria-hidden size={16} />
        </Link>
      </div>
    </article>
  );
}

export const processItems = [
  {
    icon: BadgeCheck,
    title: "Selekcija sirovina",
    text: "Pažljivo biramo sirovine za snack, praškaste proizvode, začine i dodatke.",
  },
  {
    icon: Factory,
    title: "Prerada i kontrola",
    text: "Proces je organizovan tako da svaka serija ima isti ukus, svežinu i izgled.",
  },
  {
    icon: PackageCheck,
    title: "Pakovanje",
    text: "Kesice, vakum pakovanja i retail formati pripremljeni za policu i transport.",
  },
  {
    icon: Truck,
    title: "Distribucija",
    text: "Stabilna isporuka partnerima, veleprodaji, marketima i HoReCa kupcima.",
  },
];

export const qualityItems = [
  {
    icon: ShieldCheck,
    title: "HACCP standard",
    text: "Sledljivost, higijena i kontrola procesa kroz sve faze proizvodnje.",
  },
  {
    icon: Sparkles,
    title: "Premium snack utisak",
    text: "Ambalaža, fotografija proizvoda i detalji dizajnirani da izgledaju sveže i privlačno.",
  },
  {
    icon: PackageCheck,
    title: "Fleksibilna pakovanja",
    text: "Podrška za različite gramaže, kategorije i potrebe partnera.",
  },
];

export function ContactSection() {
  return (
    <section className="block contact" id="kontakt">
      <div className="shell contact__grid">
        <div className="cinfo reveal-up">
          <span className="eyebrow">Kontakt</span>
          <h2 className="display">Razgovarajmo o vašem pakovanju</h2>
          <p>
            Pošaljite upit za proizvode, uslužno pakovanje, veleprodaju ili saradnju.
            Tim Novi Pak Premijum doo Niš će vam se javiti sa sledećim koracima.
          </p>
          <div className="cinfo__item">
            <Phone aria-hidden />
            <div>
              <div className="k">Telefon</div>
              <div className="v">+381 18 456 10 80</div>
            </div>
          </div>
          <div className="cinfo__item">
            <Mail aria-hidden />
            <div>
              <div className="k">Email</div>
              <div className="v">novipak@gmail.com</div>
            </div>
          </div>
          <div className="cinfo__item">
            <MapPin aria-hidden />
            <div>
              <div className="k">Adresa</div>
              <div className="v">Ivana Milutinovića br. 30, 18000 Niš</div>
            </div>
          </div>
        </div>

        <form className="form reveal-up" id="inquiry" noValidate>
          <div className="field">
            <input type="text" id="ime" required />
            <label htmlFor="ime">Ime i prezime</label>
          </div>
          <div className="field">
            <input type="email" id="email" required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="field">
            <input type="tel" id="tel" />
            <label htmlFor="tel">Telefon</label>
          </div>
          <div className="field">
            <select id="vrsta" required defaultValue="">
              <option value="" disabled hidden></option>
              {categories.map((category) => (
                <option key={category.slug}>{category.name}</option>
              ))}
            </select>
            <label htmlFor="vrsta">Vrsta proizvoda</label>
          </div>
          <div className="field full">
            <textarea id="poruka" rows={4} />
            <label htmlFor="poruka">Poruka</label>
          </div>
          <button type="submit" className="btn btn--full" data-magnetic>
            Pošalji upit <ArrowRight aria-hidden size={18} />
          </button>
          <div className="form__msg" role="status" />
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/novipak-logo.png" alt="Novi Pak Premijum" />
          <p>Premium snack proizvodi, praškasti proizvodi i začini iz Niša.</p>
        </div>
        <div className="footer__cols">
          <div className="fcol">
            <h5>Katalog</h5>
            {categories.map((category) => (
              <Link key={category.slug} href={`/proizvodi/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
          <div className="fcol">
            <h5>Kompanija</h5>
            <Link href="/#onama">O nama</Link>
            <Link href="/#proces">Proces</Link>
            <Link href="/#kvalitet">Kvalitet</Link>
            <Link href="/#kontakt">Kontakt</Link>
          </div>
          <div className="fcol">
            <h5>Kontakt</h5>
            <a href="mailto:novipak@gmail.com">novipak@gmail.com</a>
            <a href="tel:+381184561080">+381 18 456 10 80</a>
            <p>Ivana Milutinovića br. 30, 18000 Niš</p>
          </div>
        </div>
      </div>
      <div className="footer__copy">© 2026 Novi Pak Premijum doo. Sva prava zadržana.</div>
    </footer>
  );
}
