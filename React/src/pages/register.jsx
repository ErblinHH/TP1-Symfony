import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Register.css"; // Crée ou adapte le fichier CSS selon tes besoins

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                // Tente de récupérer le message d'erreur renvoyé par l'API
                const errorData = await response.json();
                throw new Error(errorData.error || "Erreur lors de l'inscription");
            }

            // Si l'inscription est réussie, on redirige vers la page de login ou d'accueil
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <h1>Inscription</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email :</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Mot de passe :</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn">
                    S'inscrire
                </button>
            </form>
            <p>
                Déjà inscrit ? <a href="/login">Connecte-toi ici</a>.
            </p>
        </div>
    );
};

export default Register;
