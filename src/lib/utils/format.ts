/**
 * Formatting utilities
 */

/**
 * Format a number with locale-specific formatting
 * @param num - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  num: number,
  locale: string = 'en-US',
  options?: Intl.NumberFormatOptions
): string {
  return num.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  })
}

/**
 * Format a date to ISO string (YYYY-MM-DD)
 * @param date - Date to format (default: current date)
 * @returns Formatted date string
 */
export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a date to a readable string
 * @param date - Date or date string to format
 * @param locale - Locale string (default: 'fr-FR')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateReadable(
  date: Date | string,
  locale: string = 'fr-FR',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Format a percentage value
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @param isDecimal - Whether the value is in decimal format (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  isDecimal: boolean = false
): string {
  const percentage = isDecimal ? value * 100 : value
  return `${percentage.toFixed(decimals)}%`
}

