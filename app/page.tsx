import Script from "next/script";

/* allow CSS custom properties in inline style objects */
type CSSVarStyle = React.CSSProperties & Record<string, string | number>;

const products = [
  {
    no: "01",
    img: "/assets/cat-praskasti.png",
    alt: "Praškasti proizvodi — Šlag krem beli, Kakao u prahu",
    title: "Praškasti proizvodi",
    text: "Šlag krem, kakao u prahu i instant mešavine — precizno odmerene i higijenski upakovane.",
    delay: "0s",
  },
  {
    no: "02",
    img: "/assets/cat-zrnasti.png",
    alt: "Zrnasti apetisani — Kikiriki, Suncokret, Pikantni kikiriki",
    title: "Zrnasti apetisani",
    text: "Prženi i slani kikiriki, suncokret i pikantne grickalice — hrskave i sveže u više gramaža.",
    delay: ".1s",
  },
  {
    no: "03",
    img: "/assets/cat-sitna.png",
    alt: "Sitna pakovanja — Biber, Origano, Limontus",
    title: "Sitna pakovanja",
    text: "Začini i instant napici u porcijskim kesicama — biber, origano, limontus i još mnogo toga.",
    delay: ".2s",
  },
  {
    no: "04",
    img: "/assets/cat-ostali.png",
    alt: "Ostali proizvodi — Soda bikarbona, Instant palenta",
    title: "Ostali proizvodi",
    text: "Soda bikarbona, instant palenta i mešavine po specifikaciji klijenta — fleksibilno i pouzdano.",
    delay: ".3s",
  },
];

export default function Page() {
  return (
    <>
      {/* scroll progress */}
      <div className="scroll-progress" id="scrollProgress" />

      {/* custom cursor */}
      <div className="cursor-dot" />
      <div className="cursor-ring" />

      {/* preloader */}
      <div id="preloader">
        <div className="np-mono">
          N<span>P</span>
        </div>
        <div className="np-load">
          <div className="bar">
            <i />
          </div>
          <div className="cap">Učitavanje</div>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav" id="nav">
        <a href="#pocetna" className="nav__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/novipak-logo.png" alt="Novi Pak" />
        </a>
        <div className="nav__links">
          <a href="#pocetna">Početna</a>
          <a href="#proizvodi">Praškasti proizvodi</a>
          <a href="#proizvodi">Zrnasti apetisani</a>
          <a href="#proizvodi">Sitna pakovanja</a>
          <a href="#proizvodi">Ostali proizvodi</a>
          <a href="#onama">O nama</a>
          <a href="#kontakt">Kontakt</a>
        </div>
        <div className="lang" aria-label="Jezik">
          <button className="active">SR</button>
          <button>EN</button>
        </div>
        <button className="burger" id="burger" aria-label="Meni">
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-menu" id="mobileMenu">
        <a href="#pocetna">Početna</a>
        <a href="#proizvodi">Proizvodi</a>
        <a href="#onama">O nama</a>
        <a href="#zasto">Zašto mi</a>
        <a href="#kontakt">Kontakt</a>
      </div>

      {/* HERO : GOLDEN STORM */}
      <header className="hero" id="pocetna">
        <div className="hero__sticky">
          <canvas id="storm" />
          <div className="hero__vignette" />
          <div className="hero__floaters" aria-hidden="true">
            <span className="floater f1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/cat-praskasti.png" alt="" />
            </span>
            <span className="floater f2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/cat-zrnasti.png" alt="" />
            </span>
            <span className="floater f3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/cat-sitna.png" alt="" />
            </span>
            <span className="floater f4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/cat-ostali.png" alt="" />
            </span>
          </div>
          <div className="hero__content">
            <h1>
              <span className="display hero__line hero__line--1">Novi</span>
              <span className="display hero__line hero__line--2">Pak</span>
            </h1>
            <p className="hero__sub">
              Prerada i pakovanje snack proizvoda, praškastih proizvoda i začina.
            </p>
            <a href="#proizvodi" className="btn hero__cta" data-magnetic>
              Pogledaj Proizvode <span className="arr">→</span>
            </a>
          </div>
          <div className="scroll-hint">
            <span>Skroluj</span>
            <span className="bar" />
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="block about" id="onama">
        <div className="wipe" />
        <div className="shell about__grid">
          <div className="stats reveal-up">
            <div className="stat">
              <div className="num">
                <span className="cnt" data-count="20">
                  0
                </span>
                <span className="plus">+</span>
              </div>
              <div className="lbl">Godina na tržištu</div>
            </div>
            <div className="stat">
              <div className="num">
                <span className="cnt" data-count="50">
                  0
                </span>
                <span className="plus">+</span>
              </div>
              <div className="lbl">Zaposlenih</div>
            </div>
          </div>
          <div className="about__text reveal-up">
            <span className="eyebrow">O nama</span>
            <h3>Više od dve decenije tradicije</h3>
            <p>
              Novi Pak Premijum doo iz Niša već više od dvadeset godina prerađuje
              i pakuje snack proizvode, praškaste proizvode i začine za domaće i
              regionalno tržište.
            </p>
            <p>
              Spajamo industrijsku preciznost sa pažnjom posvećenom svakom
              pakovanju — od sirovine do police. Naš tim od preko 50 ljudi svakog
              dana garantuje doslednost, svežinu i kvalitet.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="block" id="proizvodi">
        <div className="wipe" />
        <div className="shell">
          <div className="section-head reveal-up">
            <span className="eyebrow">Asortiman</span>
            <h2 className="display">
              Naši <em>Proizvodi</em>
            </h2>
            <p className="section-lede">
              Četiri kategorije, jedan standard. Od praškastih mešavina do
              hrskavih grickalica — svaki proizvod prerađen i upakovan po istom
              pravilu kvaliteta.
            </p>
          </div>
          <div className="prod__grid">
            {products.map((p) => (
              <article
                key={p.no}
                className="pcard reveal-up"
                style={{ "--d": p.delay } as CSSVarStyle}
              >
                <span className="pcard__no">{p.no}</span>
                <div className="pcard__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.alt} loading="lazy" />
                </div>
                <div className="pcard__body">
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                  <a href="#kontakt" className="pcard__link">
                    Istraži <span className="arr">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="block why" id="zasto">
        <div className="wipe" />
        <div className="shell">
          <div className="section-head reveal-up" style={{ maxWidth: "none" }}>
            <span className="eyebrow">Zašto mi</span>
            <h2 className="display">
              Standard koji se <em>oseti</em>
            </h2>
          </div>
          <div className="why__grid">
            <div className="feat">
              <div className="feat__ic">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path d="M32 6 54 14v16c0 16-11 25-22 28C21 55 10 46 10 30V14L32 6Z" />
                  <path d="M23 31l7 7 13-14" />
                </svg>
              </div>
              <h4>HACCP Standard</h4>
              <p>Sertifikovani proizvodni procesi i puna sledljivost u svakoj fazi.</p>
            </div>
            <div className="feat">
              <div className="feat__ic">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3}>
                  <circle cx="32" cy="32" r="22" />
                  <path d="M32 18v14l10 6" />
                </svg>
              </div>
              <h4>20 Godina Iskustva</h4>
              <p>Dve decenije doslednog kvaliteta i poverenja partnera u regionu.</p>
            </div>
            <div className="feat">
              <div className="feat__ic">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3}>
                  <circle cx="32" cy="22" r="10" />
                  <path d="M14 52c2-11 9-16 18-16s16 5 18 16" />
                </svg>
              </div>
              <h4>Individualni Pristup</h4>
              <p>Pakovanje, gramaža i dizajn prilagođeni potrebama svakog klijenta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="block contact" id="kontakt">
        <div className="wipe" />
        <div className="contact__wm display">KONTAKT</div>
        <div className="shell contact__grid">
          <div className="cinfo reveal-up">
            <span className="eyebrow">Kontakt</span>
            <h3>Razgovarajmo o vašem pakovanju</h3>
            <div className="cinfo__item">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2}>
                <path
                  className="stroke"
                  d="M7 6c-2 0-3 1-3 3 0 10 9 19 19 19 2 0 3-1 3-3v-4l-6-2-2 3c-4-2-7-5-9-9l3-2-2-6H7Z"
                />
              </svg>
              <div>
                <div className="k">Telefon</div>
                <div className="v">+381 18 456 10 80</div>
              </div>
            </div>
            <div className="cinfo__item">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect className="stroke" x="4" y="7" width="24" height="18" rx="2" />
                <path className="stroke" d="M5 9l11 8 11-8" />
              </svg>
              <div>
                <div className="k">Email</div>
                <div className="v">novipak@gmail.com</div>
              </div>
            </div>
            <div className="cinfo__item">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={2}>
                <path
                  className="stroke"
                  d="M16 3c-6 0-11 4-11 11 0 8 11 18 11 18s11-10 11-18c0-7-5-11-11-11Z"
                />
                <circle cx="16" cy="14" r="4" />
              </svg>
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
                <option>Praškasti proizvodi</option>
                <option>Zrnasti apetisani</option>
                <option>Sitna pakovanja</option>
                <option>Ostali proizvodi</option>
              </select>
              <label htmlFor="vrsta">Vrsta proizvoda</label>
            </div>
            <div className="field full">
              <textarea id="poruka" rows={3} />
              <label htmlFor="poruka">Poruka</label>
            </div>
            <div className="submit">
              <button type="submit" className="btn btn--full" data-magnetic>
                Pošalji Upit <span className="arr">→</span>
              </button>
            </div>
            <div className="form__msg" role="status" />
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__top" />
        <div className="shell">
          <div className="footer__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/novipak-logo.png" alt="Novi Pak Premijum" />
          </div>
          <div className="footer__cols">
            <div className="fcol">
              <h5>Kompanija</h5>
              <p>Novi Pak Premijum doo Niš</p>
              <p>Ivana Milutinovića br. 30</p>
              <p>18000 Niš, Srbija</p>
              <p>+381 18 456 10 80</p>
            </div>
            <div className="fcol">
              <h5>Navigacija</h5>
              <a href="#pocetna">Početna</a>
              <a href="#proizvodi">Proizvodi</a>
              <a href="#onama">O nama</a>
              <a href="#zasto">Zašto mi</a>
              <a href="#kontakt">Kontakt</a>
            </div>
            <div className="fcol">
              <h5>Kontakt</h5>
              <a href="mailto:novipak@gmail.com">novipak@gmail.com</a>
              <a href="tel:+381184561080">+381 18 456 10 80</a>
              <p style={{ marginTop: "18px" }}>
                Prerada i pakovanje snack proizvoda, praškastih proizvoda i
                začina.
              </p>
            </div>
          </div>
          <div className="footer__copy">
            © 2025 Novi Pak Premijum doo. Sva prava zadržana.
          </div>
        </div>
      </footer>

      {/* bundled client runtime: peanut bake + storm canvas + interactions */}
      <Script src="/novipak.js" strategy="afterInteractive" />
    </>
  );
}
