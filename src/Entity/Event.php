<?php

namespace App\Entity;

use App\Repository\EventRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EventRepository::class)]
class Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(inversedBy: 'createdEvents')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creator = null;

    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'attendedEvents')]
    private Collection $attendees;

    #[ORM\ManyToOne(targetEntity: Artiste::class, inversedBy: 'events')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Artiste $artiste = null;


    public function __construct()
    {
        $this->attendees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;
        if ($creator !== null) {
            $this->addAttendee($creator);
        }
        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getAttendees(): Collection
    {
        return $this->attendees;
    }

    public function addAttendee(User $user): static
    {
        if (!$this->attendees->contains($user)) {
            $this->attendees->add($user);
            $user->addAttendedEvent($this);
        }
        return $this;
    }

    public function removeAttendee(User $user): static
    {
        if ($this->attendees->removeElement($user)) {
            $user->removeAttendedEvent($this);
        }
        return $this;
    }

    public function getArtiste(): ?Artiste
    {
        return $this->artiste;
    }

    public function setArtiste(?Artiste $artiste): static
    {
        $this->artiste = $artiste;
        return $this;
    }
}
