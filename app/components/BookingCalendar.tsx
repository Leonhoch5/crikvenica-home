"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { subMonths } from "date-fns";
import { de } from "date-fns/locale";

type BookingCalendarProps = {
    bookedDates: Date[];
    onSelectRange?: (range: DateRange | undefined) => void;
};

export function BookingCalendar({ bookedDates, onSelectRange }: BookingCalendarProps) {
    const today = new Date();
    const firstMonth = subMonths(today, 1);

    return (
        <DayPicker
            locale={de}
            numberOfMonths={3}
            defaultMonth={firstMonth}
            disabled={bookedDates}
            mode="range"
            onSelect={onSelectRange}
            showOutsideDays
            classNames={{
                months: "grid grid-cols-1 sm:grid-cols-3 gap-6",
            }}
        />
    );
}
