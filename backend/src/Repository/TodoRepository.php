<?php

namespace App\Repository;

use App\Entity\Todo;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Todo|null find($id, $lockMode = null, $lockVersion = null)
 * @method Todo|null findOneBy(array $criteria, array $orderBy = null)
 * @method Todo[]    findAll()
 * @method Todo[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TodoRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $manager;

    public function __construct(
        ManagerRegistry $registry,
        EntityManagerInterface $manager
    )
    {
        $this->manager = $manager;
        parent::__construct($registry, Todo::class);
    }

    public function getTodos()
    {
        $query = $this->manager->createQuery('SELECT t FROM App\Entity\Todo t
            WHERE t.parent IS NULL');

        return $query->getResult();
    }

    public function deleteTodo(Todo $todo)
    {
        $this->manager->remove($todo);
        $this->manager->flush();
    }

    public function updateTodo(Todo $todo, bool $status)
    {
        $this->manager->find('App\Entity\Todo', $todo->getId());
        $todo->setIsCompleted($status);
        $this->manager->flush();
    }

    /**
     * @param int $parent
     * @param string $title
     * @return object
     */
    public function createChildren(int $parent, string $title): object
    {
        $parentTodo = $this->manager->find('App\Entity\Todo', $parent);

        $childTodo = new Todo();
        $childTodo->setTitle($title);
        $childTodo->setParent($parentTodo);
        $this->manager->persist($childTodo);
        $this->manager->flush();

        return $childTodo;
    }
}
