export type Product = {
  slug: string;
  name: string;
  summary: string;
  packs: string[];
  use: string;
};

export type Category = {
  slug: string;
  no: string;
  name: string;
  shortName: string;
  image: string;
  summary: string;
  description: string;
  products: Product[];
};

const packDefaults = ["porcijska pakovanja", "retail pakovanja", "gramaže po dogovoru"];

export const categories: Category[] = [
  {
    slug: "praskasti-proizvodi",
    no: "01",
    name: "Praškasti proizvodi",
    shortName: "Praškasti",
    image: "/assets/cat-praskasti.png",
    summary: "Šlagovi, pudinzi i praškaste mešavine za brzu i sigurnu pripremu.",
    description:
      "Linija praškastih proizvoda za poslastičarstvo, domaćinstvo i HoReCa partnere, sa jasnim deklaracijama i stabilnim pakovanjem.",
    products: [
      ["slag-krem-beli", "Šlag krem beli"],
      ["slag-krem-vanila", "Šlag krem vanila"],
      ["slag-pena", "Šlag pena"],
      ["secer-u-prahu", "Šećer u prahu"],
      ["puding-vanila", "Puding vanila"],
      ["zamena-za-mleko-u-prahu", "Zamena za mleko u prahu"],
    ].map(([slug, name]) => ({
      slug,
      name,
      summary: `${name} u urednom Novi Pak pakovanju, namenjen za svakodnevnu upotrebu i stabilan kvalitet na polici.`,
      packs: packDefaults,
      use: "poslastičarstvo, maloprodaja i kućna priprema",
    })),
  },
  {
    slug: "zrnasti-apetisani",
    no: "02",
    name: "Zrnasti apetisani",
    shortName: "Apetisani",
    image: "/assets/cat-zrnasti.png",
    summary: "Kikiriki, suncokret, semenke i hrskavi snack proizvodi.",
    description:
      "Premium snack linija sa fokusom na svežinu, hrskavost i prepoznatljivo pakovanje za police, kioske i veleprodaju.",
    products: [
      ["przeni-slani-kikiriki", "Prženi slani kikiriki"],
      ["przeni-slani-kikiriki-vakum-kesa", "Prženi slani kikiriki - vakum kesa"],
      ["peceni-slani-kikiriki", "Pečeni slani kikiriki"],
      ["peceni-slani-suncokret-u-ljusci", "Pečeni slani suncokret u ljusci"],
      ["peceni-slani-suncokret-u-ljusci-xl", "Pečeni slani suncokret u ljusci XL"],
      ["pecena-slana-bundevina-semenka", "Pečena slana bundevina semenka"],
      ["oljusteni-przeni-slani-suncokret", "Oljušteni prženi slani suncokret"],
      ["peceni-neslani-kikiriki", "Pečeni neslani kikiriki"],
      ["pikantni-kikiriki", "Pikantni kikiriki"],
      ["krcko-kukuruz-przeni-slani", "Krcko-kukuruz prženi slani"],
      ["peceni-slani-kikiriki-u-ljusci", "Pečeni slani kikiriki u ljusci"],
      ["kikiriki-u-karameli-i-susamu", "Kikiriki u karameli i susamu"],
      ["mix-4-in-1", "MIX 4 IN 1"],
      ["kukuruz-kokicar", "Kukuruz kokičar"],
    ].map(([slug, name]) => ({
      slug,
      name,
      summary: `${name} iz snack asortimana, pakovan za dobru zaštitu arome i privlačan nastup na polici.`,
      packs: ["mini pakovanja", "standardna pakovanja", "vakum ili kese po potrebi"],
      use: "snack police, veleprodaja, kiosci i marketi",
    })),
  },
  {
    slug: "sitna-pakovanja",
    no: "03",
    name: "Sitna pakovanja",
    shortName: "Sitna pakovanja",
    image: "/assets/cat-sitna.png",
    summary: "Začini i dodaci u porcijskim kesicama za brzu upotrebu.",
    description:
      "Mala, praktična pakovanja za začine, dodatke jelima i proizvode koji traže precizno doziranje i čistu prezentaciju.",
    products: [
      ["soda-bikarbona", "Soda bikarbona"],
      ["vanilin-secer", "Vanilin šećer"],
      ["limontus", "Limontus"],
      ["mleveni-crni-biber", "Mleveni crni biber"],
      ["crni-biber-u-zrnu", "Crni biber u zrnu"],
      ["origano", "Origano"],
    ].map(([slug, name]) => ({
      slug,
      name,
      summary: `${name} u praktičnoj kesici, pogodan za maloprodaju, HoReCa i svakodnevnu upotrebu.`,
      packs: ["porcijske kesice", "kutije za izlaganje", "gramaže po dogovoru"],
      use: "začini, dodaci jelima i praktična potrošnja",
    })),
  },
  {
    slug: "ostali-proizvodi",
    no: "04",
    name: "Ostali proizvodi",
    shortName: "Ostali",
    image: "/assets/cat-ostali.png",
    summary: "Sirovine i dodaci za kuhinju, poslastičarstvo i svakodnevnu pripremu.",
    description:
      "Dopunski asortiman sa proizvodima koji zaokružuju ponudu i omogućavaju fleksibilnu saradnju sa partnerima.",
    products: [
      ["suvo-grozdje", "Suvo grožđe"],
      ["kokosovo-brasno", "Kokosovo brašno"],
      ["seme-susama", "Seme susama"],
      ["kakao-u-prahu", "Kakao u prahu"],
      ["psenicni-griz", "Pšenični griz"],
      ["prezle", "Prezle"],
      ["psenica-belija", "Pšenica belija"],
      ["palenta-kukuruzna", "Palenta kukuruzna"],
      ["soda-bikarbona-ostali", "Soda bikarbona"],
    ].map(([slug, name]) => ({
      slug,
      name,
      summary: `${name} u Novi Pak asortimanu, sa jasnim deklarisanjem i pouzdanim pakovanjem.`,
      packs: packDefaults,
      use: "kuhinja, poslastičarstvo, marketi i veleprodaja",
    })),
  },
];

export const allProducts = categories.flatMap((category) =>
  category.products.map((product) => ({ ...product, category }))
);

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProduct(categorySlug: string, productSlug: string) {
  const category = getCategory(categorySlug);
  const product = category?.products.find((item) => item.slug === productSlug);
  return category && product ? { category, product } : undefined;
}
