<?php

namespace App\Controller;

use App\Entity\Event;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class EventController extends AbstractController
{
    #[Route('/event', name: 'app_event')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Récupérer la liste des événements
        $events = $this->getEventList($entityManager);

        return $this->render('event/event.html.twig', [
            'events' => $events,
        ]);
    }

    private function getEventList(EntityManagerInterface $entityManager): array
    {
        return $entityManager->getRepository(Event::class)->createQueryBuilder('e')
            ->select('e.id, e.name, e.date, a.name as artist_name, u.email as creator_email')
            ->leftJoin('e.artiste', 'a')
            ->leftJoin('e.creator', 'u')
            ->getQuery()
            ->getResult();
    }

    #[Route('/event/{id}', name: 'app_event_by_id')]
    public function getEventById(EntityManagerInterface $entityManager, int $id): Response
    {
        $event = $entityManager->getRepository(Event::class)->createQueryBuilder('e')
            ->select('e.id, e.name, e.date, a.name as artist_name, u.email as creator_email')
            ->leftJoin('e.artiste', 'a')
            ->leftJoin('e.creator', 'u')
            ->where('e.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$event) {
            return $this->json(['error' => 'Événement non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($event);
    }
}
