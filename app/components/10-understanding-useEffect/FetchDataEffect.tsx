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
    <div className="p-4 border border-gray-300 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-2">Fetch Data Effect</h2>
      {post ? <p className="mt-2 font-medium">First post title: {post.title}</p> : <p className="mt-2">Loading...</p>}
    </div>
  );
};

export default FetchDataEffect;
