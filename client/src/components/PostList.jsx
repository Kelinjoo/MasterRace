import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';

function PostList({ setEditingPost, setShowForm }) {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likesByPostId, setLikesByPostId] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/posts');
      setPosts(res.data);
      await fetchLikeCounts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    }
  };

  const fetchLikeCounts = async (posts) => {
    try {
      const likePromises = posts.map(post =>
        axios.get(`/likes/${post.id}`)
      );
      const results = await Promise.all(likePromises);
      const newLikeMap = {};
      const newLikedMap = {};
      posts.forEach((post, i) => {
        const count = results[i].data.totalLikes;
        newLikeMap[post.id] = count;
        // For now, simulate that the user already liked posts they interact with
        if (count > 0) {
          newLikedMap[post.id] = true;
        }
      });
      setLikesByPostId(newLikeMap);
      setLikedPosts(prev => ({ ...prev, ...newLikedMap }));
    } catch (err) {
      console.error('Failed to fetch like counts');
    }
  };

  const handleLikeToggle = async (postId) => {
    try {
      await axios.post('/likes', { postId }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      const res = await axios.get(`/likes/${postId}`);
      setLikesByPostId(prev => ({
        ...prev,
        [postId]: res.data.totalLikes
      }));

      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    } catch (err) {
      alert('Failed to toggle like');
    }
  };

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

          <div className="image-container position-relative">
            {post.image_url && (
              <img
                src={post.image_url}
                className="card-img-top"
                alt="post"
                onClick={() => setPreviewImage(post.image_url)}
                style={{ cursor: 'pointer' }}
              />
            )}

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
            ) : null}
          </div>

          <div className="card-body">
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
              <>
                <div className="post-content">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                </div>

                {/* Like row moved outside of .post-content */}
                <div className="like-container">
                  <button
                    className={`btn btn-sm like-button ${likedPosts[post.id] ? 'liked' : 'unliked'}`}
                    onClick={() => handleLikeToggle(post.id)}
                    disabled={!auth.token}
                  >
                    ❤️
                  </button>
                  <span className="like-count">{likesByPostId[post.id] || 0}</span>
                </div>

              </>
            )}
          </div>
        </div>
      ))}

      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Full view" />
        </div>
      )}
    </div>
  );
}

export default PostList;
