import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const UpdateUserForm = () => {
  const [users, setUsers] = useState([]); // Users list state
  const [selectedUser, setSelectedUser] = useState(null); // User being edited
  const [isOpen, setIsOpen] = useState(false); // Modal open/close state
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState(""); 
  // Fetch users from JSONPlaceholder API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Toggle modal
  const toggleModal = (user = null) => {
    setSelectedUser(user);
    setIsOpen(!isOpen);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      // Update the users array in state with the updated user data
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setIsOpen(false); // Close the modal
      toast.success("User updated successfully!"); // Success toast notification
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`); // Error toast notification
    } finally {
      setLoading(false);
    }
  };

   // Filter users based on search term
   const filteredUsers = users.filter((user) =>
   user.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Handle search input changes
const handleSearchChange = (e) => {
   setSearchTerm(e.target.value);
};

  return (
    <div className="container mx-auto px-4">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <h1 className="text-2xl font-bold text-center my-4">Update User</h1>


        {/* Search Input */}
        <div className="mb-4 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/3 border border-gray-300 rounded p-2"
                />
          </div>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Loading Indicator */}
            {loading && <p>Loading users...</p>}



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
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => toggleModal(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Website</label>
                <input
                  type="text"
                  name="website"
                  value={selectedUser.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => toggleModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUserForm;
