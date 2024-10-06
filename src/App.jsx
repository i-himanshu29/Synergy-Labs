// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import
import Navbar from './Navbar';
import Combine from './Combine'; // Main user management component
import User from './User'; // CreateUser component
import Update from './Update'; // UpdateUser component
import Delete from './Delete'; // DeleteUser component
import Fetch from './Fetch'; // DeleteUser component

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Fetch />} /> {/* Ensure ManageUsers is set here */}
                    <Route path="/create" element={<User />} />
                    <Route path="/update" element={<Update />} />
                    <Route path="/delete" element={<Delete />} />
                    <Route path="/manage" element={<Combine/>} />
                    
                </Routes>
            </div>
        </Router>
    );
};

export default App;
