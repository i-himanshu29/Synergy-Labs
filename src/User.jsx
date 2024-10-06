import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const NewUserForm = () => {
  const [users, setUsers] = useState([]); // State to store users list
  const [isOpen, setIsOpen] = useState(false); // State for modal open/close
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "USER-", // Default username format
    phone: "",
    website: "",
    street: "",
    city: "",
    companyName: ""
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  // Toggle modal
  const toggleModal = () => setIsOpen(!isOpen);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
      // Autofill username when name changes
      username: name === "name" ? `USER-${value}` : prev.username,
    }));
  };

  // Form validation
  const validateForm = () => {
    let tempErrors = {};
    if (!newUser.name || newUser.name.length < 3) {
      tempErrors.name = "Name is required and must be at least 3 characters.";
    }
    if (!newUser.email || !/\S+@\S+\.\S+/.test(newUser.email)) {
      tempErrors.email = "Email is required and must be a valid email format.";
    }
    if (!newUser.phone || !/^\d{10}$/.test(newUser.phone)) {
      tempErrors.phone = "Phone is required and must be a valid phone number.";
    }
    if (!newUser.street) {
      tempErrors.street = "Street address is required.";
    }
    if (!newUser.city) {
      tempErrors.city = "City is required.";
    }
    if (newUser.companyName && newUser.companyName.length < 3) {
      tempErrors.companyName = "Company name must be at least 3 characters if provided.";
    }
    if (newUser.website && !/^(ftp|http|https):\/\/[^ "]+$/.test(newUser.website)) {
      tempErrors.website = "Website must be a valid URL if provided.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0; // Return true if no errors
  };

  // Submit form (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError({});
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      const data = await response.json();
      setUsers([...users, data]); // Add new user to list
      setNewUser({
        name: "",
        email: "",
        username: "USER-",
        phone: "",
        website: "",
        street: "",
        city: "",
        companyName: ""
      });
      toggleModal(); // Close the modal
      toast.success("User created successfully!"); // Success notification
    } catch (err) {
      setError({ api: err.message });
      toast.error(`Error: ${err.message}`); // Error notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer /> {/* Toast container for displaying toast notifications */}
      <h1 className="text-2xl font-bold text-center my-4">Create User</h1>

      {/* Button to open modal */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={toggleModal}
      >
        Create New User
      </button>

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
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">{user.id}</td>
                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{user.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            {error.api && <p className="text-red-500 mb-4">{error.api}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {error.name && <p className="text-red-500">{error.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {error.email && <p className="text-red-500">{error.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={newUser.username}
                  className="w-full px-3 py-2 border rounded"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {error.phone && <p className="text-red-500">{error.phone}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Website</label>
                <input
                  type="text"
                  name="website"
                  value={newUser.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
                {error.website && <p className="text-red-500">{error.website}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Street</label>
                <input
                  type="text"
                  name="street"
                  value={newUser.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {error.street && <p className="text-red-500">{error.street}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={newUser.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {error.city && <p className="text-red-500">{error.city}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Company Name (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  value={newUser.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
                {error.companyName && <p className="text-red-500">{error.companyName}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewUserForm;
