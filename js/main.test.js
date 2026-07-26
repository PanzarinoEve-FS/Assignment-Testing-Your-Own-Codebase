// Eve Panzarino (jhankins)
// Assignment: Testing Your Own Codebase
// 7/24/2026

// Tests for the 7 functions in main.js.
//
// The grader uses their own tests, so I'm not just checking the normal cases.
// For each function I test normal input, empty input, the wrong type completely
// (null, undefined, numbers, no argument at all), junk mixed in with good
// values, and the tricky stuff like 0 vs null and NaN.
//
// The Assignment warns that reverseString might get handed a -1, so bad input gets
// as much attention as good input.
//
//
// The two helpers in main.js are not exported, so they are not tested for directly. 
// Almost every test below still ends up running one of them, since
// toText (main.js:7-10) is why bad input comes back as "", and toNumber
// (main.js:14-18) is why sumOfArray and findMax skip booleans, NaN and Infinity.




// My biggest question is about how to know what to check for. Is there a list of things that need to be tested for.
// If the program gets complex enough testing for every possible scenerio seems impossible. 


const {
  sumOfArray,
  reverseString,
  isPalindrome,
  findMax,
  capitalizeWords,
  countVowels,
  purgeDuplicates,
} = require('./main');

// ======================================================
// sumOfArray(arr)   -   main.js:29-38
//
//   function sumOfArray(arr) {
//     if (!Array.isArray(arr)) return 0;        // line 30
//
//     let total = 0;                            // line 32
//     for (const item of arr) {
//       const num = toNumber(item);             // line 34
//       if (num !== null) total += num;         // line 35
//     }
//     return total;
//   }
//
// One bad value can turn the whole total into NaN, so most of these are about
// making sure line 35 skips it instead.
// ======================================================

describe('sumOfArray', () => {
  // The normal case, nothing for line 35 to skip.
  test('adds a normal array of numbers', () => {
    expect(sumOfArray([1, 2, 3])).toBe(6);
  });

  // Easy to only ever test this with small positive integers, so checking both signs and decimals too.
  test('handles negatives and decimals', () => {
    expect(sumOfArray([-1, -2, -3])).toBe(-6);
    expect(sumOfArray([5, -3])).toBe(2);
    expect(sumOfArray([1.5, 2.5])).toBe(4);
  });

  // 0.1 + 0.2 is 0.30000000000000004, so toBe would fail here even though the code is fine. toBeCloseTo is the matcher to use with decimals.
  // Computers store numbers in binary, so some decimal fractions can't be represented exactly.
  test('floating point math stays close enough', () => {
    expect(sumOfArray([0.1, 0.2])).toBeCloseTo(0.3);
  });

  // One trip through the loop.
  test('a single number returns that number', () => {
    expect(sumOfArray([42])).toBe(42);
  });

  // The loop never runs, so it returns the 0 from line 32.
  test('an empty array returns 0', () => {
    expect(sumOfArray([])).toBe(0);
  });

  // main.js:16 - Number("2") is 2, so it gets past the isFinite check on line 17.
  test('numeric strings are counted', () => {
    expect(sumOfArray([1, '2', 3])).toBe(6);
    expect(sumOfArray(['10', '20'])).toBe(30);
  });

  // main.js:17 - Number('abc') and Number({}) are both NaN, so toNumber gives
  // back null and line 35 skips them. Without that, every one of these would
  // make the whole total NaN.
  test('junk entries are skipped instead of producing NaN', () => {
    expect(sumOfArray([1, 'abc', 3])).toBe(4);
    expect(sumOfArray([1, null, 3])).toBe(4);
    expect(sumOfArray([1, undefined, 3])).toBe(4);
    expect(sumOfArray([1, NaN, 3])).toBe(4);
    expect(sumOfArray([1, {}, 3])).toBe(4);
  });

  // main.js:15 - the boolean check. Otherwise Number(true) is 1 and JS will
  // happily do 1 + true = 2.
  test('booleans are skipped rather than treated as 1 and 0', () => {
    expect(sumOfArray([1, true, 3])).toBe(4);
    expect(sumOfArray([true, false])).toBe(0);
  });

  // main.js:17 - isFinite, not just isNaN. Infinity is a number so isNaN would
  // let it through, and a total of Infinity is no use to anyone.
  test('Infinity is skipped so the total stays a real number', () => {
    expect(sumOfArray([1, Infinity, 3])).toBe(4);
    expect(sumOfArray([-Infinity])).toBe(0);
  });

  // Everything gets skipped, so same answer as an empty array.
  test('an array of nothing but junk returns 0', () => {
    expect(sumOfArray(['a', 'b', null])).toBe(0);
  });

  // main.js:30 - without the guard, the for...of on line 33 throws "arr is not
  // iterable". The last one passes nothing at all, so arr is undefined.
  test('non-array input returns 0', () => {
    expect(sumOfArray(null)).toBe(0);
    expect(sumOfArray(undefined)).toBe(0);
    expect(sumOfArray('123')).toBe(0);
    expect(sumOfArray(5)).toBe(0);
    expect(sumOfArray({ a: 1 })).toBe(0);
    expect(sumOfArray()).toBe(0);
  });

  // for...of only reads. This would catch me if I ever rewrote it using .sort()
  // or .splice() on the array I was given.
  test('does not mutate the array it was given', () => {
    const input = [1, 2, 3];
    sumOfArray(input);
    expect(input).toEqual([1, 2, 3]);
  });
});

// ======================================================
// reverseString(str)   -   main.js:44-47
//
//   function reverseString(str) {
//     return [...toText(str)].reverse().join('');   // line 46
//   }
//
// One line, but three things going on: toText deals with bad input, the spread
// deals with emoji, and .reverse() does the actual work. The README says this
// one might get a number, so most of these are about type conversion.
// ======================================================

describe('reverseString', () => {
  // The basic case.
  test('reverses a normal string', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  // Spaces are just characters, they move too.
  test('reverses a sentence, spaces included', () => {
    expect(reverseString('foo bar')).toBe('rab oof');
  });

  // Reversing a one item array gives back the same thing.
  test('a single character comes back unchanged', () => {
    expect(reverseString('a')).toBe('a');
  });

  // [...''] is [], and [].join('') is ''.
  test('an empty string returns an empty string', () => {
    expect(reverseString('')).toBe('');
  });

  // Weak on its own, since a broken function that just returned its input would still pass it. That's why it isn't the only test here.
  test('a palindrome reverses to itself', () => {
    expect(reverseString('racecar')).toBe('racecar');
  });

  // main.js:9 - the String(value) inside toText. [...123] throws "123 is not
  // iterable" without it, because you can't spread a number.
  test('numbers are converted before reversing', () => {
    expect(reverseString(123)).toBe('321');
    expect(reverseString(0)).toBe('0');
  });

  // Once it's the string "-1" the minus is just a character, so it ends up on
  // the wrong end. That's expected, not a bug. The JSDoc on line 42 says so too.
  test('a negative number keeps its sign at the end', () => {
    expect(reverseString(-1)).toBe('1-');
    expect(reverseString(-12)).toBe('21-');
  });

  // main.js:8 - the early return. Otherwise line 9 runs String(null) and gives
  // the word "null", which reverses to "llun". An answer, but a useless one.
  test('null and undefined become an empty string, not "null"/"undefined"', () => {
    expect(reverseString(null)).toBe('');
    expect(reverseString(undefined)).toBe('');
    expect(reverseString()).toBe('');
  });

  // main.js:9 again. String(true) is "true", which reverses normally.
  test('booleans are stringified first', () => {
    expect(reverseString(true)).toBe('eurt');
  });

  // Line 46 doesn't strip or lowercase anything, so it all comes back.
  test('punctuation and casing are preserved', () => {
    expect(reverseString('Hello, World!')).toBe('!dlroW ,olleH');
  });

  // Why line 46 spreads instead of using .split(''), like the comment on line 45
  // says. .split('') cuts by code unit, which chops an emoji in half and gives
  // back broken characters. Spreading goes by code point so they stay whole.
  test('accented characters and emoji survive intact', () => {
    expect(reverseString('héllo')).toBe('olléh');
    expect(reverseString('ab👍')).toBe('👍ba');
  });

  // Instead of writing out the expected answer, checking something that has to
  // be true for any correct version of line 46.
  test('reversing twice returns the original', () => {
    expect(reverseString(reverseString('assignment'))).toBe('assignment');
  });
});

// ======================================================
// isPalindrome(str)   -   main.js:54-60
//
//   function isPalindrome(str) {
//     const cleaned = toText(str)
//       .toLowerCase()                          // line 56
//       .replace(/[^\p{L}\p{N}]/gu, '');        // line 57
//
//     return cleaned === [...cleaned].reverse().join('');   // line 59
//   }
//
// Two things to test: the cleanup on lines 56-57, and the comparison on line 59.
// The regex means "delete anything that isn't a letter (\p{L}) or a number
// (\p{N})", and the u flag is what makes those classes work.
// ======================================================

describe('isPalindrome', () => {
  // Line 59 with nothing for lines 56-57 to clean up first.
  test('recognizes a simple palindrome', () => {
    expect(isPalindrome('racecar')).toBe(true);
  });

  // The false cases matter just as much. A function hardcoded to return true
  // would pass everything else in this group.
  test('rejects a non-palindrome', () => {
    expect(isPalindrome('hello')).toBe(false);
    expect(isPalindrome('foo bar')).toBe(false);
  });

  // main.js:56 - without .toLowerCase() this compares "RaceCar" against
  // "raCecaR" and comes back false.
  test('ignores casing', () => {
    expect(isPalindrome('RaceCar')).toBe(true);
    expect(isPalindrome('Anna')).toBe(true);
  });

  // main.js:57 - the famous ones only work because the spaces, commas, colons
  // and question marks get stripped before line 59 compares anything.
  test('ignores spaces and punctuation', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
    expect(isPalindrome('No lemon, no melon')).toBe(true);
  });

  // One character off. Catches an off-by-one that a totally different string
  // wouldn't.
  test('a near miss is still false', () => {
    expect(isPalindrome('racecars')).toBe(false);
    expect(isPalindrome('ab')).toBe(false);
  });

  // Nothing to compare it against.
  test('single characters are palindromes', () => {
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('Z')).toBe(true);
  });

  // main.js:55 - toText converts first, since a number has no .toLowerCase().
  test('numbers are handled by converting to a string first', () => {
    expect(isPalindrome(121)).toBe(true);
    expect(isPalindrome(123)).toBe(false);
    expect(isPalindrome(7)).toBe(true);
  });

  // All of these reach line 59 as "", and "" === "" is true. Writing them down
  // so the answer is on purpose instead of an accident, since the grader could
  // easily try any of them.
  test('a string with nothing to compare counts as a palindrome', () => {
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('   ')).toBe(true);
    expect(isPalindrome('!!!')).toBe(true);
    expect(isPalindrome(null)).toBe(true);
    expect(isPalindrome(undefined)).toBe(true);
  });

  // Checking the type, not the value. Something returning the string "true" or
  // a truthy number would pass a loose check but fail the grader's ===.
  test('always returns a real boolean, never a truthy value', () => {
    expect(typeof isPalindrome('racecar')).toBe('boolean');
    expect(typeof isPalindrome('hello')).toBe('boolean');
  });
});

// ======================================================
// findMax(arr)   -   main.js:68-79
//
//   function findMax(arr) {
//     if (!Array.isArray(arr)) return null;                    // line 69
//
//     let max = null;                                          // line 71
//     for (const item of arr) {
//       const num = toNumber(item);                            // line 73
//       if (num !== null && (max === null || num > max)) {      // line 74
//         max = num;
//       }
//     }
//     return max;
//   }
//
// 0 is a perfectly good maximum, so this can't use 0 or -1 to mean "didn't find
// anything". Line 71 starts at null instead, and a few tests below are about
// keeping those two apart.
// ======================================================

describe('findMax', () => {
  // Line 74 doing the normal thing.
  test('finds the largest number', () => {
    expect(findMax([1, 5, 3])).toBe(5);
    expect(findMax([10, 2, 8, 4])).toBe(10);
  });

  // A loop that starts at the wrong index can miss a max sitting at either end.
  test('works when the max is first or last', () => {
    expect(findMax([9, 1, 2])).toBe(9);
    expect(findMax([1, 2, 9])).toBe(9);
  });

  // The classic bug: writing let max = 0 on line 71 instead of null. Then
  // nothing ever beats the seed and an all-negative array wrongly returns 0.
  test('handles all-negative arrays', () => {
    expect(findMax([-1, -5, -3])).toBe(-1);
    expect(findMax([-10, -20])).toBe(-10);
  });

  // Line 73 converts first, so num > max on line 74 is a number comparison.
  test('handles decimals', () => {
    expect(findMax([1.5, 1.4999])).toBe(1.5);
  });

  // The max === null half of line 74, firing on the only item there is.
  test('a single element array returns that element', () => {
    expect(findMax([7])).toBe(7);
  });

  // The second 4 fails num > max, so it just doesn't get reassigned.
  test('duplicates of the max are fine', () => {
    expect(findMax([4, 4, 2])).toBe(4);
  });

  // The whole point of starting at null on line 71. Both 0 and null are falsy,
  // so anyone writing if (findMax(arr)) can't tell them apart, but the function
  // itself always can.
  test('zero is returned as a real answer, not confused with "no answer"', () => {
    expect(findMax([0])).toBe(0);
    expect(findMax([-5, 0, -2])).toBe(0);
  });

  // main.js:73 - as strings, "10" < "9" is true, because string comparison goes
  // character by character. Comparing the raw values would return 9 here.
  test('numeric strings are compared as numbers', () => {
    expect(findMax(['3', 1])).toBe(3);
    expect(findMax(['10', '9'])).toBe(10);
  });

  // main.js:74 - the num !== null half. NaN is the worst one, since every
  // comparison with it is false so it hides from num > max, but a version using
  // Math.max(...arr) would return NaN for the whole array.
  test('junk entries are skipped', () => {
    expect(findMax([1, 'abc', 3])).toBe(3);
    expect(findMax([1, null, 3])).toBe(3);
    expect(findMax([1, undefined])).toBe(1);
    expect(findMax([1, NaN, 3])).toBe(3);
  });

  // main.js:15 - if true came through as 1 it would beat 0.5 and win.
  test('booleans are skipped rather than counted as 1', () => {
    expect(findMax([true, 0.5])).toBe(0.5);
  });

  // main.js:17 - Infinity beats everything and tells you nothing.
  test('Infinity is skipped so a usable number comes back', () => {
    expect(findMax([1, Infinity, 3])).toBe(3);
  });

  // Three ways to end up returning the null that line 71 set: nothing in the
  // array, nothing numeric in it, nothing valid in it.
  test('returns null when there is no number to return', () => {
    expect(findMax([])).toBeNull();
    expect(findMax(['a', 'b'])).toBeNull();
    expect(findMax([null, undefined, NaN])).toBeNull();
  });

  // main.js:69 - the guard. toBeNull is stricter than checking for falsy, so it
  // would still fail if this returned undefined or 0 instead.
  test('non-array input returns null', () => {
    expect(findMax(null)).toBeNull();
    expect(findMax(undefined)).toBeNull();
    expect(findMax('123')).toBeNull();
    expect(findMax(5)).toBeNull();
    expect(findMax()).toBeNull();
  });

  // The shortcut for this function is [...arr].sort().pop(), and forgetting the
  // spread sorts the caller's array instead. The for...of on line 72 doesn't
  // touch it, and this is the test that would tell me if that ever changed.
  test('does not mutate or reorder the array it was given', () => {
    const input = [3, 1, 2];
    findMax(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

// ======================================================
// capitalizeWords(str)   -   main.js:86-93
//
//   function capitalizeWords(str) {
//     return toText(str).replace(
//       /(^|\s)(\S)/g,                                          // line 90
//       (match, gap, firstChar) => gap + firstChar.toUpperCase() // line 91
//     );
//   }
//
// The regex is: start of the string or one whitespace character (group 1, gap),
// then one non-whitespace character (group 2, firstChar). Line 91 puts the gap
// back exactly as it found it and uppercases only that one character.
//
// The trap with this one is doing too much. Everything after the first letter
// has to stay exactly as it was.
// ======================================================

describe('capitalizeWords', () => {
  // The \s half of line 90, matching the space in front of each word.
  test('capitalizes each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  // The ^ half of line 90, where gap is an empty string.
  test('a single word works', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  // "H".toUpperCase() is "H", so line 91 does nothing here.
  test('already-capitalized text is left alone', () => {
    expect(capitalizeWords('Hello World')).toBe('Hello World');
  });

  // Catches the .toLowerCase() then capitalize approach, which wrecks
  // HELLO WORLD and turns mcDonald into Mcdonald. Line 91 only ever touches
  // firstChar, which is what "only the first letter" is supposed to mean.
  test('only the first letter changes, so the rest of the word is untouched', () => {
    expect(capitalizeWords('HELLO WORLD')).toBe('HELLO WORLD');
    expect(capitalizeWords('hELLO')).toBe('HELLO');
    expect(capitalizeWords('mcDonald')).toBe('McDonald');
  });

  // Why line 90 uses \s instead of \b, like the comment on lines 87-88 says.
  // There's a word boundary either side of the apostrophe, so /\b\w/g would
  // capitalize the t and give me "Don'T".
  test('apostrophes do not create a second capital', () => {
    expect(capitalizeWords("don't stop")).toBe("Don't Stop");
    expect(capitalizeWords("it's o'clock")).toBe("It's O'clock");
  });

  // A hyphen isn't whitespace, so \s doesn't match it and "well-known" counts
  // as one word.
  test('hyphenated words are treated as one word', () => {
    expect(capitalizeWords('well-known author')).toBe('Well-known Author');
  });

  // Catches a .split(' ') / .join(' ') version, which collapses double spaces
  // and trims the ends. Line 91 rebuilds the gap it captured, so spacing stays.
  test('extra spacing is preserved exactly', () => {
    expect(capitalizeWords('hello   world')).toBe('Hello   World');
    expect(capitalizeWords('  hi  ')).toBe('  Hi  ');
  });

  // \s covers tabs and newlines too, so multi-line text works with no extra code.
  test('tabs and newlines count as word separators', () => {
    expect(capitalizeWords('foo\nbar')).toBe('Foo\nBar');
    expect(capitalizeWords('foo\tbar')).toBe('Foo\tBar');
  });

  // \S matches any non-space character, not just letters, and "1".toUpperCase()
  // is just "1". So these pass straight through instead of breaking anything.
  test('words that do not start with a letter are left as they are', () => {
    expect(capitalizeWords('123 abc')).toBe('123 Abc');
    expect(capitalizeWords('!hello world')).toBe('!hello World');
  });

  // \S never matches, so .replace() finds nothing to do.
  test('an empty or whitespace-only string comes back unchanged', () => {
    expect(capitalizeWords('')).toBe('');
    expect(capitalizeWords('   ')).toBe('   ');
  });

  // main.js:8 - .replace() doesn't exist on null.
  test('null and undefined become an empty string', () => {
    expect(capitalizeWords(null)).toBe('');
    expect(capitalizeWords(undefined)).toBe('');
    expect(capitalizeWords()).toBe('');
  });

  // main.js:9 - String(true) is "true", which then capitalizes like any other
  // word and comes out as "True".
  test('non-string input is stringified first', () => {
    expect(capitalizeWords(42)).toBe('42');
    expect(capitalizeWords(true)).toBe('True');
  });

  // Running it on its own output shouldn't change anything else. Another one
  // where I don't have to write out the expected answer by hand.
  test('running it twice changes nothing further', () => {
    const once = capitalizeWords('hello big world');
    expect(capitalizeWords(once)).toBe(once);
  });
});

// ======================================================
// countVowels(str)   -   main.js:99-102
//
//   function countVowels(str) {
//     const matches = toText(str).match(/[aeiou]/gi);   // line 100
//     return matches ? matches.length : 0;              // line 101
//   }
//
// Two things here: which characters count (the class on line 100) and what
// comes back when none of them do (line 101). The g flag collects every match
// instead of stopping at the first, and the i flag handles uppercase.
// ======================================================

describe('countVowels', () => {
  // hello has e and o. Programming has o, a, i.
  test('counts vowels in a normal word', () => {
    expect(countVowels('hello')).toBe(2);
    expect(countVowels('Programming')).toBe(3);
  });

  // Spaces aren't in the class so they're ignored and multiple words work with
  // no extra handling. e, u, i, o, o here.
  test('counts across a whole sentence', () => {
    expect(countVowels('the quick brown fox')).toBe(5);
  });

  // main.js:100 - the i flag. Without it AEIOU would come back as 0.
  test('is case-insensitive', () => {
    expect(countVowels('AEIOU')).toBe(5);
    expect(countVowels('aEiOu')).toBe(5);
    expect(countVowels('HELLO')).toBe(2);
  });

  // main.js:100 - the g flag. Every occurrence counts, not every different
  // vowel, so a version built on a Set would say 1 and 3 here.
  test('counts repeated vowels individually', () => {
    expect(countVowels('aaa')).toBe(3);
    expect(countVowels('cooeee')).toBe(5);
  });

  // "Sometimes y" is a real argument, so writing down that this one says no.
  // [aeiou] has no y in it, which makes rhythm a zero vowel word.
  test('"y" is not treated as a vowel', () => {
    expect(countVowels('rhythm')).toBe(0);
    expect(countVowels('yes')).toBe(1);
  });

  // main.js:101 - why that ternary is there. .match() returns null and not an
  // empty array when nothing matches, so matches.length on its own would throw
  // "Cannot read properties of null" on all three of these.
  test('returns 0 when there are no vowels', () => {
    expect(countVowels('xyz')).toBe(0);
    expect(countVowels('!!!')).toBe(0);
    expect(countVowels('')).toBe(0);
  });

  // The same null path, just reached through toText turning these into "" on
  // line 8 before .match() ever runs.
  test('null and undefined return 0 instead of throwing', () => {
    expect(countVowels(null)).toBe(0);
    expect(countVowels(undefined)).toBe(0);
    expect(countVowels()).toBe(0);
  });

  // main.js:9 - String(12345) has no vowels, and String(true) is "true".
  test('non-string input is stringified first', () => {
    expect(countVowels(12345)).toBe(0);
    expect(countVowels(true)).toBe(2); // "true" -> u, e
  });

  // é is its own character and isn't listed in [aeiou], so only the o counts.
  // Noting the limit of the regex rather than pretending it handles every
  // language.
  test('only unaccented English vowels are counted', () => {
    expect(countVowels('héllo')).toBe(1);
  });

  // Makes sure the null from .match() never gets out to the caller.
  test('always returns a number', () => {
    expect(typeof countVowels('hello')).toBe('number');
    expect(typeof countVowels(null)).toBe('number');
  });
});

// ======================================================
// purgeDuplicates(arr)   -   main.js:110-115
//
//   function purgeDuplicates(arr) {
//     if (!Array.isArray(arr)) return [];   // line 111
//
//     return [...new Set(arr)];             // line 114
//   }
//
// "Duplicate" needs a definition, and these tests pin down which one is in use.
// A Set compares with SameValueZero, which is === with one exception: NaN
// counts as equal to itself. That gives two behaviors an indexOf version would
// get wrong, and both are tested below.
// ======================================================

describe('purgeDuplicates', () => {
  // The Set drops the repeat, then the spread on line 114 makes it an array again.
  test('removes duplicate numbers', () => {
    expect(purgeDuplicates([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  test('removes duplicate strings', () => {
    expect(purgeDuplicates(['a', 'a', 'b'])).toEqual(['a', 'b']);
  });

  // Order is part of the deal, and a Set keeps insertion order. A version that
  // sorted first would give back [1, 2, 3] here, so this catches that shortcut.
  test('keeps the first occurrence and the original order', () => {
    expect(purgeDuplicates([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });

  // Nothing to remove, and nothing should go missing either.
  test('an array with no duplicates comes back the same', () => {
    expect(purgeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('an array of all the same value collapses to one', () => {
    expect(purgeDuplicates([7, 7, 7])).toEqual([7]);
  });

  // new Set([]) is empty, and line 114 spreads it back to [].
  test('an empty array returns an empty array', () => {
    expect(purgeDuplicates([])).toEqual([]);
  });

  // main.js:114 - Set comparison is strict, so 1 and "1" are different values
  // and both stay. A version using == would merge them, and would also collapse
  // 0, false and "" into a single entry.
  test('does not coerce types, so 1 and "1" both survive', () => {
    expect(purgeDuplicates([1, '1'])).toEqual([1, '1']);
    expect(purgeDuplicates([0, false, ''])).toEqual([0, false, '']);
  });

  // These are values, not missing entries, so they dedupe like anything else.
  test('dedupes null and undefined', () => {
    expect(purgeDuplicates([null, null, undefined, undefined])).toEqual([
      null,
      undefined,
    ]);
  });

  // Exactly what the comment on line 113 is about. NaN === NaN is false, so
  // indexOf and includes can never spot a duplicate NaN. A Set can.
  test('dedupes NaN, which indexOf() could not do', () => {
    expect(purgeDuplicates([NaN, NaN, 1])).toEqual([NaN, 1]);
  });

  // Compared by identity, not by contents. That's just how JS works and the
  // JSDoc on lines 107-108 says so, but putting it in a test so nobody expects
  // deep equality out of this.
  test('objects are compared by reference', () => {
    const obj = { a: 1 };
    // The same object twice collapses to one entry...
    expect(purgeDuplicates([obj, obj])).toEqual([obj]);
    // ...but two separate objects with identical contents both survive.
    expect(purgeDuplicates([{ a: 1 }, { a: 1 }])).toHaveLength(2);
  });

  // main.js:111 - the guard. Worth noticing that 'aab' gives back [] and not
  // ['a', 'b'], because a Set would happily take a string and dedupe the
  // characters. Line 111 is the only thing stopping that.
  test('non-array input returns an empty array', () => {
    expect(purgeDuplicates(null)).toEqual([]);
    expect(purgeDuplicates(undefined)).toEqual([]);
    expect(purgeDuplicates('aab')).toEqual([]);
    expect(purgeDuplicates(5)).toEqual([]);
    expect(purgeDuplicates()).toEqual([]);
  });

  // Two things at once. toEqual compares contents, so it shows the input wasn't
  // changed. .not.toBe compares identity, so it shows line 114 built a new array
  // instead of handing back the same one.
  test('returns a new array without mutating the original', () => {
    const input = [1, 1, 2];
    const result = purgeDuplicates(input);

    expect(input).toEqual([1, 1, 2]);
    expect(result).not.toBe(input);
  });

  // Both ways out of the function, line 114 and line 111. Returning null or
  // undefined from the guard would be an easy mistake to make.
  test('always returns an array', () => {
    expect(Array.isArray(purgeDuplicates([1, 1]))).toBe(true);
    expect(Array.isArray(purgeDuplicates(null))).toBe(true);
  });
});
