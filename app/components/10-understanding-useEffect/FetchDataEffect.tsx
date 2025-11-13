'use client';
import { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const FetchDataEffect = () => {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-2xl w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-6 md:p-8 shadow-[var(--shadow-md)]">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-6 center-text">
          Fetch Data Effect
        </h2>
        {post ? (
          <div className="p-4 bg-[var(--muted)] rounded-[var(--radius)]">
            <p className="text-lg font-semibold text-[var(--foreground)] center-text">
              First post title: {post.title}
            </p>
          </div>
        ) : (
          <p className="text-lg text-[var(--muted-foreground)] center-text">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default FetchDataEffect;
