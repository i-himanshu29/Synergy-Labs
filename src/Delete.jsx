import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const DeleteUser = () => {
  const [users, setUsers] = useState([]); // State to hold users list
  const [userToDelete, setUserToDelete] = useState(null); // State for user to delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(false); // Loading state for DELETE request
  const [error, setError] = useState(null); // Error state

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
        toast.success("Users fetched successfully!");
      } catch (error) {
        setError(error.message);
        toast.error(`Error fetching users: ${error.message}`);
      }
    };
    fetchUsers();
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setUserToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Perform DELETE request to API
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the user from UI
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
      closeDeleteModal(); // Close the modal
      toast.success("User deleted successfully!"); // Success notification
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`); // Error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <h1 className="text-2xl font-bold text-center my-4">Delete User</h1>

      {/* Users List */}
      <div className="overflow-x-auto mb-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Website</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{user.website}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => openDeleteModal(user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="mb-4">
              Are you sure you want to delete <strong>{userToDelete.name}</strong>?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
