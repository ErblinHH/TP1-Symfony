import React from 'react';
import ReactDOM from 'react-dom';
import Artists from './components/Artists';


const rootElement = document.getElementById('root');
const pathname = window.location.pathname;  // Récupère le chemin de l'URL
const root = ReactDOM.createRoot(rootElement);

if (pathname === '/artists') {
    root.render(<Artists />);
}



  // Passe l'ID de l'artiste comme prop si nécessaire
