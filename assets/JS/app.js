import React from 'react';
import ReactDOM from 'react-dom';
import EventFilter from './component/EventFilter';
const eventDataElement = document.getElementById("event-filter");

console.log("Test : React s'exécute !");
console.log("Element trouvé ?", eventDataElement);


if (eventDataElement) {
    // Récupérer le contenu brut en string
    const rawData = eventDataElement.dataset.events;

    console.log("Données brutes (string) :", rawData);

    // Vérifier que la chaîne est bien formatée avant de parser
    if (rawData && rawData.trim().length > 0) {
        try {
            const events = JSON.parse(rawData); // Convertir en objet JS
            console.log("Données parsées (objet JS) :", events);
            ReactDOM.render(<EventFilter events={events} />, eventDataElement);
        } catch (error) {
            console.error("Erreur lors du parsing JSON :", error);
        }
    } else {
        console.error("Erreur : Les données récupérées sont vides ou mal formatées.");
    }
}
