<?php

namespace App\Controller\API;

use App\Entity\Artiste;
use App\Entity\User;
use App\Entity\Event;

use App\Repository\ArtisteRepository;
use App\Repository\EventRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

#[AsController]
final class ApiController extends AbstractController
{
    // DOC API
    #[Route('/api/doc', name: 'api_doc')]
    public function index(): Response
    {
        return $this->render('api/index.html.twig', [
            'swagger_url' => '/swagger.json',
        ]);
    }


// LOGIN API
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, JWTTokenManagerInterface $jwtManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse {
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
    public function register(Request $request, EntityManagerInterface $em, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse {
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

    // USER API
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

    // ARTISTS API
    #[Route('/api/artists', name: 'app_api_artists', methods: ['GET'])]
    public function getArtists(Request $request, ArtisteRepository $artisteRepository): JsonResponse
    {
        $name = $request->query->get('name'); // Récupère le paramètre GET "name"

        if ($name) {
            $artists = $artisteRepository->createQueryBuilder('a')
                ->where('LOWER(a.name) LIKE LOWER(:name)')
                ->setParameter('name', '%' . $name . '%')
                ->getQuery()
                ->getResult();
        } else {
            $artists = $artisteRepository->findAll();
        }

        $data = array_map(fn($artist) => [
            'id' => $artist->getId(),
            'name' => $artist->getName(),
            'description' => $artist->getDescription(),
            'imagePath' => $artist->getImagePath()
        ], $artists);

        return $this->json($data);
    }

    #[Route('/api/artists/create', name: 'app_api_create_artist', methods: ['POST'])]
    public function createArtist(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        // Vérifier si l'utilisateur est admin
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer les données du formulaire
        $name = $request->request->get('name');
        $description = $request->request->get('description');

        if (!$name || !$description) {
            return new JsonResponse(['error' => 'Name and description are required'], Response::HTTP_BAD_REQUEST);
        }

        $artist = new Artiste();
        $artist->setName($name);
        $artist->setDescription($description);

        // Gérer l'upload de l'image
        $file = $request->files->get('image');
        if ($file) {
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/artistImage';
            $newFilename = uniqid() . '.' . $file->guessExtension();

            try {
                $file->move($uploadDir, $newFilename);
                $artist->setImagePath('/artistImage/' . $newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Could not save the image: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        $em->persist($artist);
        $em->flush();

        return $this->json([
            'id' => $artist->getId(),
            'name' => $artist->getName(),
            'description' => $artist->getDescription(),
            'imagePath' => $artist->getImagePath(),
        ], Response::HTTP_CREATED);
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

    #[Route('/api/artists/{id}', name: 'app_api_artist_update', methods: ['POST'])]
    public function updateArtist(int $id, Request $request, ArtisteRepository $artisteRepository, EntityManagerInterface $em): JsonResponse {
        $user = $this->getUser();

        // Vérifier si l'utilisateur est admin
        if (!$user || !in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $artist = $artisteRepository->find($id);
        if (!$artist) {
            return new JsonResponse(['error' => 'Artist not found'], Response::HTTP_NOT_FOUND);
        }

        // Récupération des données depuis le FormData
        $data = $request->request->all();
        $updatedData = [
            'name' => $data['name'] ?? $artist->getName(),
            'description' => $data['description'] ?? $artist->getDescription(),
            'imagePath' => $artist->getImagePath(),
            'imageType' => null,
            'uploadedFileName' => null,
        ];

        if (isset($data['name'])) {
            $artist->setName($data['name']);
        }
        if (isset($data['description'])) {
            $artist->setDescription($data['description']);
        }

        $file = $request->files->get('image');
        if ($file) {
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/artistImage';
            $newFilename = uniqid() . '.' . $file->guessExtension();
            $targetPath = $uploadDir . '/' . $newFilename;

            $mimeType = $file->getMimeType();

            try {
                $file->move($uploadDir, $newFilename);

                if (!file_exists($targetPath)) {
                    return new JsonResponse(['error' => 'Fichier introuvable après l\'upload'], Response::HTTP_INTERNAL_SERVER_ERROR);
                }

                $updatedData['imagePath'] = '/artistImage/' . $newFilename;
                $updatedData['imageType'] = $mimeType;
                $updatedData['uploadedFileName'] = $file->getClientOriginalName();

                $artist->setImagePath('/artistImage/' . $newFilename);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Could not save the image: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }


        $em->persist($artist);
        $em->flush();

        return new JsonResponse($updatedData);
    }

    // EVENTS API
    #[Route('/api/events', name: 'app_api_events', methods: ['GET'])]
    public function getEvents(Request $request, EventRepository $eventRepository): JsonResponse
    {
        $date = $request->query->get('date');

        if ($date) {
            $events = $eventRepository->findBy(['date' => new \DateTime($date)]);
        } else {
            $events = $eventRepository->findAll();
        }

        $data = [];

        foreach ($events as $event) {
            $createdBy = $event->getCreator();
            $artist = $event->getArtiste();  // Récupère l'artiste associé
            $data[] = [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'date' => $event->getDate()->format('Y-m-d'),
                'artistName' => $artist ? $artist->getName() : 'N/A',
                'createdBy' => $createdBy ? [
                    'id' => $createdBy->getId(),
                    'email' => $createdBy->getEmail()
                ] : null
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/events/{id}/signup', name: 'app_api_event_signup', methods: ['POST'])]
    public function signupEvent(int $id, Request $request, EventRepository $eventRepository, EntityManagerInterface $em): JsonResponse {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'évènement
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est déjà inscrit
        if ($event->getAttendees()->contains($user)) {
            return new JsonResponse(['message' => 'User already registered'], Response::HTTP_OK);
        }

        // Inscrire l'utilisateur à l'évènement
        $event->addAttendee($user);
        $em->persist($event);
        $em->flush();

        // Récupérer la liste des utilisateurs inscrits
        $attendees = $event->getAttendees()->map(function($u) {
            return [
                'id' => $u->getId(),
                'username' => $u->getEmail()
            ];
        })->toArray();

        return new JsonResponse([
            'message' => 'User registered successfully',
            'users' => $attendees
        ], Response::HTTP_OK);
    }

    #[Route('/api/events/{id}/unsubscribe', name: 'app_api_event_unsubscribe', methods: ['POST'])]
    public function unsubscribeEvent(int $id, Request $request, EventRepository $eventRepository, EntityManagerInterface $em): JsonResponse {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'évènement
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est inscrit
        if (!$event->getAttendees()->contains($user)) {
            return new JsonResponse(['message' => 'User is not registered for this event'], Response::HTTP_OK);
        }

        // Désinscrire l'utilisateur de l'évènement
        $event->removeAttendee($user);
        $em->persist($event);
        $em->flush();


        $attendees = $event->getAttendees()->map(function($u) {
            return [
                'id' => $u->getId(),
                'email' => $u->getEmail()
            ];
        })->toArray();

        return new JsonResponse([
            'message' => 'User unsubscribed successfully',
            'users' => $attendees
        ], Response::HTTP_OK);
    }

    #[Route('/api/events/create', name: 'app_api_create_event', methods: ['POST'])]
    public function createEvent(Request $request, EntityManagerInterface $em, ArtisteRepository $artisteRepository): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Récupérer les données envoyées dans la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier que les données essentielles sont présentes
        $name = $data['name'] ?? null;
        $date = $data['date'] ?? null;
        $artistId = $data['artistId'] ?? null; // On attend l'ID de l'artiste

        if (!$name || !$date) {
            return new JsonResponse(['error' => 'Event name and date are required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Créer un nouvel événement
        $event = new Event();
        $event->setName($name);
        $event->setDate(new \DateTime($date));
        $event->setCreator($user); // L'utilisateur connecté est le créateur

        // Vérifier s'il y a un artiste associé
        if ($artistId) {
            $artist = $artisteRepository->find($artistId);
            if (!$artist) {
                return new JsonResponse(['error' => 'Artist not found'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $event->setArtiste($artist);
        }

        // Enregistrer l'événement en base de données
        $em->persist($event);
        $em->flush();

        // Retourner la réponse JSON avec l'événement créé
        return new JsonResponse([
            'message' => 'Event created successfully',
            'event' => [
                'id' => $event->getId(),
                'name' => $event->getName(),
                'date' => $event->getDate()->format('Y-m-d'),
                'artistName' => $artist ? $artist->getName() : null,
                'createdBy' => [
                    'id' => $user->getUserIdentifier(),
                    'email' => $user->getEmail(),
                ],
            ]
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/events/{id}', name: 'app_api_delete_event', methods: ['DELETE'])]
    public function deleteEvent(int $id, EventRepository $eventRepository, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Récupérer l'événement
        $event = $eventRepository->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est admin ou le créateur de l'événement
        if (!in_array('ROLE_ADMIN', $user->getRoles()) && $event->getCreator() !== $user) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        // Supprimer l'événement
        $em->remove($event);
        $em->flush();

        return new JsonResponse(['message' => 'Event deleted successfully'], Response::HTTP_OK);
    }

    #[Route('/api/events/{id}', name: 'app_api_event_detail', methods: ['GET'])]
    public function getEvent(int $id, EventRepository $eventRepository): JsonResponse
    {
        $event = $eventRepository->find($id);

        if (!$event) {
            return $this->json(['message' => 'Event not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $createdBy = $event->getCreator();
        $users = $event->getAttendees()->map(fn ($user) => [
            'id' => $user->getId(),
            'email' => $user->getEmail()
        ])->toArray();

        $data = [
            'id' => $event->getId(),
            'name' => $event->getName(),
            'date' => $event->getDate()?->format('Y-m-d'),
            'artistName' => $event->getArtiste()?->getName(),
            'createdBy' => $createdBy ? [
                'id' => $createdBy->getId(),
                'email' => $createdBy->getEmail()
            ] : null,
            'users' => $users
        ];

        return $this->json($data);
    }
}
