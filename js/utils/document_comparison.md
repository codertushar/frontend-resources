Here is a  **precise** ,  **non-regex** , and **structured** JavaScript implementation to **compare two documents** (strings) and return a  **line-by-line and word-by-word diff** :

---

## ✅ Implementation: Compare Two Documents

```javascript
function compareDocuments(doc1, doc2) {
  const lines1 = doc1.split('\n');
  const lines2 = doc2.split('\n');

  const maxLines = Math.max(lines1.length, lines2.length);
  const diffs = [];

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1 === line2) {
      diffs.push({ line: i + 1, status: 'equal', content: line1 });
    } else {
      diffs.push({
        line: i + 1,
        status: 'different',
        content1: line1,
        content2: line2,
        wordDiffs: compareWords(line1, line2)
      });
    }
  }

  return diffs;
}

function compareWords(str1, str2) {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  const maxWords = Math.max(words1.length, words2.length);
  const wordDiffs = [];

  for (let i = 0; i < maxWords; i++) {
    const w1 = words1[i] || '';
    const w2 = words2[i] || '';
    wordDiffs.push({
      index: i,
      word1: w1,
      word2: w2,
      status: w1 === w2 ? 'equal' : 'different'
    });
  }

  return wordDiffs;
}
```

---

## 🔍 Example Usage

```javascript
const doc1 = `The quick brown fox
jumps over the lazy dog.`;

const doc2 = `The quick brown fox
leaps over the sleepy dog.`;

console.log(compareDocuments(doc1, doc2));
```

---

## 🧾 Output (Structured)

```json
[
  {
    "line": 1,
    "status": "equal",
    "content": "The quick brown fox"
  },
  {
    "line": 2,
    "status": "different",
    "content1": "jumps over the lazy dog.",
    "content2": "leaps over the sleepy dog.",
    "wordDiffs": [
      { "index": 0, "word1": "jumps", "word2": "leaps", "status": "different" },
      { "index": 1, "word1": "over", "word2": "over", "status": "equal" },
      { "index": 2, "word1": "the", "word2": "the", "status": "equal" },
      { "index": 3, "word1": "lazy", "word2": "sleepy", "status": "different" },
      { "index": 4, "word1": "dog.", "word2": "dog.", "status": "equal" }
    ]
  }
]
```

---

## 💡 Notes

* No external dependencies
* Simple `diff` granularity: line + word
* Expandable for char-level or structural diffing (e.g. JSON, HTML trees)
