import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateArtist.css"; // Mets à jour avec ton fichier CSS

function CreateEvent() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [artistId, setArtistId] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const eventData = {
            name,
            date,
            artistId: artistId ? parseInt(artistId) : null,
        };

        fetch("http://127.0.0.1:8000/api/events/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la création de l'événement");
                return res.json();
            })
            .then(() => {
                navigate("/events"); // Rediriger après la création
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="container">
            <h1>➕ Créer un nouvel événement</h1>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Nom de l'événement :</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Date :</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <label>ID de l'artiste :</label>
                <input
                    type="number"
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    placeholder="Optionnel"
                />

                <button type="submit" className="btn btn-primary">
                    ✅ Créer l'événement
                </button>
            </form>

            <button onClick={() => navigate("/events")} className="btn">
                ⬅ Retour à la liste
            </button>
        </div>
    );
}

export default CreateEvent;
