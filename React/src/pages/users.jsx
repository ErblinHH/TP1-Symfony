import { useState, useEffect } from 'react';
import './Artists.css';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/user')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error("Erreur lors de la récupération des utilisateurs :", error));
    }, []);


}

export default Users;
