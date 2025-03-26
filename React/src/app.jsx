import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from "./pages/Events.jsx";
import Users from "./pages/Users.jsx";
import Artists from "./pages/Artists.jsx";
import Homepage from "./pages/Homepage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateArtist from "./pages/CreateArtist.jsx";
import EditArtist from "./pages/EditArtist.jsx";
import EventDetails from "./pages/EventDetail.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EditEvents from "./pages/EditEvents.jsx";

const NotFound = () => <h1 style={{ textAlign: "center", marginTop: "20px", color: "red" }}>🚨 Erreur 404 - Page introuvable 🚨</h1>;

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/events" element={<Events />} />
                <Route path="/users" element={<Users />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/artists/edit/:id" element={<EditArtist />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/artists/createArtist" element={<CreateArtist />} />
                <Route path="/events/createEvent" element={<CreateEvent />} />
                <Route path="/events/edit/:id" element={<EditEvents />} />

                <Route path="*" element={<NotFound />} />

            </Routes>
        </Router>
    );
};

export default App;
