// Component that fetches and displays a list of community posts
import { useEffect, useState } from 'react';
import axios from '../api/axios';

function PostList() {
  const [posts, setPosts] = useState([]);         // List of posts from API
  const [error, setError] = useState('');         // Error message if fetch fails

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);                       // Store posts on success
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');         // Set error on failure
      }
    };

    fetchPosts();                                 // Run once on mount
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Community Builds</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {posts.map((post) => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card h-100">
              {post.image_url && (
                <img
                  src={post.image_url}
                  className="card-img-top"
                  alt="build"
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
