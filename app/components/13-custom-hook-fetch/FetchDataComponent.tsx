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
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-lg text-[var(--muted-foreground)] center-text">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-content py-12 px-4">
        <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--secondary)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
          <p className="text-lg text-[var(--secondary)] center-text">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Todos
        </h2>
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {data?.map((todo) => (
            <li 
              key={todo.id} 
              className="p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--muted)] text-[var(--foreground)]"
            >
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FetchDataComponent;
