<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ArtistController extends AbstractController
{
    #[Route('/artist', name: 'app_artist')]
    public function index(): Response
    {
        return $this->render('artist/artist.html.twig', [
            'controller_name' => 'ArtistController',
        ]);
    }
}
