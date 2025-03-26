
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/HomePage.css";

const Homepage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken"); // Vérifier si un token existe
    const [user, setUser] = useState(null);

    // Si un token est présent, essayer de récupérer les infos de l'utilisateur
    if (token && !user) {
        fetch("http://127.0.0.1:8000/api/me", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }

    return (
        <div className="homepage">
            <h1>🎧 Bienvenue sur Wishify🎧</h1>
            <p>Le site qui vous connecte à la musique !</p>

            <div className="buttons">
                <Link to="/events" className="btn">
                    Liste des événements
                </Link>
                <Link to="/artists" className="btn">
                    Liste des artistes
                </Link>

                {/* Afficher le bouton Admin uniquement si l'utilisateur est un admin */}
                {user?.roles?.includes("ROLE_ADMIN") && (
                    <Link to="/users" className="btn">
                        Liste des utilisateurs
                    </Link>
                )}
            </div>

            {/* Afficher le bouton Connexion/Déconnexion en fonction de l'état de l'utilisateur */}
            {user ? (
                <button
                    onClick={() => {
                        localStorage.removeItem("authToken");
                        setUser(null);
                        navigate("/login");
                    }}
                    className="btn logout"
                >
                    Déconnexion
                </button>
            ) : (
                <Link to="/login" className="btn">
                    Connexion
                </Link>
            )}
        </div>
    );
};

export default Homepage;
