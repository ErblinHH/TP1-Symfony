<?php

namespace App\Controller\API;

use App\Repository\ArtisteRepository;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; // Utilisation de l'interface adaptée
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[AsController]
final class ApiController extends AbstractController
{
    #[Route('/api/doc', name: 'api_doc')]
    public function index(): Response
    {
        return $this->render('api/index.html.twig', [
            'swagger_url' => '/swagger.json',
        ]);
    }

    #[Route('/api/artists', name: 'app_api_artists', methods: ['GET'])]
    public function getArtists(ArtisteRepository $artisteRepository): JsonResponse
    {
        $artists = $artisteRepository->findAll();
        $data = [];

        foreach ($artists as $artist) {
            $data[] = [
                'id' => $artist->getId(),
                'name' => $artist->getName(),
                'description' => $artist->getDescription(),
                'imagePath' => $artist->getImagePath()
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/artists/{id}', name: 'app_api_artist', methods: ['GET'])]
    public function getArtist(int $id, ArtisteRepository $artisteRepository): JsonResponse
    {
        $artist = $artisteRepository->find($id);

        if (!$artist) {
            return $this->json(['error' => 'Artist not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $artist->getId(),
            'name' => $artist->getName(),
            'description' => $artist->getDescription(),
            'imagePath' => $artist->getImagePath()
        ];

        return $this->json($data);
    }

    #[Route('/api/events', name: 'app_api_events', methods: ['GET'])]
    public function getEvents(EventRepository $eventRepository): JsonResponse
    {
        $events = $eventRepository->findAll();
        $data = [];

        foreach ($events as $event) {
            $createdBy = $event->getCreator();
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

        return $this->json($data);
    }

    #[Route('/api/events/{id}', name: 'app_api_event_detail', methods: ['GET'])]
    public function getEvent(int $id, EventRepository $eventRepository): JsonResponse
    {
        $event = $eventRepository->find($id);

        if (!$event) {
            return $this->json(['message' => 'Event not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $createdBy = $event->getIdUser();
        $users = $event->getUsers()->map(fn ($user) => [
            'id' => $user->getId(),
            'username' => $user->getUsername()
        ])->toArray();

        $data = [
            'id' => $event->getId(),
            'name' => $event->getName(),
            'date' => $event->getDate()?->format('Y-m-d\TH:i:s.u\Z'),
            'artistId' => $event->getArtiste()?->getId(),
            'createdBy' => $createdBy ? [
                'id' => $createdBy->getId(),
                'username' => $createdBy->getUsername()
            ] : null,
            'users' => $users
        ];

        return $this->json($data);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        JWTTokenManagerInterface $jwtManager,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        // Récupération des données envoyées par la requête POST
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        // Pour débogage (à enlever en production)
        dump($email, $password);

        // Recherche de l'utilisateur par email
        $user = $userRepository->findOneByEmail($email);

        if (!$user) {
            return new JsonResponse(['error' => 'User does not exist'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Vérification du mot de passe
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Génération du JWT token pour l'utilisateur
        $token = $jwtManager->create($user);

        return new JsonResponse(['token' => $token]);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }

}
