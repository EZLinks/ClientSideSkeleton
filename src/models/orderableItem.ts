/**
 * An item used in the orderable menu component
 * 
 * @class OrderableItem
 * @template T 
 */
export class OrderableItem<T> {
    /**
     * The row the item should appear on.
     * 
     * @type {number}
     */
    public rowNumber: number;

    /**
     * The column the item should appear on.
     * 
     * @type {number}
     */
    public columnNumber: number;

    /**
     * The string to display on the top of the button.
     * 
     * @type {string}
     */
    public topDisplay: string;

    /**
     * The string to display on the bottom of the button.
     * 
     * @type {string}
     */
    public bottomDisplay: string;

    /**
     * The full item
     * 
     * @type {T}
     */
    public item: T;
}