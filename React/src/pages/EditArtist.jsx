import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CSS/Artists.css";

const EditArtist = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [currentImage, setCurrentImage] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    // Charger les données de l'artiste
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(`http://127.0.0.1:8000/api/artists/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Artiste introuvable");
                }
                return res.json();
            })
            .then((data) => {
                setName(data.name);
                setDescription(data.description);
                setCurrentImage(data.imagePath || "");
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

        if (!token) {
            navigate("/login");
            return;
        }

        // Préparer les données sous forme de FormData pour envoyer le fichier
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/artists/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ContentType: "multipart/form-data",
                },
                body: formData,
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

                <label htmlFor="image">Image :</label>
                <input
                    type="file"
                    id="image"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                        }
                    }}
                />

                {currentImage && !imageFile && (
                    <div>
                        <p>Image actuelle :</p>
                        <img
                            src={`http://localhost:8000${currentImage}`}
                            alt="Current artist"
                            width="100"
                        />
                    </div>
                )}

                {imageFile && (
                    <div>
                        <p>Aperçu de l'image sélectionnée :</p>
                        <img
                            src={URL.createObjectURL(imageFile)}
                            alt="Preview"
                            width="100"
                        />
                    </div>
                )}

                <button type="submit" className="btn">
                    Sauvegarder les modifications
                </button>
            </form>

            <a href="/artists" className="btn back">
                Retour à la liste des artistes
            </a>
        </div>
    );
};

export default EditArtist;
