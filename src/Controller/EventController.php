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


}
