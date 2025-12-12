---
date: 2025-03-21T07:33:05+05:30
description: Converts nested objects into single-level structure with delimited keys. Useful for form serialization, API payloads, and configuration management.
---
# 📦 Flatten Object Implementation

Flattening an object converts a nested object structure into a single-level object where nested keys are joined with a delimiter (like underscore). This is commonly used for form data serialization, API payloads, and configuration management.

---

## ✅ Implementation

```js
function flattenObject(obj, keyName = '', result = {}) {
  // Loop through all keys in the object
  Object.keys(obj).forEach(key => {
    // Construct new key path, joining with underscore if prefix exists
    const newKey = keyName ? `${keyName}_${key}` : key;

    const value = obj[key];

    // Debug: Log current key and value
    console.log(`🟡 Processing key: "${newKey}"`, value);

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // 🟠 Recurse into nested object
      console.log(`🔁 Recursing into nested object at key: "${newKey}"`);
      flattenObject(value, newKey, result);
    } else {
      // ✅ Base case: assign value directly
      console.log(`✅ Setting result["${newKey}"] =`, value);
      result[newKey] = value;
    }
  });

  // Debug: Show intermediate result at current level
  console.log('📦 Current flattened result:', result);

  return result;
}
```

---

## 🧪 Example Usage

```js
const input = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  },
  f: null,
  g: [4, 5]
};

const flat = flattenObject(input);
console.log('✅ Final Flattened Object:', flat);
```

---

## 🔍 Output in Console

```txt
🟡 Processing key: "a" 1
✅ Setting result["a"] = 1

🟡 Processing key: "b" { c: 2, d: { e: 3 } }
🔁 Recursing into nested object at key: "b"

🟡 Processing key: "b_c" 2
✅ Setting result["b_c"] = 2

🟡 Processing key: "b_d" { e: 3 }
🔁 Recursing into nested object at key: "b_d"

🟡 Processing key: "b_d_e" 3
✅ Setting result["b_d_e"] = 3

🟡 Processing key: "f" null
✅ Setting result["f"] = null

🟡 Processing key: "g" [4, 5]
✅ Setting result["g"] = [4, 5]

📦 Current flattened result: {
  a: 1,
  b_c: 2,
  b_d_e: 3,
  f: null,
  g: [4, 5]
}
```

---

## 🧠 Notes

* **Null-safe** : Checks `value !== null`.
* **Array-safe** : Leaves arrays as-is.
* **No global state** : Uses `result` as an accumulator.
* **Prefix logic** : Avoids leading underscores.

