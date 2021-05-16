<?php

namespace App\Controller;

use App\Entity\Todo;
use App\Repository\TodoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class TodoChildrenController extends AbstractController
{
    private TodoRepository $todoRepository;

    public function __construct(TodoRepository $repository)
    {
        $this->todoRepository = $repository;
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $parent = $request->get('parent_id');
        $title = $request->get('title');
        $todo = $this->todoRepository->createChildren($parent, $title);

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
}
