'use client';
import useFetch from './useFetch';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const FetchDataComponent = () => {
  const { data, loading, error } = useFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos');

  if (loading) {
    return <div className="p-4 text-center">Loading todos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Todos</h2>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id} className="p-2 border-b border-gray-200">{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchDataComponent;
