import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateArtist.css"; // Mets à jour avec ton fichier CSS

function CreateEvent() {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [artistId, setArtistId] = useState("");
    const [artists, setArtists] = useState([]); // Liste des artistes
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Vérifier l'authentification
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        // Récupérer l'utilisateur connecté sans vérifier le rôle admin
        fetch("http://127.0.0.1:8000/api/me", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!data) {
                    navigate("/login");
                    return;
                }
                setUser(data);
            })
            .catch(() => navigate("/events"));
    }, [navigate]);

    // Charger la liste des artistes
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        fetch("http://127.0.0.1:8000/api/artists", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Ajout du token si nécessaire
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors du chargement des artistes");
                return res.json();
            })
            .then((data) => setArtists(data))
            .catch((err) =>
                console.error("Erreur de chargement des artistes :", err)
            );
    }, []);

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
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(eventData),
        })
            .then((res) => {
                if (!res.ok)
                    throw new Error("Erreur lors de la création de l'événement");
                return res.json();
            })
            .then(() => {
                navigate("/events"); // Rediriger après la création
            })
            .catch((err) => setError(err.message));
    };

    // Afficher un message de chargement en attendant la récupération de l'utilisateur
    if (!user) return <p>Chargement...</p>;

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

                <label>Artiste :</label>
                <select
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    required
                >
                    <option value="">-- Sélectionner un artiste --</option>
                    {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                            {artist.name}
                        </option>
                    ))}
                </select>

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
