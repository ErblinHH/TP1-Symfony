<?php
namespace App\Controller;
use App\Entity\Artiste;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class UserController extends AbstractController
{
    #[Route('/user', name: 'app_user')]
    public function index(EntityManagerInterface $entityManager): Response
    {
        // Récupérer la liste des emails des artistes
        $users = $this->getUserList($entityManager);

        return $this->render('user/user.html.twig', [
            'users' => $users,
        ]);
    }

    private function getUserList(EntityManagerInterface $entityManager): array
    {
        // Récupérer uniquement les emails depuis la base de données
        return $entityManager->getRepository(User::class)->createQueryBuilder('a')
            ->select('a.email', 'a.roles')
            ->getQuery()
            ->getResult();
    }

    #[Route('/user/{id}', name: 'app_user_by_id')]
    public function getUserById(EntityManagerInterface $entityManager, int $id): Response
    {
        $artiste = $entityManager->getRepository(Artiste::class)->find($id);

        if (!$artiste) {
            return $this->json(['error' => 'Utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }
        return $this->json($artiste);
    }
}
