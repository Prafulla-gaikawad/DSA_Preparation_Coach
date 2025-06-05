import React from "react";

const ProblemDetail = ({ problem }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {problem?.title || "Two Sum"}
          </h1>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Easy
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Arrays
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Description
        </h2>
        <p className="text-gray-600">
          {problem?.description ||
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice."}
        </p>
      </div>

      {/* Examples */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Examples</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 mb-2">
            <strong>Example 1:</strong>
          </p>
          <pre className="bg-gray-100 p-3 rounded text-sm">
            Input: nums = [2,7,11,15], target = 9{"\n"}
            Output: [0,1]{"\n"}
            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
          </pre>
        </div>
      </div>

      {/* Constraints */}
      <div className="mt-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Constraints
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>2 ≤ nums.length ≤ 10⁴</li>
          <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
          <li>-10⁹ ≤ target ≤ 10⁹</li>
          <li>Only one valid answer exists.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProblemDetail;
