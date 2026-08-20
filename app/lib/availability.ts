const VILLA_IDS: Record<string, string> = {
    ivanka: "6743",
    milka: "6647",
    vesna: "6646",
};

export async function getBookedDates(villaKey: string): Promise<string[]> {
    const id = VILLA_IDS[villaKey];
    if (!id) return [];

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const url = `https://calendar.hundeurlaub.de/de/api/widgets/accommodation/property/${id}/${yearMonth}/yearly-availability/`;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data: Record<string, { is_occupied: boolean }> = await res.json();
        return Object.entries(data)
            .filter(([, v]) => v.is_occupied)
            .map(([date]) => date);
    } catch {
        return [];
    }
}
