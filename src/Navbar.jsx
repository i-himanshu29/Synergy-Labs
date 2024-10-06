// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-bold">Synergy Labs</h1>
                <div>
                    <Link to="/" className="text-white px-4 hover:text-gray-300">Fetch Users</Link>
                    <Link to="/create" className="text-white px-4 hover:text-gray-300">Create User</Link>
                    <Link to="/update" className="text-white px-4 hover:text-gray-300">Update User</Link>
                    <Link to="/delete" className="text-white px-4 hover:text-gray-300">Delete User</Link>
                    <Link to="/manage" className="text-white px-4 hover:text-gray-300">Manage Users </Link>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
