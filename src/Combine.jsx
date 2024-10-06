import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", website: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // New state for search term
    // Fetch users from JSONPlaceholder API
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await fetch("https://jsonplaceholder.typicode.com/users");
    //             if (!response.ok) throw new Error("Failed to fetch users");
    //             const data = await response.json();
    //             setUsers(data);
    //         } catch (error) {
    //             toast.error("Error fetching users.");
    //             console.error("Error fetching users:", error);
    //         }
    //     };
    //     fetchUsers();
    // }, []);


     // Fetch users from JSONPlaceholder API
     useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users");
                const data = await response.json();
                setUsers(data);
                setFilteredUsers(data); // Set both users and filteredUsers to the fetched data
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(users); // Show all users if search term is empty
        } else {
            setFilteredUsers(
                users.filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, users]);

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };




    // Open Edit Modal
    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    // Close Edit Modal
    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    // Handle form input changes for editing user
    const handleEditChange = (e) => {
        setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
    };

    // Update user (PUT request)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/users/${selectedUser.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedUser),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const updatedUser = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );
            closeEditModal();
            toast.success("User updated successfully.");
        } catch (err) {
            setError(err.message);
            toast.error("Error updating user.");
        } finally {
            setLoading(false);
        }
    };

    // Open Delete Modal
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // Close Delete Modal
    const closeDeleteModal = () => {
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
    };

    // Delete user (DELETE request)
    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/users/${userToDelete.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Failed to delete user");

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToDelete.id));
            closeDeleteModal();
            toast.success("User deleted successfully.");
        } catch (err) {
            setError(err.message);
            toast.error("Error deleting user.");
        } finally {
            setLoading(false);
        }
    };

    // Open Add Modal
    const openAddModal = () => {
        setNewUser({ name: "", email: "", phone: "", website: "" });
        setIsAddModalOpen(true);
    };

    // Close Add Modal
    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    // Handle form input changes for adding new user
    const handleNewUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    // Add new user (POST request)
    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) throw new Error("Failed to add new user");

            const addedUser = await response.json();
            addedUser.id = Date.now(); // Temporary ID
            setUsers((prevUsers) => [...prevUsers, addedUser]);
            closeAddModal();
            toast.success("User added successfully.");
        } catch (err) {
            setError(err.message);
            toast.error("Error adding new user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <ToastContainer />
            <h1 className="text-2xl font-bold text-center my-4">Manage Users</h1>

             {/* Search Input */}
             <div className="mb-4  flex justify-center items-center ">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-1/3 border border-gray-300 rounded p-2"
                />
            </div>

            {/* Add User Button */}
            <div className="text-right mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={openAddModal}
                >
                    Add New User
                </button>
            </div>

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
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {user.id}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.website}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    {/* Edit Button */}
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                        onClick={() => openEditModal(user)}
                                    >
                                        Edit
                                    </button>
                                    {/* Delete Button */}
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

            {/* Modals for Add, Edit, Delete (Similar to your original code) */}
            {/* Edit Modal */}
            {/* Edit User Modal */}
            {isEditModalOpen && selectedUser && (
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
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={selectedUser.email}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={selectedUser.phone}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={selectedUser.website}
                                    onChange={handleEditChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={closeEditModal}
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

            {/* Delete User Modal */}
            {isDeleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                        <h2 className="text-xl font-bold mb-4">Delete User</h2>
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

            {/* Add New User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleAddUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newUser.name}
                                    onChange={handleNewUserChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleNewUserChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={newUser.phone}
                                    onChange={handleNewUserChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={newUser.website}
                                    onChange={handleNewUserChange}
                                    className="w-full border border-gray-300 rounded p-2"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                    onClick={closeAddModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Adding..." : "Add User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
