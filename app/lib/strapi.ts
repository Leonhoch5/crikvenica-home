import { villas as localVillas, villaImagesByKey } from "./villas";

type StrapiMedia = {
    url?: string;
    attributes?: {
        url?: string;
    };
};

type StrapiVillaEntry = {
    key?: string;
    name?: string;
    bedrooms?: number | string;
    bathrooms?: number | string;
    maxGuests?: number | string | null;
    shortDescription?: string | null;
    longDescription?: string | null;
    images?: {
        data?: StrapiMedia[];
    } | StrapiMedia[];
    attributes?: StrapiVillaEntry;
};

export type VillaContent = {
    key: string;
    name: string;
    bedrooms: number | string;
    bathrooms: number | string;
    maxGuests: number | string | null;
    shortDescription: string | null;
    longDescription: string | null;
    images: readonly string[];
};

function normalizeEntry(entry: StrapiVillaEntry): StrapiVillaEntry {
    return entry.attributes ?? entry;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function getStrapiBaseUrl() {
    const configuredUrl = process.env.STRAPI_URL;
    if (!isNonEmptyString(configuredUrl)) {
        return null;
    }

    try {
        return new URL(configuredUrl);
    } catch {
        return null;
    }
}

function getMediaUrl(media: StrapiMedia, baseUrl: URL) {
    const url = media.url ?? media.attributes?.url;
    if (!isNonEmptyString(url)) {
        return null;
    }

    try {
        return new URL(url, baseUrl).toString();
    } catch {
        return null;
    }
}

function extractMediaUrls(images: StrapiVillaEntry["images"], baseUrl: URL) {
    const mediaItems = Array.isArray(images)
        ? images
        : Array.isArray(images?.data)
            ? images.data
            : [];

    return mediaItems
        .map((media) => getMediaUrl(media, baseUrl))
        .filter((url): url is string => Boolean(url));
}

async function fetchStrapiVillas(locale: string): Promise<VillaContent[]> {
    const baseUrl = getStrapiBaseUrl();
    if (!baseUrl) {
        return [];
    }

    const endpoint = new URL("/api/villas", baseUrl);
    endpoint.searchParams.set("populate", "images");
    endpoint.searchParams.set("sort", "sortOrder:asc");
    endpoint.searchParams.set("publicationState", "live");
    if (isNonEmptyString(locale)) {
        endpoint.searchParams.set("locale", locale);
    }

    const headers: HeadersInit = {};
    const apiToken = process.env.STRAPI_API_TOKEN;
    if (isNonEmptyString(apiToken)) {
        headers.Authorization = `Bearer ${apiToken}`;
    }

    const response = await fetch(endpoint.toString(), {
        headers,
        next: { revalidate: 300 },
    });

    if (!response.ok) {
        throw new Error(`Strapi request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { data?: StrapiVillaEntry[] };
    const items = Array.isArray(payload.data) ? payload.data : [];

    return items
        .map((item) => normalizeEntry(item))
        .filter((item): item is StrapiVillaEntry => Boolean(item && item.key))
        .map((item) => {
            const fallback = localVillas.find((villa) => villa.key === item.key);
            const images = baseUrl ? extractMediaUrls(item.images, baseUrl) : [];

            return {
                key: item.key ?? fallback?.key ?? "",
                name: item.name ?? fallback?.name ?? "",
                bedrooms: item.bedrooms ?? fallback?.bedrooms ?? 0,
                bathrooms: item.bathrooms ?? fallback?.bathrooms ?? 0,
                maxGuests: item.maxGuests ?? fallback?.maxGuests ?? null,
                shortDescription: item.shortDescription ?? null,
                longDescription: item.longDescription ?? null,
                images,
            } satisfies VillaContent;
        })
        .filter((item) => isNonEmptyString(item.key) && isNonEmptyString(item.name));
}

export type PageContent = {
    heroHeadline: string | null;
    heroSubheadline: string | null;
    heroCta: string | null;
    heroNote: string | null;
    storyP1: string | null;
    storyP2: string | null;
    storyP3: string | null;
    storyP4: string | null;
    storyP5: string | null;
    storyP6: string | null;
    villasTitle: string | null;
    villasSubtitle: string | null;
    contactKicker: string | null;
    contactTitle: string | null;
    contactText: string | null;
};

async function fetchStrapiPageContent(locale: string): Promise<PageContent | null> {
    const baseUrl = getStrapiBaseUrl();
    if (!baseUrl) return null;

    const endpoint = new URL("/api/page-content", baseUrl);
    if (isNonEmptyString(locale)) endpoint.searchParams.set("locale", locale);

    const headers: HeadersInit = {};
    const apiToken = process.env.STRAPI_API_TOKEN;
    if (isNonEmptyString(apiToken)) headers.Authorization = `Bearer ${apiToken}`;

    const response = await fetch(endpoint.toString(), {
        headers,
        next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as { data?: Record<string, unknown> };
    const data = payload.data;
    if (!data) return null;

    return {
        heroHeadline:    (data.heroHeadline as string) ?? null,
        heroSubheadline: (data.heroSubheadline as string) ?? null,
        heroCta:         (data.heroCta as string) ?? null,
        heroNote:        (data.heroNote as string) ?? null,
        storyP1:         (data.storyP1 as string) ?? null,
        storyP2:         (data.storyP2 as string) ?? null,
        storyP3:         (data.storyP3 as string) ?? null,
        storyP4:         (data.storyP4 as string) ?? null,
        storyP5:         (data.storyP5 as string) ?? null,
        storyP6:         (data.storyP6 as string) ?? null,
        villasTitle:     (data.villasTitle as string) ?? null,
        villasSubtitle:  (data.villasSubtitle as string) ?? null,
        contactKicker:   (data.contactKicker as string) ?? null,
        contactTitle:    (data.contactTitle as string) ?? null,
        contactText:     (data.contactText as string) ?? null,
    };
}

export async function getPageContent(locale: string): Promise<PageContent | null> {
    return fetchStrapiPageContent(locale).catch(() => null);
}

export async function getVillaContent(locale: string): Promise<VillaContent[]> {
    const strapiVillas = await fetchStrapiVillas(locale).catch(() => [] as VillaContent[]);
    const strapiByKey = new Map(strapiVillas.map((villa) => [villa.key, villa]));

    return localVillas.map((villa) => {
        const cmsVilla = strapiByKey.get(villa.key);

        return {
            key: villa.key,
            name: cmsVilla?.name ?? villa.name,
            bedrooms: cmsVilla?.bedrooms ?? villa.bedrooms,
            bathrooms: cmsVilla?.bathrooms ?? villa.bathrooms,
            maxGuests: cmsVilla?.maxGuests ?? villa.maxGuests,
            shortDescription: cmsVilla?.shortDescription ?? null,
            longDescription: cmsVilla?.longDescription ?? null,
            images: cmsVilla?.images?.length ? cmsVilla.images : villaImagesByKey[villa.key],
        };
    });
}