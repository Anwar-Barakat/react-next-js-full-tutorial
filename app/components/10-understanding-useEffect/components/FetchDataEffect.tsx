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
      <div className="max-w-2xl w-full themed-card p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 center-text">
          Fetch Data Effect
        </h2>
        {post ? (
          <div className="p-4 themed-card">
            <p className="text-lg font-semibold text-primary center-text">
              First post title: {post.title}
            </p>
          </div>
        ) : (
          <p className="text-lg text-muted-foreground center-text">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default FetchDataEffect;
