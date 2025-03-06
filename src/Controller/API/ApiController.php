<?php

namespace App\Controller\API;

use App\Repository\ArtisteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ApiController extends AbstractController
{
    #[Route('/api/doc', name: 'app_api_doc')]
    public function apiDoc(): Response
    {
        return $this->render('api/index.html.twig');
    }

    #[Route('/api/artists', name: 'app_api_artists', methods: ['GET'])]
    public  function  getArtists(ArtisteRepository $artisteRepository): JsonResponse
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
}
