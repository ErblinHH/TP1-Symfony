<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crée un compte administrateur.',
)]
class CreateAdminAccountCommand extends Command
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $admin = new User();
        $admin->setEmail('admin@example.com'); // ou votre email désiré
        $admin->setRoles(['ROLE_ADMIN']);

        $encodedPassword = $this->passwordHasher->hashPassword($admin, 'admin');
        $admin->setPassword($encodedPassword);

        $this->entityManager->persist($admin);
        $this->entityManager->flush();

        $output->writeln('Compte admin créé avec succès !');

        return Command::SUCCESS;
    }
}
