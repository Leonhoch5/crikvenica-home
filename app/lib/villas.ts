export const villas = [
  {
    name: "Villa Ivanka",
    descriptions: {
      en: "Private holiday home with garden and terrace, ideal for couples and small families. Quiet Mediterranean setting.",
      de: "Klimatisiertes Ferienhaus mit Terrasse und Meerblick. Ruhige Lage mit Pool und Garten.",
      hr: "Privatna kuća za odmor s terasom i vrtom u mirnom mediteranskom okruženju.",
      it: "Casa vacanze privata con terrazza e giardino, in un contesto tranquillo e mediterraneo.",
    },
    bedrooms: 1,
    bathrooms: 2,
    maxGuests: "2",
    bookingUrl:
      "https://www.booking.com/hotel/hr/holiday-home-ivanka-crikvenica.de.html",
  },
  {
    name: "Villa Milka",
    descriptions: {
      en: "Authentic stone villa surrounded by olive trees. Shared pool and peaceful rural atmosphere near the sea.",
      de: "Steinvilla mit Garten und Terrasse. Ruhige Atmosphäre nahe am Meer, mit Pool.",
      hr: "Autentična kamena vila okružena maslinama, s mirnom atmosferom i bazenom.",
      it: "Villa in pietra autentica tra gli ulivi, atmosfera tranquilla vicino al mare e piscina.",
    },
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: "4 + 2",
    bookingUrl: "https://www.booking.com/hotel/hr/villa-milka-crikvenica.de.html",
  },
  {
    name: "Villa Vesna",
    descriptions: {
      en: "Spacious stone villa with pool, terrace, and BBQ area. Perfect for families or groups.",
      de: "Große Villa mit Pool, Terrasse und Grillbereich — ideal für Familien oder Gruppen.",
      hr: "Prostrana vila s bazenom, terasom i roštiljem — savršeno za obitelji ili grupe.",
      it: "Villa spaziosa con piscina, terrazza e area barbecue — perfetta per famiglie o gruppi.",
    },
    bedrooms: 4,
    bathrooms: 2,
    maxGuests: "6 + 2",
    bookingUrl: "https://www.booking.com/hotel/hr/villa-vesna-crikvenica.de.html",
  },
] as const;

export const villaIvankaImages = [
  "/villas/ivanka/1.jpg",
  "/villas/ivanka/2.jpg",
  "/villas/ivanka/3.jpg",
] as const;

export const villaMilkaImages = [
  "/villas/milka/1.jpg",
  "/villas/milka/2.jpg",
  "/villas/milka/3.jpg",
] as const;

export const villaVesnaImages = [
  "/villas/vesna/1.jpg",
  "/villas/vesna/2.jpg",
  "/villas/vesna/3.jpg",
] as const;

export const villaImagesByName: Record<(typeof villas)[number]["name"], readonly string[]> = {
  "Villa Ivanka": villaIvankaImages,
  "Villa Milka": villaMilkaImages,
  "Villa Vesna": villaVesnaImages,
};
