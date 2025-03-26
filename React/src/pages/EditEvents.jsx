import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/Artists.css"; // Mettez à jour avec le bon fichier CSS

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState({
        name: "",
        date: "",
        artistId: ""
    });
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Chargement des détails de l'événement à éditer
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login");
            return;
        }
        Promise.all([
            fetch(`http://127.0.0.1:8000/api/events/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors du chargement de l'événement");
                }
                return res.json();
            }),
            fetch("http://127.0.0.1:8000/api/artists", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors du chargement des artistes");
                }
                return res.json();
            })
        ])
            .then(([eventData, artistsData]) => {
                setEvent({
                    name: eventData.name,
                    date: eventData.date,
                    artistId: eventData.artistId || ""
                });
                setArtists(artistsData);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleChange = (e) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/events/${id}`, {
            method: "PUT", // ou PATCH selon l'implémentation de l'API
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(event),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors de la mise à jour de l'événement");
                }
                return res.json();
            })
            .then(() => {
                navigate(`/events/${id}`);
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <h1>Modifier l'événement</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom de l'événement :</label>
                    <input
                        type="text"
                        name="name"
                        value={event.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Date :</label>
                    <input
                        type="date"
                        name="date"
                        value={event.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Artiste :</label>
                    <select
                        name="artistId"
                        value={event.artistId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Sélectionner un artiste
                        </option>
                        {artists.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                                {artist.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Sauvegarder
                </button>
                <button type="button" className="btn" onClick={() => navigate(-1)}>
                    Annuler
                </button>
            </form>
        </div>
    );
}

export default EditEvent;
