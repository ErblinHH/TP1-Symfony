import { useState, useEffect } from 'react';
import './Artists.css';

function Events() {
    console.log("Le composant Events est monté !"); // Ajoute ce log
    const [events, setEvent] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/events')
            .then((res) => res.json())
            .then((data) => {
                console.log("Données reçues :", data);
                setEvent(data);
            })
            .catch((error) => console.error("Erreur lors de la récupération des événements :", error));
    }, []);

    return (
        <div className="container">
            <h1>🎨 Liste des evenements 🎨</h1>

            {events.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.creator_id}</td>
                            <td>{event.artiste_id}</td>
                            <td>{event.name}</td>
                            <td>{event.date}</td>

                            <td>
                                <a href={`/events/${event.id}`} className="btn btn-small">👀 Voir</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun events trouvé.</p>
            )}

            <a href="/" className="btn">Retour à l'accueil</a>
        </div>
    );
}

export default Events;
