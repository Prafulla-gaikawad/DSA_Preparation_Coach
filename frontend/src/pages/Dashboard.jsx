import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your personal details and account information.
            </p>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Account created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Last login
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Stats Section */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Your Progress
            </h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-blue-600 truncate">
                    Total Problems Solved
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-900">
                    {user.solvedProblems?.length || 0}
                  </dd>
                </div>
              </div>

              <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-green-600 truncate">
                    Easy Problems
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-900">
                    {user.solvedProblems?.filter((p) => p.difficulty === "easy")
                      .length || 0}
                  </dd>
                </div>
              </div>

              <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-yellow-600 truncate">
                    Medium Problems
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-900">
                    {user.solvedProblems?.filter(
                      (p) => p.difficulty === "medium"
                    ).length || 0}
                  </dd>
                </div>
              </div>

              <div className="bg-red-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-red-600 truncate">
                    Hard Problems
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-red-900">
                    {user.solvedProblems?.filter((p) => p.difficulty === "hard")
                      .length || 0}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
