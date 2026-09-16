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
        const data: unknown = await res.json();
        const availability = isAvailabilityResponse(data)
            ? data.availability
            : isAvailabilityMap(data)
                ? data
                : {};

        return Object.entries(availability).map(([date, v]) => ({
            date,
            is_occupied: v.is_occupied,
            is_start: v.is_start,
            is_end: v.is_end,
        }));
    } catch {
        return [];
    }
}

type AvailabilityMap = Record<string, AvailabilityDayFlags>;

type AvailabilityDayFlags = Pick<AvailabilityDay, "is_occupied" | "is_start" | "is_end">;

type AvailabilityResponse = {
    availability: AvailabilityMap;
};

function isAvailabilityDay(value: unknown): value is AvailabilityDayFlags {
    if (!value || typeof value !== "object") return false;
    const day = value as Record<string, unknown>;
    return typeof day.is_occupied === "boolean"
        && typeof day.is_start === "boolean"
        && typeof day.is_end === "boolean";
}

function isAvailabilityMap(value: unknown): value is AvailabilityMap {
    if (!value || typeof value !== "object") return false;
    return Object.values(value).every(isAvailabilityDay);
}

function isAvailabilityResponse(value: unknown): value is AvailabilityResponse {
    if (!value || typeof value !== "object") return false;
    return "availability" in value && isAvailabilityMap(value.availability);
}
