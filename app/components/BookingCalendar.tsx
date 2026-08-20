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
    const bookedSingle: Date[] = [];
    const bookedStart: Date[] = [];
    const bookedMiddle: Date[] = [];
    const bookedEnd: Date[] = [];

    for (const day of availability) {
        const [y, m, d] = day.date.split("-").map(Number);
        const date = new Date(y, m - 1, d);

        if (!day.is_occupied) {
            if (date >= today) available.push(date);
        } else if (day.is_start && day.is_end) {
            bookedSingle.push(date); // changeover: one booking ends, another starts
        } else if (day.is_start) {
            bookedStart.push(date);
        } else if (day.is_end) {
            bookedEnd.push(date);
        } else {
            bookedMiddle.push(date);
        }
    }

    const allBooked = [...bookedSingle, ...bookedStart, ...bookedMiddle, ...bookedEnd];

    return (
        <div className="relative pt-10">
            <DayPicker
                locale={de}
                numberOfMonths={3}
                defaultMonth={today}
                disabled={allBooked}
                mode="range"
                onSelect={onSelectRange}
                showOutsideDays
                modifiers={{ available, bookedSingle, bookedStart, bookedMiddle, bookedEnd }}
                modifiersClassNames={{
                    available: "rdp-available",
                    bookedSingle: "rdp-booked-single",
                    bookedStart: "rdp-booked-start",
                    bookedMiddle: "rdp-booked-middle",
                    bookedEnd: "rdp-booked-end",
                }}
                classNames={{
                    months: "grid grid-cols-1 sm:grid-cols-3 gap-6",
                }}
            />
        </div>
    );
}
