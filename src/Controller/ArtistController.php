<?php
namespace App\Controller;
use App\Entity\Artiste;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ArtistController extends AbstractController
{
    #[Route('/artist', name: 'app_artist')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Récupérer la liste des artistes avec leurs informations
        $artists = $this->getArtistList($entityManager);

        return $this->render('artist/artist.html.twig', [
            'artists' => $artists,
        ]);
    }

    private function getArtistList(EntityManagerInterface $entityManager): array
    {
        return $entityManager->getRepository(Artiste::class)->createQueryBuilder('a')
            ->select('a.id, a.name, a.description, a.imagePath') // Correction de `image_path` -> `imagePath`
            ->getQuery()
            ->getResult();
    }

    #[Route('/artist/{id}', name: 'app_artist_by_id')]
    public function getArtisteById(EntityManagerInterface $entityManager, int $id): Response
    {
        $artiste = $entityManager->getRepository(Artiste::class)->createQueryBuilder('a')
            ->select('a.id, a.name, a.description, a.imagePath')
            ->where('a.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$artiste) {
            return $this->json(['error' => 'Artiste non trouvé'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($artiste);
    }
}

