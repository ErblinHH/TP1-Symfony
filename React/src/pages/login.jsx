import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Artists.css'; // Mettez à jour avec le bon fichier CSS

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer le token JWT depuis le localStorage
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Faire la requête vers l'endpoint /api/events en incluant le token dans les headers
        fetch('http://127.0.0.1:8000/api/events', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
                // Optionnel : rediriger vers la page de login si le token est invalide ou expiré
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container">
            <h1>🎨 Liste des événements 🎨</h1>

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
                            <td>{event.creator_id}</td>
                            <td>{event.artiste_id}</td>
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
