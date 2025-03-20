import { useState, useEffect } from 'react';
import './Artists.css';

function Artists() {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/artists')
            .then((res) => res.json())
            .then((data) => setArtists(data))
            .catch((error) => console.error("Erreur lors de la récupération des artistes :", error));
    }, []);

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