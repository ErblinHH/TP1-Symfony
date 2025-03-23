import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Artists.css"; // Mettez à jour avec le bon fichier CSS

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(""); // 📅 État pour stocker la date sélectionnée
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [filterDate]); // 🔄 Rafraîchir la liste quand la date change

    const fetchEvents = () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        // Construire l'URL avec le filtre (si une date est sélectionnée)
        let url = "http://127.0.0.1:8000/api/events";
        if (filterDate) {
            url += `?date=${filterDate}`;
        }

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Utilisateur non authentifié");
                }
                return res.json();
            })
            .then((data) => setEvents(data))
            .catch((error) => {
                console.error("Erreur lors de la récupération des événements :", error);
                navigate("/login");
            })
            .finally(() => setLoading(false));
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container">
            <h1>🎨 Liste des événements 🎨</h1>

            {/* 📅 Sélecteur de date */}
            <label>Filtrer par date :</label>
            <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
            />

            {events.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Créateur</th>
                        <th>Artiste</th>
                        <th>Nom</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.createdBy?.email || "N/A"}</td>
                            <td>{event.artistId}</td>
                            <td>{event.name}</td>
                            <td>{event.date}</td>
                            <td>
                                <a href={`/events/${event.id}`} className="btn btn-small">
                                    👀 Voir
                                </a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun événement trouvé.</p>
            )}

            <a href="/" className="btn">Retour à l'accueil</a>
        </div>
    );
}

export default Events;
