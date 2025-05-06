# 🐫➡️🐍 Converting camelCase to snake_case in JavaScript (Without Regex)

In the world of code conventions, case styles are more than aesthetics — they're contracts. JavaScript favors `camelCase`, while many APIs, databases, and configuration files lean on `snake_case`. Converting between them is a common task — and yes, regex is usually the weapon of choice. But what if you want **clarity, control, or speed**, and **no regex**?

Let's walk through an elegant, loop-based solution.

## 🧠 The Problem

We want to convert this:

```js
"camelCaseExample"
```

Into this:

```js
"camel_case_example"
```

Without using `.replace()` or regular expressions.

## 🚫 The Regex Way (Just for Comparison)

```js
function camelToSnake(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}
```

Great, but regex has downsides:
- Black-box behavior
- Poor readability
- Harder to debug
- Slower on large strings

Let's throw it out and do it manually.

## ✅ The Loop-Based Approach

```js
function camelToSnake(str) {
  let result = '';
  for (let char of str) {
    if (char >= 'A' && char <= 'Z') {
      result += '_' + char.toLowerCase();
    } else {
      result += char;
    }
  }
  return result;
}
```

### 🧪 Example:

```js
camelToSnake("camelCaseExample"); // "camel_case_example"
camelToSnake("getHTTPResponseCode"); // "get_h_t_t_p_response_code"
```

## 🤔 What About Acronyms?

That naive version splits **every uppercase letter** — which can shred acronyms into noise.

Let's fix that with a smarter variant:

```js
function camelToSnakeSmart(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const prevIsLower = i > 0 && str[i - 1] >= 'a' && str[i - 1] <= 'z';

    if (isUpper && prevIsLower) {
      result += '_' + char.toLowerCase();
    } else {
      result += char.toLowerCase();
    }
  }
  return result;
}
```

### 🔍 Behavior:

```js
camelToSnakeSmart("getHTTPResponseCode"); // "get_http_response_code"
```

We only insert underscores **between lowercase–uppercase transitions**, preserving acronyms.

## 💡 Why This Matters

- ✅ **Readable**: Anyone can follow the logic.
- 🚀 **Fast**: No pattern engine overhead.
- 🧩 **Customizable**: Want kebab-case? Just tweak one line.
- 🛠️ **Debuggable**: Step through with a debugger, no black magic.

## 🔁 Bonus: From snake_case to camelCase?

Simple. Here's how:

```js
function snakeToCamel(str) {
  return str.split('_').map((word, i) =>
    i === 0 ? word : word[0].toUpperCase() + word.slice(1)
  ).join('');
}
```

```js
snakeToCamel("get_http_response_code"); // "getHttpResponseCode"
```

## 🔚 Closing Thoughts

Regex has its place, but for small transforms, **explicit logic wins** — it's more maintainable, more tunable, and often faster. Next time you're wrangling format conversions, consider reaching for clarity over cleverness.
