<?php

namespace App\Controller\API;

use App\Repository\ArtisteRepository;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ApiController extends AbstractController
{
    // Route pour afficher la documentation de l'API (Swagger)
    #[Route('/api/doc', name: 'api_doc')]
    public function index(): Response
    {
        // Rendu de la page HTML pour la documentation Swagger
        return $this->render('api/index.html.twig', [
            'swagger_url' => '/swagger.json', // L'URL pour récupérer la documentation en format JSON
        ]);
    }

    // Route pour récupérer la liste de tous les artistes
    #[Route('/api/artists', name: 'app_api_artists', methods: ['GET'])]
    public function getArtists(ArtisteRepository $artisteRepository): JsonResponse
    {
        // Récupération de tous les artistes de la base de données
        $artists = $artisteRepository->findAll();
        $data = [];

        // Transformation des artistes en tableau de données pour la réponse JSON
        foreach ($artists as $artist) {
            $data[] = [
                'id' => $artist->getId(),
                'name' => $artist->getName(),
                'description' => $artist->getDescription(),
                'imagePath' => $artist->getImagePath()
            ];
        }

        // Retour des données des artistes en format JSON
        return $this->json($data);
    }

    // Route pour récupérer les informations d'un artiste spécifique par son ID
    #[Route('/api/artists/{id}', name: 'app_api_artist', methods: ['GET'])]
    public function getArtist(int $id, ArtisteRepository $artisteRepository): JsonResponse
    {
        // Recherche de l'artiste avec l'ID spécifié
        $artist = $artisteRepository->find($id);

        // Si l'artiste n'est pas trouvé, retour d'une erreur 404
        if (!$artist) {
            return $this->json(['error' => 'Artist not found'], Response::HTTP_NOT_FOUND);
        }

        // Retour des détails de l'artiste en format JSON
        $data = [
            'id' => $artist->getId(),
            'name' => $artist->getName(),
            'description' => $artist->getDescription(),
            'imagePath' => $artist->getImagePath()
        ];

        return $this->json($data);
    }

    // Route pour récupérer la liste de tous les événements
    #[Route('/api/events', name: 'app_api_events', methods: ['GET'])]
    public function getEvents(EventRepository $eventRepository): JsonResponse
    {
        // Récupération de tous les événements de la base de données
        $events = $eventRepository->findAll();
        $data = [];

        // Transformation des événements en tableau de données pour la réponse JSON
        foreach ($events as $event) {
            $createdBy = $event->getCreator(); // Récupération de l'utilisateur ayant créé l'événement

            $data[] = [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'date' => $event->getDate()->format('Y-m-d'),
                'artistId' => $event->getArtiste()->getId(),
                'createdBy' => $createdBy ? [
                    'id' => $createdBy->getId(),
                    'email' => $createdBy->getEmail()
                ] : null
            ];
        }

        // Retour des données des événements en format JSON
        return $this->json($data);
    }

    // Route pour récupérer les détails d'un événement spécifique par son ID
    #[Route('/api/events/{id}', name: 'app_api_event_detail', methods: ['GET'])]
    public function getEvent(int $id, EventRepository $eventRepository, UserRepository $userRepository): JsonResponse
    {
        // Recherche de l'événement avec l'ID spécifié
        $event = $eventRepository->find($id);

        // Si l'événement n'est pas trouvé, retour d'une erreur 404
        if (!$event) {
            return $this->json(['message' => 'Event not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $createdBy = $event->getIdUser(); // Récupération de l'utilisateur ayant créé l'événement

        // Récupération la liste des utilisateurs inscrit à l'événement
        $users = $event->getUsers()->map(fn ($user) => [
            'id' => $user->getId(),
            'username' => $user->getUsername()
        ])->toArray();

        // Retour des détails de l'événement en format JSON
        $data = [
            'id' => $event->getId(),
            'name' => $event->getName(),
            'date' => $event->getDate()?->format('Y-m-d\TH:i:s.u\Z'),
            'artistId' => $event->getArtiste()?->getId(),
            'createdBy' => $createdBy ? [
                'id' => $createdBy->getId(),
                'username' => $createdBy->getUsername()
            ] : null,
            'users' => $users // Liste des utilisateurs inscrit à l'événement
        ];

        return $this->json($data);
    }
    #[Route('/api/users', name: 'api_users', methods: ['GET'])]
    public function getUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        $data = array_map(function ($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }


}
