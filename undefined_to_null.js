function undefinedToNull(obj) {
  if (typeof obj !== 'object' || obj === null) {
    // If the input is not an object or is null, return it as is
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => undefinedToNull(item));
  }

  // Handle objects
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = undefinedToNull(obj[key]);
    }
  }

  return result;
}

// Test cases
console.log(undefinedToNull({ a: undefined, b: 'BFE.dev' }));
// Output: { a: null, b: 'BFE.dev' }

console.log(undefinedToNull({ a: ['BFE.dev', undefined, 'bigfrontend.dev'] }));
// Output: { a: ['BFE.dev', null, 'bigfrontend.dev'] }