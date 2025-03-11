<?php
namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmtiType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CreateArtistForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
        ->add('name', TextType::class,
         [ 'label' => 'Artist name', 
         'required' =>true,])

         ->add('description', TextType::class, [
            'label' => 'Description',
            'required' => false,
        ])

        // ->add('imagePath', TextType::class, [
        //     'label' => 'IMG URL',
        //     'required' => false,
        // ])

        ->add('submit', SubmitType::class, [
            'label' => 'Create the artist',
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Artiste::class,
        ]);
    }
}
