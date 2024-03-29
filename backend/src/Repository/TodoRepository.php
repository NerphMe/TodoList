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

  /**
   * @return int|mixed|string
   */
  public function getTodos()
  {
    $query = $this->manager->createQuery('SELECT t FROM App\Entity\Todo t
            WHERE t.parent IS NULL');

    return $query->getResult();
  }



    /**
     * @param Todo $todo
     */
    public function deleteTodo(Todo $todo)
    {
        $this->manager->remove($todo);
        $this->manager->flush();
    }

    /**
     * @param Todo $todo
     * @param bool $status
     */
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

    /**
     * @param string $term
     * @return int|mixed|string
     */
    public function searchTodo(string $term)
    {
        return $this->createQueryBuilder('t')
      ->where('t.title LIKE :term')
      ->setParameter('term', '%' . $term . '%')
      ->getQuery()
      ->getResult();
    }


  /**
   * @param string $title
   * @return Todo
   */
    public function createTodo(string $title): Todo
    {
        $todo = new Todo();
        $todo->setTitle($title);
        $this->manager->persist($todo);
        $this->manager->flush();
        return $todo;
    }
}
