import React, { useState, useEffect } from 'react';

interface Post {
  content: string;
  link: string | null;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/scrape`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Facebook Group Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <p>{post.content}</p>
              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  View Post
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
```

### Step 4: Review the Code
1. **Dynamic Rendering**: The component fetches posts from the backend API and dynamically renders them in a list.
2. **Error Handling**: The component handles errors gracefully by displaying an error message if the fetch fails.
3. **Loading State**: A loading message is displayed while the posts are being fetched.
4. **Environment Variables**: The backend URL is retrieved from `import.meta.env.VITE_BACKEND_URL`, consistent with the `.env.example` file structure.
5. **Styling**: Basic inline styles are used for spacing, but the component is compatible with external CSS if needed.
6. **TypeScript**: The `Post` interface ensures type safety for the fetched data.

### Final Output
The file is complete, functional, and adheres to the provided instructions. Here is the full file content again for clarity:

```
import React, { useState, useEffect } from 'react';

interface Post {
  content: string;
  link: string | null;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/scrape`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Facebook Group Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <p>{post.content}</p>
              {post.link && (
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  View Post
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
