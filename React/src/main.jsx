import React from 'react';
import ReactDOM from 'react-dom/client'; // ⚠️ Utiliser "react-dom/client" dans React 18
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
