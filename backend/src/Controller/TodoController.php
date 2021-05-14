<?php

namespace App\Controller;

use App\Entity\Todo;
use App\Repository\TodoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class TodoController extends AbstractController
{
  private TodoRepository $todoRepository;

  public function __construct(TodoRepository $repository)
  {
    $this->todoRepository = $repository;
  }

  /**
   * @return JsonResponse
   */
  public function index(): JsonResponse
  {
    $todos = $this->todoRepository->getTodos();
    return $this->json($todos);
  }

  /**
   * @param Request $request
   * @return JsonResponse
   */
  public function store(Request $request): JsonResponse
  {
    $todo = new Todo();
    $todo->setTitle($request->get('title'));
    $manager = $this->getDoctrine()->getManager();
    $manager->persist($todo);
    $manager->flush();

    return $this->json($todo);
  }

  /**
   * @param Todo $todo
   * @return JsonResponse
   */
  public function delete(Todo $todo): JsonResponse
  {
    $this->todoRepository->deleteTodo($todo);
    return new JsonResponse(Response::HTTP_NO_CONTENT);
  }

  /**
   * @param Todo $todo
   * @param Request $request
   * @return JsonResponse
   */
  public function update(Todo $todo, Request $request): JsonResponse
  {
    $status = $request->get('isCompleted');
    $this->todoRepository->updateTodo($todo, $status);

    return $this->json($todo);
  }

  /**
   * @param Request $request
   * @return int|mixed|string
   */
  public function search(Request $request): mixed
  {
    $term = $request->get('title');
    $todo = $this->todoRepository->searchTodo($term);
    return $this->json($todo);
  }

  public function show(Todo $todo)
  {
    return $this->json($todo);
  }
}
