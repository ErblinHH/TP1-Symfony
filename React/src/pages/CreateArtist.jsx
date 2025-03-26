import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateArtist.css";

function CreateArtist() {
    console.log("CreateArtist.jsx: CreateArtist()");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null); // Fichier image sélectionné
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch("http://127.0.0.1:8000/api/me", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data || !data.roles.includes("ROLE_ADMIN")) {
                    navigate("/artists");
                }
            })
            .catch(() => navigate("/artists"));
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name || !description) {
            setError("Tous les champs sont obligatoires !");
            return;
        }

        const token = localStorage.getItem("authToken");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/artists/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création de l'artiste");
            }

            setSuccess("Artiste créé avec succès !");
            setTimeout(() => navigate("/artists"), 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="create-artist-container">
            <h1>🎤 Ajouter un artiste</h1>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <form onSubmit={handleSubmit} className="create-artist-form">
                <label>Nom de l'artiste :</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Description :</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>

                <label>Image :</label>
                <input
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                        }
                    }}
                />

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

                <button type="submit" className="btn">Créer</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/artists")}>
                    Annuler
                </button>
            </form>
        </div>
    );
}

export default CreateArtist;
