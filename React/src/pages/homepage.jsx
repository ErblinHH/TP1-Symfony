import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        // Si aucun token n'est présent, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Faire la requête vers l'endpoint /api/me en incluant le token dans l'en-tête
        fetch("http://127.0.0.1:8000/api/me", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Utilisateur non authentifié");
                }
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((error) => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                navigate("/login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="homepage">
            <h1>🎧 Bienvenue sur MusicFlow 🎧</h1>
            <p>Le site qui vous connecte à la musique !</p>

            {user ? (
                <div className="user-info">
                    <p>
                        Vous êtes connecté en tant que <strong>{user.email}</strong>.
                    </p>

                    <div className="buttons">
                        {/* Afficher le lien vers la liste des utilisateurs si l'utilisateur est un admin */}
                        {user.roles && user.roles.includes("ROLE_ADMIN") && (
                            <Link to="/users" className="btn">
                                Liste des utilisateurs
                            </Link>
                        )}
                        <Link to="/events" className="btn">
                            Liste des événements
                        </Link>
                        <Link to="/artists" className="btn">
                            Liste des artistes
                        </Link>
                    </div>

                    {/* Bouton de déconnexion */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");  // Supprimer le token
                            navigate("/login");  // Rediriger vers la page de connexion
                        }}
                        className="btn logout"
                    >
                        Déconnexion
                    </button>
                </div>
            ) : (
                <Link to="/login" className="btn">
                    Connexion
                </Link>
            )}
        </div>
    );
};

export default HomePage;
