import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import styles for react-toastify

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
  </div>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <tr className="animate-pulse bg-gray-200">
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-16 rounded"></div>
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-40 rounded"></div>
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-32 rounded"></div>
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-48 rounded"></div>
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-24 rounded"></div>
    </td>
    <td className="border border-gray-300 px-4 py-2">
      <div className="bg-gray-300 h-6 w-32 rounded"></div>
    </td>
  </tr>
);

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from JSONPlaceholder API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        toast.error(`Error: ${error.message}`); // Show error toast
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <ToastContainer /> {/* Toast container to show the toast messages */}
        <h1 className="text-2xl font-bold text-center my-4">Users List</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Username</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Website</th>
              </tr>
            </thead>
            <tbody>
              {/* Display Skeleton Loaders while loading */}
              {[...Array(5)].map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <ToastContainer /> {/* Toast container to show the toast messages */}
      <h1 className="text-2xl font-bold text-center my-4">Users List</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Website</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-green-300"
                } hover:bg-gray-300`}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{user.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
