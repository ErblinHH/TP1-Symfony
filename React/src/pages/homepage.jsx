import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // ❌ Déplace `useNavigate` ici
import "./HomePage.css"; // Ton fichier CSS

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ✅ Déclaration correcte

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/me", { credentials: "include" })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Utilisateur non authentifié");
                }
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => navigate("/login")) // 🚀 Redirige si non connecté
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="homepage">
            <h1>🎧 Bienvenue sur MusicFlow 🎧</h1>
            <p>Le site qui vous connecte à la musique !</p>

            {user ? (
                <div className="user-info">
                    <p>Vous êtes connecté en tant que <strong>{user.email}</strong>.</p>

                    <div className="buttons">
                        {user.roles.includes("ROLE_ADMIN") && (
                            <Link to="/users" className="btn">Liste des utilisateurs</Link>
                        )}
                        <Link to="/events" className="btn">Liste des événements</Link>
                        <Link to="/artists" className="btn">Liste des artistes</Link>
                    </div>

                    <a href="http://127.0.0.1:8000/logout" className="btn logout">Déconnexion</a>
                </div>
            ) : (
                <Link to="/login" className="btn">Connexion</Link>
            )}
        </div>
    );
};

export default HomePage;
