import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

const SUPPORTED_LANGUAGES = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
];

const DEFAULT_TEST_CASES = [
  {
    input: "5\n3",
    expectedOutput: "8",
    description: "Test Case 1: Basic addition",
  },
  {
    input: "10\n-5",
    expectedOutput: "5",
    description: "Test Case 2: Addition with negative number",
  },
];

const CodeEditor = () => {
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setError("Please write some code first");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("http://localhost:5000/api/code/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases: DEFAULT_TEST_CASES,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to execute code");
      }

      setResults(data.results);
    } catch (err) {
      setError(err.message || "An error occurred while running the code");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
          >
            {theme === "vs-dark" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Dark</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className={`px-4 py-1.5 rounded text-sm font-medium flex items-center space-x-2 ${
            isRunning
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          <span>{isRunning ? "Running..." : "Run Code"}</span>
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          language={language}
          theme={theme}
          value={code}
          onChange={handleEditorChange}
          onMount={(editor) => {
            editorRef.current = editor;
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Results Panel */}
      <div className="p-4 border-t bg-white">
        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
        {error && (
          <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        {results && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.passed ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{result.passed ? "✅" : "❌"}</span>
                  <span className="font-medium">
                    {result.testCase.description}
                  </span>
                </div>
                {!result.passed && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Expected:</span>{" "}
                      {result.expectedOutput}
                    </p>
                    <p>
                      <span className="font-medium">Got:</span>{" "}
                      {result.output || "No output"}
                    </p>
                    {result.error && (
                      <p className="text-red-600">
                        <span className="font-medium">Error:</span>{" "}
                        {result.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
