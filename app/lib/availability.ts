export type AvailabilityDay = {
    date: string;
    is_occupied: boolean;
    is_start: boolean;
    is_end: boolean;
};

const VILLA_IDS: Record<string, string> = {
    ivanka: "6743",
    milka: "6647",
    vesna: "6646",
};

export async function getAvailability(villaKey: string): Promise<AvailabilityDay[]> {
    const id = VILLA_IDS[villaKey];
    if (!id) return [];

    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const url = `https://calendar.hundeurlaub.de/de/api/widgets/accommodation/property/${id}/${yearMonth}/yearly-availability/`;

    try {
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data: Record<string, { is_occupied: boolean; is_start: boolean; is_end: boolean }> = await res.json();
        return Object.entries(data).map(([date, v]) => ({
            date,
            is_occupied: v.is_occupied,
            is_start: v.is_start,
            is_end: v.is_end,
        }));
    } catch {
        return [];
    }
}
