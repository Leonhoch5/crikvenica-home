"use client";

import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
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
        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background p-4">
            <DayPicker
                locale={de}
                numberOfMonths={3}
                month={firstMonth}
                disabled={bookedDates}
                mode="range"
                onSelect={onSelectRange}
                classNames={{
                    day: "h-10 w-10 rounded-full hover:bg-foreground/10 transition-colors",
                    selected: "bg-foreground text-background hover:bg-foreground/90",
                    disabled: "text-foreground/30 line-through",
                    nav: "flex items-center gap-2",
                    month: "w-full",
                    weekday: "w-10 h-10 text-xs text-foreground/60 font-normal flex items-center justify-center",
                    weekdays: "flex justify-between w-full",
                }}
            />
        </div>
    );
}