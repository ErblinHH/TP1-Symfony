import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Artists.css";

const EditArtist = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imagePath, setImagePath] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Récupère l'id de l'artiste à partir de l'URL

    // Charger les données de l'artiste
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Récupérer les données de l'artiste via l'API
        fetch(`http://127.0.0.1:8000/api/artists/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setName(data.name);
                setDescription(data.description);
                setImagePath(data.imagePath || "");
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des données de l'artiste:", error);
                setError("Erreur lors du chargement des données de l'artiste.");
                setLoading(false);
            });
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/artists/${id}/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    description,
                    imagePath,
                }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la modification de l'artiste.");
            }

            navigate("/artists"); // Redirige vers la liste des artistes après la modification
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="edit-artist-page">
            <h1>Modifier l'artiste</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nom de l'artiste :</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="description">Description :</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label htmlFor="imagePath">Image (URL) :</label>
                <input
                    type="text"
                    id="imagePath"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                />

                <button type="submit" className="btn">Sauvegarder les modifications</button>
            </form>

            <a href="/artists" className="btn back">Retour à la liste des artistes</a>
        </div>
    );
};

export default EditArtist;
