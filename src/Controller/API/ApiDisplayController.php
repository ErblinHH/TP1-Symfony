<?php

namespace App\Controller\API;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Routing\Annotation\Route;

final class ApiDisplayController extends AbstractController
{

    #[Route('/artists', name: 'app_api_display_artists')]
    public function index(HttpClientInterface $client): Response
    {
        try {
            $response = $client->request('GET', 'http://localhost:8000/api/artists');
        } catch (TransportExceptionInterface $e) {
            return $this->json(['error' => 'Request timeout or server error'], Response::HTTP_GATEWAY_TIMEOUT);
        }

        $jsonData = $response->toArray();

        return $this->render('api_display/index.html.twig', [
            'artists' => $jsonData,
        ]);
    }
}
