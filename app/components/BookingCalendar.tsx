"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { de } from "date-fns/locale";
import { AvailabilityDay } from "../lib/availability";

type BookingCalendarProps = {
    availability: AvailabilityDay[];
    onSelectRange?: (range: DateRange | undefined) => void;
};

export function BookingCalendar({ availability, onSelectRange }: BookingCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    return (
        <div className="relative pt-10">
            <DayPicker
                locale={de}
                numberOfMonths={3}
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
                    months: "grid grid-cols-1 sm:grid-cols-3 gap-6",
                }}
            />
        </div>
    );
}
