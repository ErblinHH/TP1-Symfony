import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Fichier CSS externe

const HomePage = () => {
    // Simuler un utilisateur connecté (à remplacer par un vrai système d'authentification)
    const user = {
        email: "user@example.com",
        roles: ["ROLE_ADMIN"] // Change selon le rôle de l'utilisateur
    };

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

                    <Link to="/logout" className="btn logout">Déconnexion</Link>
                </div>
            ) : (
                <Link to="/login" className="btn">Connexion</Link>
            )}
        </div>
    );
};

export default HomePage;
