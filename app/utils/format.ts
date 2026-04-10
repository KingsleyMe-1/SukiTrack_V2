/**
 * Formats a number as Philippine Peso currency.
 * e.g. 14280 → "₱14,280.00"
 */
export function formatPHP(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}
