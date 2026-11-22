/**
 * Utility helper functions for DukaanOS
 */

/**
 * Format a number into Indian Rupee currency format (e.g., ₹1,299)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate a clean URL-friendly slug from a store name
 * Example: "Sharma Sweets & Dry Fruits" -> "sharma-sweets-dry-fruits"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
