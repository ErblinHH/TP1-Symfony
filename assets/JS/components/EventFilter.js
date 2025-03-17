import React, { useState } from "react";
const EventFilter = ({ events }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEvents = events.filter(event =>
        event.id.toString().includes(searchTerm) ||
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.date && event.date.date && event.date.date.includes(searchTerm)) ||
        (event.artist_name && event.artist_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.creator_email && event.creator_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ margin: "20px" }}>
            <input
                type="text"
                placeholder="🔍 Recherche un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid cyan",
                    width: "100%",
                    maxWidth: "400px",
                    marginBottom: "20px",
                    outline: "none",
                    backgroundColor: "#16213e",
                    color: "white"
                }}
            />

            <table style={{ width: "100%", maxWidth: "800px", margin: "0 auto", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Date</th>
                    <th>Artiste</th>
                    <th>Créateur</th>
                </tr>
                </thead>
                <tbody>
                {filteredEvents.map(event => (
                    <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.name}</td>
                        <td>{event.date ? event.date.date : ""}</td>
                        <td>{event.artist_name || "❌"}</td>
                        <td>{event.creator_email || "❌"}</td>
                    </tr>
                ))}
                {filteredEvents.length === 0 && (
                    <tr>
                        <td colSpan="5">Aucun événement trouvé.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default EventFilter;
