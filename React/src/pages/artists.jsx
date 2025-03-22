import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Artists.css';

function Artists() {
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer le token JWT depuis le localStorage
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Faire la requête vers l'endpoint /api/artists en incluant le token dans les headers
        fetch('http://127.0.0.1:8000/api/artists', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des artistes");
                }
                return res.json();
            })
            .then((data) => setArtists(data))
            .catch((error) => {
                console.error("Erreur lors de la récupération des artistes :", error);
                // Optionnel : rediriger vers la page de login si le token est invalide
                navigate("/login");
            });
    }, [navigate]);

    return (
        <div className="container">
            <h1>🎨 Liste des Artistes 🎨</h1>
            {artists.length > 0 ? (
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
                    {artists.map((artist) => (
                        <tr key={artist.id}>
                            <td>{artist.id}</td>
                            <td>{artist.name}</td>
                            <td>{artist.description}</td>
                            <td>
                                {artist.imagePath ? (
                                    <img src={`http://localhost:8000/${artist.imagePath}`} alt={artist.name} width="50" />
                                ) : (
                                    '❌'
                                )}
                            </td>
                            <td>
                                <a href={`/artist/${artist.id}`} className="btn btn-small">👀 Voir</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun artiste trouvé.</p>
            )}
            <a href="/" className="btn">Retour à l'accueil</a>
        </div>
    );
}

export default Artists;
