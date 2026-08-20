export type SeasonPrice = {
    season: string;
    dateRange: string;
    perNight: string;
    perWeek: string;
    maxPersons: string;
};

const VILLA_IDS: Record<string, string> = {
    ivanka: "6743",
    milka: "6647",
    vesna: "6646",
};

export async function getVillaPrices(villaKey: string): Promise<SeasonPrice[]> {
    const id = VILLA_IDS[villaKey];
    if (!id) return [];

    try {
        const res = await fetch(`https://www.hundeurlaub.de/objekt/${id}`, {
            next: { revalidate: 86400 },
            headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!res.ok) return [];
        const html = await res.text();

        const start = html.indexOf('id="prices"');
        if (start === -1) return [];
        const end = html.indexOf("</section>", start);
        const section = html
            .substring(start, end)
            .replace(/<[^>]+>/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&euro;/g, "€")
            .replace(/\s+/g, " ");

        const blocks = [...section.matchAll(/Saison \w+/g)].map((m, i, arr) => {
            const from = m.index!;
            const to = arr[i + 1]?.index ?? section.length;
            return section.slice(from, to);
        });

        return blocks.map((block) => {
            const season = block.match(/Saison \w+/)?.[0] ?? "";
            const dateRange = block.match(/\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}/)?.[0] ?? "";
            const maxPersons = block.match(/bis \d+ Personen/)?.[0] ?? "";
            const allPrices = [...block.matchAll(/[\d.]+,\d{2} €/g)].map((m) => m[0]);
            const perNight = allPrices[0] ?? "";
            // Weekly price follows "Preis p. Woche" — take price after that marker
            const weekIdx = block.indexOf("Preis p. Woche");
            const afterWeek = weekIdx !== -1 ? block.slice(weekIdx) : "";
            const perWeek = afterWeek.match(/[\d.]+,\d{2} €/)?.[0] ?? allPrices[1] ?? "";

            return { season, dateRange, perNight, perWeek, maxPersons };
        }).filter((p) => p.season && p.dateRange);
    } catch {
        return [];
    }
}
