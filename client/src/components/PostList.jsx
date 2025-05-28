import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PostList({ setEditingPost, setShowForm }) {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchPosts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="post-list-vertical">
      {error && <div className="alert alert-danger">{error}</div>}

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          {post.image_url && (
            <img
              src={post.image_url}
              className="card-img-top"
              alt="build"
            />
          )}

          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.description}</p>
          </div>

          {(auth.userId === post.user_id || auth.isAdmin) && (
            <div className="card-footer">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setEditingPost(post);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;
