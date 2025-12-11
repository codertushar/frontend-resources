# 📋 Deep Clone Implementation

Here are the most reliable ways to perform a **deep clone** of an object in JavaScript.

---

## ✅ Structured Clone (Modern & Robust)

Supports functions, dates, maps, sets, circular references, etc.

```js
const deepClone = structuredClone(original);
```

> ✅ Fast and standard.
>
> ❌ Not supported in older environments (e.g., Node <17, legacy browsers).

---

### ✅ 2. **Lodash `cloneDeep`**

```js
import cloneDeep from 'lodash/cloneDeep';

const deepClone = cloneDeep(original);
```

> ✅ Handles most edge cases.
>
> ✅ Works in all JS environments.
>
> ❌ Requires external dependency.

---

### ⚠️ 3. **Manual Recursion (Custom Deep Clone)**

For full control; avoid unless necessary.

```js
function deepClone(obj, hash = new WeakMap()) {
  if (Object(obj) !== obj || obj instanceof Function) return obj;
  if (hash.has(obj)) return hash.get(obj); // handle circular refs

  const result = Array.isArray(obj) ? [] : 
                 obj instanceof Date ? new Date(obj) :
                 obj instanceof RegExp ? new RegExp(obj.source, obj.flags) :
                 Object.create(Object.getPrototypeOf(obj));

  hash.set(obj, result);
  for (const key of Reflect.ownKeys(obj)) {
    result[key] = deepClone(obj[key], hash);
  }
  return result;
}

// or more simply:

function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;

  const newObj = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    newObj[key] = deepCopy(obj[key]);
  }
  return newObj;
}

```

> ✅ Fine-grained control.
>
> ❌ Error-prone, needs frequent updates for edge cases.

---

### ⚠️ 4. **`JSON.parse(JSON.stringify(obj))` (Not Recommended for Complex Objects)**

```js
const deepClone = JSON.parse(JSON.stringify(original));
```

> ❌ Strips functions, `undefined`, symbols, dates, regex, etc.
>
> ✅ Okay for simple objects only.

---

### Recommendation:

* Use `structuredClone` if environment supports it.
* Else use `cloneDeep` from Lodash.
* Use manual recursion only when you need custom behavior.

Let me know your runtime constraints if you want a tailored version.
