import type { ITodo } from 'src/domain/todo';

const API_URL = 'https://3nio1igy4g.execute-api.eu-west-2.amazonaws.com';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error (${response.status}): ${error}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchTodos(): Promise<ITodo[]> {
  const response = await fetch(`${API_URL}/todos`);
  return handleResponse<ITodo[]>(response);
}

export async function createTodo(todo: ITodo): Promise<ITodo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return handleResponse<ITodo>(response);
}

export async function updateTodo(
  id: string,
  fields: Partial<Pick<ITodo, 'title' | 'completed'>>,
): Promise<ITodo> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  return handleResponse<ITodo>(response);
}

export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error (${response.status}): ${error}`);
  }
}
