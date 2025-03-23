import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Artists.css';
import { Link } from 'react-router-dom';


    function Artists() {
    const [artists, setArtists] = useState([]);
    const [user, setUser] = useState(null); // Pour stocker les informations de l'utilisateur
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Faire la requête vers l'endpoint /api/me pour récupérer les infos de l'utilisateur
        fetch('http://127.0.0.1:8000/api/me', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération des informations de l'utilisateur");
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
                navigate("/login");
            });

        // Faire la requête vers l'endpoint /api/artists pour récupérer la liste des artistes
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
                navigate("/login");
            });

    }, [navigate]);

    if (!user) return <p>Chargement des données utilisateur...</p>; // Si les données utilisateur ne sont pas encore chargées

    const isAdmin = user.roles && user.roles.includes("ROLE_ADMIN");

    return (
        <div className="container">
            <h1>🎨 Liste des Artistes 🎨</h1>

            {/* Vérifier si l'utilisateur est admin */}
            {isAdmin && (
                <div className="actions">
                    <button
                        onClick={() => navigate("/artists/create")}
                        className="btn btn-create"
                    >
                        Rajouter un artiste
                    </button>
                </div>
            )}

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

                                {/* Afficher le bouton "Modifier" uniquement si l'utilisateur est admin */}
                                {isAdmin && (
                                    <Link to={`/artist/${artist.id}/edit`} className="btn btn-small">Edit</Link>
                                )}
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
