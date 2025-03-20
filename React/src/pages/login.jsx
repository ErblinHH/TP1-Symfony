import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Fichier CSS pour le style

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // 🚀 Important pour les sessions Symfony
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Email ou mot de passe incorrect");
            }

            navigate("/"); // Redirige vers l'accueil après connexion
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <h1>🔑 Connexion</h1>
            <p>Accédez à votre compte pour gérer vos événements et artistes.</p>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Email :</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Mot de passe :</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="btn">Connexion</button>
            </form>

            <a href="/" className="btn back">Retour à l'accueil</a>
        </div>
    );
};

export default Login;
