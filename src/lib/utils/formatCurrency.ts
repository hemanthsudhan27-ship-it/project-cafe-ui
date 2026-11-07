/**
 * Format a price as Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}

/**
 * Format a price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

