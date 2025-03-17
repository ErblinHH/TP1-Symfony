<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ArtistsController extends AbstractController
{
    #[Route('/artists', name: 'app_artists')]
    public function getArtists(): Response
    {
        return $this->render('base.html.twig', [
            'page' => 'artists',
        ]);
    }

    #[Route('/artists/{id}', name: 'app_artists_id')]
    public function getOneArtists(int $id): Response
    {
        return $this->render('artists/index.html.twig', [
            'page' => 'artists',
            'id' => $id,
        ]);
    }
}
