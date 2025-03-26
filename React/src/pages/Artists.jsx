import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './CSS/Artists.css';
import { Link } from 'react-router-dom';

function Artists() {
    const [artists, setArtists] = useState([]);
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch('http://127.0.0.1:8000/api/me', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => setUser(data))
            .catch(() => navigate("/login"));
    }, [navigate]);

    useEffect(() => {
        fetchArtists();
    }, [search]);

    const fetchArtists = () => {
        const token = localStorage.getItem("authToken");
        const url = search
            ? `http://127.0.0.1:8000/api/artists?name=${encodeURIComponent(search)}`
            : "http://127.0.0.1:8000/api/artists";

        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then(res => res.ok ? res.json() : [])
            .then(data => setArtists(data))
            .catch(error => console.error("Erreur lors de la récupération des artistes :", error));
    };

    if (!user) return <p>Chargement des données utilisateur...</p>;

    const isAdmin = user.roles && user.roles.includes("ROLE_ADMIN");

    return (
        <div className="container">
            <h1>🎨 Liste des Artistes 🎨</h1>

            {/* 🔍 Champ de recherche */}
            <input
                type="text"
                placeholder="Rechercher un artiste..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            {/* affiche Crée un artiste que si on est admin */}
            {isAdmin && (
                <div className="actions">
                    <button onClick={() => navigate("/artists/createArtist")} className="btn btn-create">
                        Rajouter un artiste
                    </button>
                </div>
            )}

            {artists.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {artists.map(artist => (
                        <tr key={artist.id}>
                            <td>{artist.name}</td>
                            <td>{artist.description}</td>
                            <td>
                                {artist.imagePath ? (
                                    <img src={`http://localhost:8000${artist.imagePath}`} alt={artist.name} width="50" />
                                ) : (
                                    '❌'
                                )}
                            </td>
                            <td>
                                {/* affiche le boutton modifier que si on est admin */}

                                {isAdmin && (
                                    <Link to={`/artists/edit/${artist.id}`} className="btn btn-small">Modifier</Link>
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
