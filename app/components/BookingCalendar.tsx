"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { de } from "date-fns/locale";
import { AvailabilityDay } from "../lib/availability";

type BookingCalendarProps = {
    availability: AvailabilityDay[];
    onSelectRange?: (range: DateRange | undefined) => void;
};

function classifyRanges(dates: Date[]) {
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const single: Date[] = [], start: Date[] = [], middle: Date[] = [], end: Date[] = [];
    for (let i = 0; i < sorted.length; i++) {
        const curr = sorted[i];
        const prev = sorted[i - 1];
        const next = sorted[i + 1];
        const hasPrev = prev && curr.getTime() - prev.getTime() === 86400000;
        const hasNext = next && next.getTime() - curr.getTime() === 86400000;
        if (!hasPrev && !hasNext) single.push(curr);
        else if (!hasPrev && hasNext) start.push(curr);
        else if (hasPrev && hasNext) middle.push(curr);
        else end.push(curr);
    }
    return { single, start, middle, end };
}

export function BookingCalendar({ availability, onSelectRange }: BookingCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const availableDates: Date[] = [];
    const bookedSingle: Date[] = [];
    const bookedStart: Date[] = [];
    const bookedMiddle: Date[] = [];
    const bookedEnd: Date[] = [];

    for (const day of availability) {
        const [y, m, d] = day.date.split("-").map(Number);
        const date = new Date(y, m - 1, d);

        if (!day.is_occupied) {
            if (date >= today) availableDates.push(date);
        } else if (day.is_start && day.is_end) {
            bookedSingle.push(date);
        } else if (day.is_start) {
            bookedStart.push(date);
        } else if (day.is_end) {
            bookedEnd.push(date);
        } else {
            bookedMiddle.push(date);
        }
    }

    const avail = classifyRanges(availableDates);
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
                modifiers={{
                    availableSingle: avail.single,
                    availableStart: avail.start,
                    availableMiddle: avail.middle,
                    availableEnd: avail.end,
                    bookedSingle,
                    bookedStart,
                    bookedMiddle,
                    bookedEnd,
                }}
                modifiersClassNames={{
                    availableSingle: "rdp-available-single",
                    availableStart: "rdp-available-start",
                    availableMiddle: "rdp-available-middle",
                    availableEnd: "rdp-available-end",
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
