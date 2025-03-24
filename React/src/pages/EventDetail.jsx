import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [artist, setArtist] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }

        // Récupération des informations de l'utilisateur connecté
        fetch("http://127.0.0.1:8000/api/me", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject("Erreur lors de la récupération de l'utilisateur")))
            .then((userData) => setUser(userData))
            .catch((err) => console.error("Erreur utilisateur", err));

        // Récupération des détails de l'évènement
        fetch(`http://127.0.0.1:8000/api/events/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Évènement introuvable");
                return res.json();
            })
            .then((data) => {
                setEvent(data);
                // Si un artiste est associé, on le charge
                if (data.artistId) {
                    fetch(`http://127.0.0.1:8000/api/artists/${data.artistId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((res) => (res.ok ? res.json() : Promise.reject("Erreur lors du chargement de l'artiste")))
                        .then((artistData) => setArtist(artistData))
                        .catch((err) => console.error("Erreur artiste", err));
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // Fonction pour s'inscrire à l'évènement
    const handleSignup = () => {
        const token = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/events/${id}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de l'inscription");
                return res.json();
            })
            .then((data) => {
                // Mise à jour de la liste des utilisateurs inscrits
                setEvent({ ...event, users: data.users });
            })
            .catch((err) => setError(err.message));
    };

    // Fonction pour se désinscrire de l'évènement
    const handleUnsubscribe = () => {
        const token = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/events/${id}/unsubscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la désinscription");
                return res.json();
            })
            .then((data) => {
                setEvent({ ...event, users: data.users });
            })
            .catch((err) => setError(err.message));
    };

    // Fonction pour supprimer l'évènement (accessible uniquement au créateur)
    const handleDelete = () => {
        const token = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/events/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la suppression de l'évènement");
                navigate("/events");
            })
            .catch((err) => setError(err.message));
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!event) return <p>Évènement introuvable</p>;

    // Détermine si l'utilisateur connecté est le créateur de l'évènement
    const isCreator = user && event.createdBy && user.id === event.createdBy.id;
    // Détermine si l'utilisateur est déjà inscrit
    const isRegistered = event.users && user && event.users.some((u) => u.id === user.id);

    return (
        <div className="container">
            <h1>{event.name}</h1>
            <p>
                <strong>Date :</strong> {event.date}
            </p>
            {artist && (
                <p>
                    <strong>Artiste associé :</strong>{" "}
                    <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                </p>
            )}

            <h2>Utilisateurs inscrits</h2>
            {event.users && event.users.length > 0 ? (
                <ul>
                    {event.users.map((u) => (
                        <li key={u.id}>{u.email}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucun utilisateur inscrit.</p>
            )}

            <div className="actions">
                {isCreator ? (
                    <>
                        <button className="btn" onClick={() => navigate(`/events/${id}/edit`)}>
                            Modifier l'évènement
                        </button>
                        <button className="btn btn-secondary" onClick={handleDelete}>
                            Supprimer l'évènement
                        </button>
                    </>
                ) : isRegistered ? (
                    <button className="btn btn-secondary" onClick={handleUnsubscribe}>
                        Se désinscrire
                    </button>
                ) : (
                    <button className="btn" onClick={handleSignup}>
                        S'inscrire
                    </button>
                )}
            </div>

            <a href="/events" className="btn">
                Retour à la liste des évènements
            </a>
        </div>
    );
}

export default EventDetails;
