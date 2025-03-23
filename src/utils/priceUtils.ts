/**
 * Converts a cent amount to dollars
 * @param cents - The amount in cents (integer)
 * @returns The amount in dollars (number with 2 decimal places)
 * @example
 * centsToDollars(1299) // returns 12.99
 * centsToDollars(100) // returns 1.00
 */
export const centsToDollars = (cents: number): number => {
    // Ensure we're working with integers
    const wholeCents = Math.round(cents);
    // Convert to dollars by dividing by 100 and fixing to 2 decimal places
    return Number((wholeCents / 100).toFixed(2));
};