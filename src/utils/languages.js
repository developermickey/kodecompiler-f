// src/utils/languages.js

// 1. The list for your dropdown UI
export const SUPPORTED_LANGUAGES = [
  { value: "python", label: "Python", defaultExt: ".py" },
  { value: "javascript", label: "JavaScript", defaultExt: ".js" },
  { value: "java", label: "Java", defaultExt: ".java" },
  { value: "cpp", label: "C++", defaultExt: ".cpp" }, // Let's use 'cpp' as the base value to make life easier
  { value: "c", label: "C", defaultExt: ".c" },
  { value: "go", label: "Go", defaultExt: ".go" },
  { value: "rust", label: "Rust", defaultExt: ".rs" },
];

// 2. The Monaco Translator
export const getMonacoLanguage = (langValue) => {
  // If your app's value differs from Monaco's strict IDs, translate it here
  const monacoMap = {
    "bash": "shell",
    // "cpp" is already "cpp" so we are good, but you can add future weird ones here!
  };
  
  return monacoMap[langValue?.toLowerCase()] || langValue?.toLowerCase();
};

// 3. The Extension Detector
export const detectLanguageFromExtension = (filename) => {
  if (!filename) return null;
  const ext = filename.split(".").pop().toLowerCase();
  
  const extensionMap = {
    py: "python",
    js: "javascript",
    jsx: "javascript",
    ts: "javascript", // Monaco handles TS well under the javascript hood unless you need strict TS compiling
    java: "java",
    cpp: "cpp",
    c: "c",
    cc: "cpp",
    cxx: "cpp",
    go: "go",
    rs: "rust",
  };
  
  return extensionMap[ext] || null;
};