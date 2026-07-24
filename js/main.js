// Eve Panzarino (jhankins)
// Assignment: Testing Your Own Codebase
// 7/24/2026




//============
// Helpers
// ============

// Turns any input into a string we can safely work with.
// null and undefined become "" rather than the words "null"/"undefined".
function toText(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

// Turns a value into a number, or returns null when it isn't really one.
// Booleans, null, "" and "abc" are all rejected so they can be skipped.
function toNumber(value) {
  if (value === null || value === '' || typeof value === 'boolean') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}






// ======================================================
// The assignment functions
// ======================================================

/**
 * Adds every number in an array.
 * Non-numeric entries are skipped rather than turning the total into NaN.
 * Returns 0 for an empty array or anything that isn't an array
 */
function sumOfArray(arr) {
  if (!Array.isArray(arr)) return 0;

  let total = 0;
  for (const item of arr) {
    const num = toNumber(item);
    if (num !== null) total += num;
  }
  return total;
}

/**
 * Reverses a string.
 * Numbers are converted first, so 123 becomes "321" and -1 becomes "1-".
 */
function reverseString(str) {
  // Spreading instead of .split('') keeps emoji and accented characters intact.
  return [...toText(str)].reverse().join('');
}

/**
 * Checks whether a string reads the same forwards and backwards.
 * Case, spaces and punctuation are ignored, so "A man, a plan, a canal: Panama"
 * counts as a palindrome.
 */
function isPalindrome(str) {
  const cleaned = toText(str)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');

  return cleaned === [...cleaned].reverse().join('');
}

/**
 * Finds the largest number in an array.
 * Non-numeric entries are skipped. Returns null when there is no number to
 * return (empty array, all junk, or not an array) so the caller can tell the
 * difference between "no answer" and a real result like 0.
 */
function findMax(arr) {
  if (!Array.isArray(arr)) return null;

  let max = null;
  for (const item of arr) {
    const num = toNumber(item);
    if (num !== null && (max === null || num > max)) {
      max = num;
    }
  }
  return max;
}

/**
 * Capitalizes the first letter of every word.
 * Only the first letter changes 
 * "hello world" becomes "Hello World".
 */
function capitalizeWords(str) {
  // Matching "start of string or whitespace, then a non-space character" instead
  // of using \b keeps "don't" from becoming "Don'T".
  return toText(str).replace(
    /(^|\s)(\S)/g,
    (match, gap, firstChar) => gap + firstChar.toUpperCase()
  );
}

/**
 * Counts the vowels in a string. Case-insensitive; "y" is not counted.
 * Returns 0 for input with no vowels, or for null/undefined.
 */
function countVowels(str) {
  const matches = toText(str).match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

/**
 * Returns a new array with duplicate values removed, keeping the first
 * occurrence of each and preserving the original order.
 * Objects and arrays are compared by reference (standard JavaScript behavior),
 * so two separate objects with identical contents both survive.
 */
function purgeDuplicates(arr) {
  if (!Array.isArray(arr)) return [];

  // Set also dedupes NaN correctly, which indexOf() cannot do.
  return [...new Set(arr)];
}

// Exported for Jest. The guard lets the same file load in the browser as a
// plain <script>, where `module` doesn't exist and the functions are global.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sumOfArray,
    reverseString,
    isPalindrome,
    findMax,
    capitalizeWords,
    countVowels,
    purgeDuplicates,
  };
}
