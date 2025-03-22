import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./pages/events.jsx";
import Users from "./pages/users.jsx";
import Artists from "./pages/artists.jsx";
import HomePage from "./pages/homepage.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";

const NotFound = () => <h1 style={{ textAlign: "center", marginTop: "20px", color: "red" }}>🚨 Erreur 404 - Page introuvable 🚨</h1>;

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<Events />} />
                <Route path="/users" element={<Users />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Router>
    );
};

export default App;
