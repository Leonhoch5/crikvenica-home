"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { de } from "date-fns/locale";

type BookingCalendarProps = {
    bookedDates: Date[];
    onSelectRange?: (range: DateRange | undefined) => void;
};

export function BookingCalendar({ bookedDates, onSelectRange }: BookingCalendarProps) {
    const today = new Date();

    const sorted = [...bookedDates].sort((a, b) => a.getTime() - b.getTime());

    const bookedSingle: Date[] = [];
    const bookedStart: Date[] = [];
    const bookedMiddle: Date[] = [];
    const bookedEnd: Date[] = [];

    for (let i = 0; i < sorted.length; i++) {
        const curr = sorted[i];
        const prev = sorted[i - 1];
        const next = sorted[i + 1];
        const hasPrev = prev && curr.getTime() - prev.getTime() === 86400000;
        const hasNext = next && next.getTime() - curr.getTime() === 86400000;

        if (!hasPrev && !hasNext) bookedSingle.push(curr);
        else if (!hasPrev && hasNext) bookedStart.push(curr);
        else if (hasPrev && hasNext) bookedMiddle.push(curr);
        else bookedEnd.push(curr);
    }

    return (
        <div className="relative pt-10">
        <DayPicker
            locale={de}
            numberOfMonths={3}
            defaultMonth={today}
            disabled={bookedDates}
            mode="range"
            onSelect={onSelectRange}
            showOutsideDays
            modifiers={{ bookedSingle, bookedStart, bookedMiddle, bookedEnd }}
            modifiersClassNames={{
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
