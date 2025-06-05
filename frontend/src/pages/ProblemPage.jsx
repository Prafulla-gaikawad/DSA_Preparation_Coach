import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import ProblemDetail from "../components/problems/ProblemDetail";
import CodeEditor from "../components/code/CodeEditor";
import AIMentorChat from "../components/coach/AIMentorChat";
import TestResults from "../components/code/TestResults";

const ResizablePanel = ({
  children,
  size,
  onResizeStop,
  minHeight,
  maxHeight,
  className = "",
}) => {
  return (
    <Resizable
      size={size}
      onResizeStop={onResizeStop}
      enable={{ bottom: true }}
      minHeight={minHeight}
      maxHeight={maxHeight}
      className={`relative bg-white rounded-lg shadow-md ${className}`}
      style={{ transition: "none" }}
    >
      <div className="h-full w-full overflow-auto">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 cursor-row-resize hover:bg-blue-500 z-10" />
    </Resizable>
  );
};

const ScrollablePanel = ({ children, className = "" }) => {
  return (
    <div
      className={`h-full w-full bg-white rounded-lg shadow-md overflow-auto ${className}`}
    >
      {children}
    </div>
  );
};

const ProblemPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [leftPanelHeight, setLeftPanelHeight] = useState("50%");
  const [rightPanelHeight, setRightPanelHeight] = useState("50%");
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/test", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBackendStatus(data);
        console.log("Backend connection status:", data);
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setBackendStatus({
          status: "error",
          message: `Failed to connect to backend: ${error.message}`,
          error: error.message,
        });
      }
    };

    checkBackendConnection();
  }, []);

  const handleRunCode = (code) => {
    // TODO: Implement code execution logic
    console.log("Running code:", code);
  };

  const calculateNewHeight = (currentHeight, delta, totalHeight) => {
    const newHeight = parseInt(currentHeight) + delta;
    const minHeight = 200; // Minimum height in pixels
    const maxHeight = totalHeight * 0.8; // 80% of total height
    return Math.min(Math.max(newHeight, minHeight), maxHeight);
  };

  const handleLeftResize = (e, direction, ref, d) => {
    const totalHeight = window.innerHeight - 32; // Account for padding
    const newHeight = calculateNewHeight(
      parseInt(leftPanelHeight),
      d.height,
      totalHeight
    );
    const newHeightPercent = (newHeight / totalHeight) * 100;
    const remainingPercent = 100 - newHeightPercent;

    setLeftPanelHeight(`${newHeightPercent}%`);
    setRightPanelHeight(`${remainingPercent}%`);
  };

  const handleRightResize = (e, direction, ref, d) => {
    const totalHeight = window.innerHeight - 32; // Account for padding
    const newHeight = calculateNewHeight(
      parseInt(rightPanelHeight),
      d.height,
      totalHeight
    );
    const newHeightPercent = (newHeight / totalHeight) * 100;
    const remainingPercent = 100 - newHeightPercent;

    setRightPanelHeight(`${newHeightPercent}%`);
    setLeftPanelHeight(`${remainingPercent}%`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Backend Status Indicator */}
      {backendStatus && (
        <div
          className={`mb-4 p-2 rounded ${
            backendStatus.status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Backend Status: {backendStatus.message}
          {backendStatus.timestamp && (
            <span className="text-sm ml-2">
              (Last checked:{" "}
              {new Date(backendStatus.timestamp).toLocaleTimeString()})
            </span>
          )}
        </div>
      )}

      <div className="h-[calc(100vh-2rem)] flex gap-4">
        {/* Left Column */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Problem Statement */}
          <ResizablePanel
            size={{ width: "100%", height: leftPanelHeight }}
            onResizeStop={handleLeftResize}
            minHeight={200}
            maxHeight="80vh"
            className="flex-shrink-0"
          >
            <div className="h-full overflow-auto">
              <ProblemDetail />
            </div>
          </ResizablePanel>

          {/* AI Mentor Chat */}
          <ScrollablePanel className="flex-1 min-h-[200px]">
            <AIMentorChat />
          </ScrollablePanel>
        </div>

        {/* Right Column */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Code Editor */}
          <ResizablePanel
            size={{ width: "100%", height: rightPanelHeight }}
            onResizeStop={handleRightResize}
            minHeight={200}
            maxHeight="80vh"
            className="flex-shrink-0"
          >
            <div className="h-full overflow-auto">
              <CodeEditor onRun={handleRunCode} />
            </div>
          </ResizablePanel>

          {/* Test Cases */}
          <ScrollablePanel className="flex-1 min-h-[200px]">
            <TestResults results={testResults} />
          </ScrollablePanel>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
