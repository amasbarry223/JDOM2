/**
 * ID generation utilities
 */

import { nanoid } from 'nanoid'

/**
 * Generate a unique ID using nanoid
 * @param size - Size of the ID (default: 12)
 * @returns Unique ID string
 */
export function generateId(size: number = 12): string {
  return nanoid(size)
}

/**
 * Generate a prefixed ID
 * @param prefix - Prefix for the ID
 * @param size - Size of the ID suffix (default: 12)
 * @returns Prefixed unique ID string
 */
export function generatePrefixedId(prefix: string, size: number = 12): string {
  return `${prefix}_${nanoid(size)}`
}

