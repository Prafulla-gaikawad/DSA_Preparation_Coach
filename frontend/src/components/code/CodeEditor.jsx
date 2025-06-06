import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    input: "4\n2",
    expectedOutput: "6",
    description: "Test Case 1: Basic addition",
  },
  {
    input: "10\n-5",
    expectedOutput: "5",
    description: "Test Case 2: Addition with negative number",
  },
];

const CodeEditor = ({ onRun }) => {
  const { problemId } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (problemId) {
      fetchProblemData();
    }
  }, [problemId]);

  const fetchProblemData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/${problemId}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log("Full Problem Data:", data);
        console.log("Test Cases:", data.testCases);
        setProblemData(data);

        // If problem has starter code, set it in the editor
        if (data.starterCode) {
          setCode(data.starterCode);
        }
      } else {
        console.error(
          "Failed to fetch problem:",
          data.message || "Unknown error"
        );
      }
    } catch (err) {
      console.error("Error fetching problem:", err);
    }
  };

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
      // Format test cases to match backend structure and properly handle newlines
      const formattedTestCases =
        problemData?.testCases?.map((testCase) => {
          // Split the input string by literal '\n' and join with actual newlines
          const formattedInput = testCase.input.replace(/\\n/g, "\n");

          return {
            input: formattedInput,
            expectedOutput: testCase.output || "",
            description: `Test Case ${
              testCase._id ? testCase._id.slice(-4) : ""
            }`,
          };
        }) || [];

      console.log("Sending test cases to backend:", formattedTestCases);

      const response = await fetch("http://localhost:5000/api/code/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases: formattedTestCases,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        // Map the results to include the original test case
        const mappedResults = data.results.map((result, index) => ({
          ...result,
          testCase: formattedTestCases[index],
        }));
        setResults(mappedResults);
      } else {
        setError(data.error || "Failed to execute code");
      }
    } catch (err) {
      console.error("Execution error:", err);
      setError("Failed to execute code: " + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Add Problem Info Display */}
      {/* {problemData && (
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold mb-2">{problemData.title}</h2>
          <p className="text-gray-700 mb-2">{problemData.description}</p>
          {problemData.difficulty && (
            <span
              className={`inline-block px-2 py-1 rounded text-sm ${
                problemData.difficulty === "easy"
                  ? "bg-green-100 text-green-800"
                  : problemData.difficulty === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {problemData.difficulty.charAt(0).toUpperCase() +
                problemData.difficulty.slice(1)}
            </span>
          )}
        </div>
      )} */}

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

      {/* Test Results Panel */}
      {results && (
        <div className="p-4 border-t bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Test Results</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  result.passed
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {result.testCase?.description || `Test Case ${index + 1}`}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      result.passed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.passed ? "Passed" : "Failed"}
                  </span>
                </div>
                {!result.passed && (
                  <div className="mt-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Input:</span>{" "}
                      <pre className="mt-1 whitespace-pre-wrap">
                        {result.testCase?.input || "No input"}
                      </pre>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Expected:</span>{" "}
                      {result.testCase?.expectedOutput || "No expected output"}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Got:</span>{" "}
                      {result.actualOutput || "No output"}
                    </p>
                    {result.error && (
                      <p className="text-red-600 mt-1">Error: {result.error}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
