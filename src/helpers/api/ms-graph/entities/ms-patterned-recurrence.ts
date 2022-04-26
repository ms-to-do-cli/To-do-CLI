import { WeekDay } from './week-day';
import { WeekIndex } from './week-index';

/**
 * The recurrence pattern and range. This shared object is used to define the recurrence of access reviews, calendar events, and access package assignments in Azure AD.
 *
 * @see https://docs.microsoft.com/en-us/graph/api/resources/patternedrecurrence?view=graph-rest-1.0
 */
export interface MsPatternedRecurrence {
    /**
     * Describes the frequency by which a recurring event repeats. This shared object is used to define the recurrence of access reviews, calendar events, and access package assignments in Azure AD.
     *
     * You can specify the recurrence pattern of a recurring event in one of 6 ways depending on your scenario. For each pattern type, specify the amount of time between occurrences. The actual occurrences of the recurring event always follow this pattern falling within the date range that you specify for the event. A recurring event is always defined by its recurrencePattern (how frequently the event repeats), and its recurrenceRange (over how long the event repeats).
     *
     * Use the type property to specify the different types of recurrencePattern, and the interval property to specify the time between occurrences, which can be in number of days, weeks, months, or years, depending on the type. Note which properties are required for each type, as described in the following table.
     *
     * @see https://docs.microsoft.com/en-us/graph/api/resources/recurrencepattern?view=graph-rest-1.0
     */
    'pattern': {
        /**
         * The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.
         */
        'dayOfMonth'?: number,
        /**
         * A collection of the days of the week on which the event occurs. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday.
         * If type is relativeMonthly or relativeYearly, and daysOfWeek specifies more than one day, the event falls on the first day that satisfies the pattern.
         * Required if type is weekly, relativeMonthly, or relativeYearly.
         */
        'daysOfWeek'?: Array<WeekDay>,
        /**
         * The first day of the week. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday. Default is sunday. Required if type is weekly.
         */
        'firstDayOfWeek'?: WeekDay,
        /**
         * Specifies on which instance of the allowed days specified in daysOfWeek the event occurs, counted from the first instance in the month. The possible values are: first, second, third, fourth, last. Default is first. Optional and used if type is relativeMonthly or relativeYearly.
         */
        'index'?: WeekIndex,
        /**
         * The number of units between occurrences, where units can be in days, weeks, months, or years, depending on the type. Required.
         */
        'interval': number,
        /**
         * The month in which the event occurs. This is a number from 1 to 12.
         */
        'month': number,
        /**
         * The recurrence pattern type: daily, weekly, absoluteMonthly, relativeMonthly, absoluteYearly, relativeYearly. Required. For more information, see values of type property.
         */
        'type': 'daily' | 'weekly' | 'absoluteMonthly' | 'relativeMonthly' | 'absoluteYearly' | 'relativeYearly'
    },
    /**
     * Describes a date range over which a recurring event. This shared object is used to define the recurrence of access reviews, calendar events, and access package assignments in Azure AD.
     *
     * You can specify the date range for a recurring event in one of 3 ways depending on your scenario. While you must always specify a startDate value for the date range, you can specify a recurring event that ends by a specific date, or that doesn't end, or that ends after a specific number of occurrences. Note that the actual occurrences within the date range always follow the recurrence pattern that you specify for the recurring event. A recurring event is always defined by its recurrencePattern (how frequently the event repeats), and its recurrenceRange (for how long the event repeats).
     *
     * @see https://docs.microsoft.com/en-us/graph/api/resources/recurrencerange?view=graph-rest-1.0
     */
    'range': {
        /**
         * The date to stop applying the recurrence pattern. Depending on the recurrence pattern of the event, the last occurrence of the meeting may not be this date. Required if type is endDate.
         */
        'endDate'?: Date,
        /**
         * The number of times to repeat the event. Required and must be positive if type is numbered.
         */
        'numberOfOccurrences'?: number,
        /**
         * Time zone for the startDate and endDate properties. Optional. If not specified, the time zone of the event is used.
         */
        'recurrenceTimeZone'?: string,
        /**
         * The date to start applying the recurrence pattern. The first occurrence of the meeting may be this date or later, depending on the recurrence pattern of the event. Must be the same value as the start property of the recurring event. Required.
         */
        'startDate': Date,
        /**
         * The recurrence range. The possible values are: endDate, noEnd, numbered. Required.
         */
        'type': 'endDate' | 'noEnd' | 'numbered'
    }
}
