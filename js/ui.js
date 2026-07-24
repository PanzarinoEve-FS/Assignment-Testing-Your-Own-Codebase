// Wires the forms in index.html up to the functions in main.js.
// main.js loads first, so its functions are available as globals here.

const FUNCTIONS = {
  sumOfArray,
  reverseString,
  isPalindrome,
  findMax,
  capitalizeWords,
  countVowels,
  purgeDuplicates,
};

// ============
// Reading values out of the form
// ============

// Splits "1, "a,b", 3" on commas without breaking apart quoted text.
function splitTokens(text) {
  const tokens = [];
  let current = '';
  let quote = null;

  for (const char of text) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ',') {
      tokens.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  tokens.push(current);
  return tokens;
}

// Turns one piece of text into the JavaScript value it looks like, so the
// forms can send numbers, booleans and null through to the functions.
function parseToken(raw) {
  const token = raw.trim();

  // Quoted text is always a string, which is how you send "1" instead of 1.
  const isQuoted =
    token.length >= 2 &&
    ((token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")));
  if (isQuoted) return token.slice(1, -1);

  switch (token) {
    case 'true':
      return true;
    case 'false':
      return false;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'NaN':
      return NaN;
    case 'Infinity':
      return Infinity;
    case '-Infinity':
      return -Infinity;
  }

  if (token !== '' && Number.isFinite(Number(token))) return Number(token);

  // Anything left over is treated as plain text.
  return token;
}

function parseArray(text) {
  // Square brackets are optional, so both "1, 2" and "[1, 2]" work.
  const inner = text.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (inner === '') return [];

  return splitTokens(inner).map(parseToken);
}

// For the single-value forms, the dropdown decides what type gets sent.
function parseValue(text, type) {
  const trimmed = text.trim();

  switch (type) {
    case 'number':
      return trimmed === '' ? NaN : Number(trimmed);
    case 'boolean':
      return trimmed !== '' && trimmed !== '0' && trimmed.toLowerCase() !== 'false';
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    default:
      // Sent exactly as typed, spaces and all.
      return text;
  }
}

// ============
// Showing the result
// ============

// Renders a value the way it would be written in code, so an empty string
// shows as "" rather than as nothing at all.
function formatValue(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (Object.is(value, -0)) return '-0';
    return String(value);
  }

  if (Array.isArray(value)) {
    return '[' + value.map(formatValue).join(', ') + ']';
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }

  return String(value);
}

function describeType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  return typeof value;
}

// The result lives in a <pre>, so the line break survives without any CSS.
function render(output, name, argument, result, error) {
  const call = `${name}(${formatValue(argument)})`;

  output.textContent = error
    ? `${call}\nthrew ${error.name}: ${error.message}`
    : `${call}\n→ ${formatValue(result)}   (${describeType(result)})`;
}

// ============
// Hooking up the forms
// ============

function runForm(form) {
  const name = form.dataset.fn;
  const output = form.parentElement.querySelector('.result');
  const text = form.elements.value.value;

  const argument =
    form.dataset.input === 'array'
      ? parseArray(text)
      : parseValue(text, form.elements.type.value);

  try {
    render(output, name, argument, FUNCTIONS[name](argument), null);
  } catch (error) {
    render(output, name, argument, null, error);
  }
}

document.querySelectorAll('form[data-fn]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    runForm(form);
  });

  // Run once on load so every card starts with a worked example.
  runForm(form);
});
