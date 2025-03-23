<?php

namespace App\Controller\API;

use App\Entity\User;
use App\Repository\ArtisteRepository;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
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

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $plainPassword = $data['password'] ?? null;

        if (!$email || !$plainPassword) {
            return new JsonResponse(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si un utilisateur avec cet email existe déjà
        if ($userRepository->findOneBy(['email' => $email])) {
            return new JsonResponse(['error' => 'An account with this email already exists'], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($email);
        $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        // ✅ Vérifier s'il s'agit du premier utilisateur inscrit
        $totalUsers = $userRepository->count([]);
        if ($totalUsers === 0) {
            $user->setRoles(['ROLE_ADMIN']); // Premier utilisateur → Admin
        } else {
            $user->setRoles(['ROLE_USER']); // Les autres → Utilisateur normal
        }

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'User registered successfully',
            'roles' => $user->getRoles()
        ], Response::HTTP_CREATED);
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

    #[Route('/api/artists/{id}', name: 'app_api_artist_update', methods: ['PUT'])]
    public function updateArtist(
        int $id,
        Request $request,
        ArtisteRepository $artisteRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse(['error' => 'Unauthorized'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'artiste par son ID
        $artist = $artisteRepository->find($id);
        if (!$artist) {
            return new JsonResponse(['error' => 'Artist not found'], Response::HTTP_NOT_FOUND);
        }

        // Décoder les données envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Mettre à jour les propriétés de l'artiste avec les données envoyées
        if (isset($data['name'])) {
            $artist->setName($data['name']);
        }
        if (isset($data['description'])) {
            $artist->setDescription($data['description']);
        }
        if (isset($data['imagePath'])) {
            $artist->setImagePath($data['imagePath']);
        }

        // Enregistrer les modifications
        $em->persist($artist);
        $em->flush();

        // Retourner les données de l'artiste modifié
        return $this->json([
            'id' => $artist->getId(),
            'name' => $artist->getName(),
            'description' => $artist->getDescription(),
            'imagePath' => $artist->getImagePath(),
        ]);
    }

}
