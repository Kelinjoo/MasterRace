import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm'; // Used for inline edit form

function PostList({ setEditingPost, setShowForm }) {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null); // Tracks open dropdown
  const [editingPostId, setEditingPostId] = useState(null);   // Tracks post being edited
  const [previewImage, setPreviewImage] = useState(null);     // For image modal

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
        <div className="post-card position-relative" key={post.id}>
          
          {/* Image container that includes image + dropdown */}
          <div className="image-container position-relative">
            {/* Image always rendered first */}
            {post.image_url && (
              <img
                src={post.image_url}
                className="card-img-top"
                alt="post"
                onClick={() => setPreviewImage(post.image_url)}
                style={{ cursor: 'pointer' }}
              />
            )}
  
            {/* Dropdown menu absolutely positioned after image */}
            {(auth.token && (auth.userId === post.user_id || auth.isAdmin)) ? (
              <div className="post-menu">
                <button
                  className="btn btn-sm dropdown-toggle"
                  type="button"
                  style={{
                    border: '1px solid white',
                    color: 'white',
                    backgroundColor: 'black',
                    borderRadius: '10px',
                    padding: '4px 8px',
                    fontSize: '1.3rem',
                    lineHeight: '1'
                  }}
                  onClick={() =>
                    setActiveDropdown(prev => (prev === post.id ? null : post.id))
                  }
                >
                  ⋮
                </button>
  
                {/* Conditionally render dropdown menu without causing layout shift */}
                {activeDropdown === post.id ? (
                  <div
                    className="dropdown-menu show"
                    style={{ position: 'absolute', top: '38px', left: '0' }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setEditingPostId(post.id);
                        setActiveDropdown(null);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        handleDelete(post.id);
                        setActiveDropdown(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null} {/* This explicit null fixes the "0" bug */}
          </div>
  
          <div className="card-body">
            {/* Display content or inline edit form */}
            {editingPostId === post.id ? (
              <PostForm
                editingPost={post}
                onSuccess={() => {
                  setEditingPostId(null);
                  fetchPosts();
                }}
                onCancel={() => setEditingPostId(null)}
              />
            ) : (
              <div className="post-content">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
              </div>
            )}
          </div>
        </div>
      ))}
  
      {/* Image preview modal */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Full view" />
        </div>
      )}
    </div>
  );
  
}

export default PostList;
