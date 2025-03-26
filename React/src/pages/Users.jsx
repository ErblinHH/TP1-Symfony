import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Récupérer le token JWT depuis le localStorage
        const token = localStorage.getItem("authToken");

        // Si aucun token, rediriger vers la page de connexion
        if (!token) {
            navigate("/login");
            return;
        }

        // Faire la requête vers l'endpoint /api/users en incluant le token
        fetch('http://127.0.0.1:8000/api/users', {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Utilisateur non authentifié");
                }
                return res.json();
            })
            .then((data) => setUsers(data))
            .catch((error) => {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
                navigate("/login"); // Redirection en cas d'erreur d'authentification
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container">
            <h1>👥 Liste des utilisateurs 👥</h1>

            {users.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Rôles</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.roles.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun utilisateur trouvé.</p>
            )}

            <a href="/" className="btn">Retour à l'accueil</a>
        </div>
    );
}

export default Users;
