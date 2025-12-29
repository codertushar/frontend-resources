export default {
  id: 'breadcrumb-navigator',
  title: '🧭 Breadcrumb Navigator',
  description: 'Build a breadcrumb navigation component for nested object exploration.',
  difficulty: 'medium',
  type: 'preview',
  category: 'React',
  tags: ['navigation', 'state-management', 'nested-data'],
  defaultLanguage: 'react',
  starterCode: {
    // Only React version - this is a React-specific component
    react: `import { useState } from 'react';

const Breadcrumbs = ({ data }) => {
  // "path" holds the keys to navigate the nested object
  const [path, setPath] = useState([]);

  // Get current nested value using the path
  // TODO: Implement using reduce
  const currentData = null;

  // Navigate back to a specific breadcrumb level
  const handleClick = (index) => {
    // TODO: Implement breadcrumb navigation
  };

  // Drill down by adding a key to the current path
  const handleDrillDown = (key) => {
    // TODO: Implement drill-down logic
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: "15px", fontSize: "1.2em" }}>
        <span onClick={() => setPath([])} style={{ cursor: "pointer" }}>
          🏠 Home
        </span>
        {/* TODO: Render breadcrumb path */}
      </div>

      {/* Content Display */}
      <div>
        {/* TODO: Display current data or list of keys */}
      </div>
    </div>
  );
};

// Sample data
const sampleData = {
  "Fruits": {
    "Citrus": {
      "Orange": "Sweet and juicy 🍊",
      "Lemon": "Sour and zesty 🍋"
    },
    "Berries": {
      "Strawberry": "Red and delicious 🍓"
    }
  },
  "Vegetables": {
    "Leafy": {
      "Spinach": "Healthy and green 🥬"
    }
  }
};

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Breadcrumb Navigator</h1>
      <Breadcrumbs data={sampleData} />
    </div>
  );
}
`
  },
  solution: {
    // Only React solution
    react: `import { useState } from 'react';

const Breadcrumbs = ({ data }) => {
  const [path, setPath] = useState([]);

  const currentData = path.reduce((acc, key) => acc && acc[key], data);

  const handleClick = (index) => setPath(path.slice(0, index + 1));

  const handleDrillDown = (key) => {
    if (currentData && typeof currentData === 'object') {
      setPath([...path, key]);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "15px", fontSize: "1.2em" }}>
        <span onClick={() => setPath([])} style={{ cursor: "pointer" }}>
          🏠 Home
        </span>
        {path.map((key, index) => (
          <span key={index}>
            {" 👉 "}
            <span onClick={() => handleClick(index)} style={{ cursor: "pointer" }}>
              {key}
            </span>
          </span>
        ))}
      </div>
      <div>
        {currentData && typeof currentData === "object" ? (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {Object.keys(currentData).map((key) => (
              <li key={key} onClick={() => handleDrillDown(key)} style={{ cursor: "pointer", margin: "5px 0" }}>
                📂 {key}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: "1.2em" }}>📄 {currentData !== undefined ? currentData : "No data"}</div>
        )}
      </div>
    </div>
  );
};

const sampleData = {
  "Fruits": {
    "Citrus": {
      "Orange": "Sweet and juicy 🍊",
      "Lemon": "Sour and zesty 🍋"
    },
    "Berries": {
      "Strawberry": "Red and delicious 🍓"
    }
  },
  "Vegetables": {
    "Leafy": {
      "Spinach": "Healthy and green 🥬"
    }
  }
};

export default function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Breadcrumb Navigator</h1>
      <Breadcrumbs data={sampleData} />
    </div>
  );
}`
  },
  testCases: [
    {
      name: 'Can navigate nested structure',
      description: 'Click through the breadcrumbs to test navigation',
      manual: true
    }
  ]
};
