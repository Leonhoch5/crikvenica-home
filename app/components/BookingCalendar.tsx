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

function useMonthCount() {
    const [count, setCount] = React.useState(1);
    React.useEffect(() => {
        function update() {
            setCount(window.innerWidth >= 640 ? 2 : 1);
        }
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return count;
}

export function BookingCalendar({ availability, locale = "de", onSelectRange }: BookingCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthCount = useMonthCount();

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

    return (
        <div className="relative pt-10">
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
                    months: monthCount === 2 ? "grid grid-cols-2 gap-6" : "grid grid-cols-1 gap-6",
                }}
            />
        </div>
    );
}
