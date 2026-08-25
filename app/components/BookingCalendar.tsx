"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { de, enUS, hr, it } from "date-fns/locale";
import { AvailabilityDay } from "../lib/availability";

const DATE_FNS_LOCALES: Record<string, typeof de> = { de, en: enUS, hr, it };

type BookingCalendarProps = {
    availability: AvailabilityDay[];
    locale?: string;
    onSelectRange?: (range: DateRange | undefined) => void;
};

// Minimum px width a single month needs so days/weekday labels don't get cramped.
const MIN_MONTH_WIDTH = 220;
const MONTH_GAP = 22;

function useMonthCount(containerRef: React.RefObject<HTMLDivElement | null>) {
    const [count, setCount] = React.useState(1);

    React.useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        function computeFromWidth(width: number) {
            // Base the month count on the calendar's own container, not the viewport,
            // since the container can be much narrower than the window (e.g. inside a modal column).
            const fitting = Math.floor((width + MONTH_GAP) / (MIN_MONTH_WIDTH + MONTH_GAP));
            setCount(Math.min(3, Math.max(1, fitting)));
        }

        computeFromWidth(element.getBoundingClientRect().width);

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) computeFromWidth(entry.contentRect.width);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [containerRef]);

    return count;
}

export function BookingCalendar({ availability, locale = "de", onSelectRange }: BookingCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const monthCount = useMonthCount(containerRef);

    const available: Date[] = [];
    const booked: Date[] = [];

    for (const day of availability) {
        const [y, m, d] = day.date.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        if (day.is_occupied) {
            if (date >= today) booked.push(date);
        } else if (date >= today) {
            available.push(date);
        }
    }

    const dateFnsLocale = DATE_FNS_LOCALES[locale] ?? de;

    const monthsClassName =
        monthCount === 3
            ? "grid grid-cols-3 gap-6"
            : monthCount === 2
                ? "grid grid-cols-2 gap-6"
                : "grid grid-cols-1 gap-6";

    return (
        <div ref={containerRef} className="relative w-full overflow-x-auto pt-10">
            <DayPicker
                locale={dateFnsLocale}
                numberOfMonths={monthCount}
                defaultMonth={today}
                disabled={[{ before: today }, ...booked]}
                startMonth={today}
                mode="range"
                onSelect={onSelectRange}
                showOutsideDays
                modifiers={{ available, booked }}
                modifiersClassNames={{
                    available: "rdp-available",
                    booked: "rdp-booked",
                }}
                classNames={{
                    months: monthsClassName,
                }}
            />
        </div>
    );
}
