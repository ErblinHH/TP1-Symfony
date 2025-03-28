<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomePageController extends AbstractController
{
    #[Route('/homepage', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/homepage.html.twig');

    }

    public function disconnect(): Response
    {

        return $this->render('login/login.html.twig');
    }
}
