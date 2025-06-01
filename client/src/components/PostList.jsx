import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';
import CommentSection from './CommentSection';

function PostList({ setEditingPost, setShowForm, refreshPostsTrigger}) {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likesByPostId, setLikesByPostId] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeCommentInput, setActiveCommentInput] = useState(null);
  

  // Fetch all posts
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

  // Fetch total likes per post
  const fetchLikeCounts = async (posts) => {
    try {
      const likePromises = posts.map(post =>
        axios.get(`/likes/${post.id}`)
      );
      const results = await Promise.all(likePromises);
      const newLikeMap = {};
      posts.forEach((post, i) => {
        newLikeMap[post.id] = results[i].data.totalLikes;
      });
      setLikesByPostId(newLikeMap);
    } catch (err) {
      console.error('Failed to fetch like counts');
    }
  };

  // Fetch which posts the current user has liked
  const fetchUserLikedPosts = async () => {
    try {
      const res = await axios.get('/likes/user-liked', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const likedMap = {};
      res.data.forEach(postId => {
        likedMap[Number(postId)] = true; 
      });
      setLikedPosts(likedMap);

    } catch (err) {
      console.error('Failed to fetch user liked posts');
    }
  };
  
  const handleLikeToggle = async (postId) => {
    // Flip UI state optimistically
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  
    try {
      await axios.post('/likes', { postId }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
    } catch (err) {
      // Rollback like if toggle failed
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId] // reverse again
      }));
      alert('Failed to toggle like');
      return;
    }
  
    // Refresh like count only (not likedPosts again)
    try {
      const res = await axios.get(`/likes/${postId}`);
      setLikesByPostId(prev => ({
        ...prev,
        [postId]: res.data.totalLikes
      }));
    } catch (err) {
      console.warn('Failed to refresh like count');
    }
  };
  
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      fetchPosts();
      fetchUserLikedPosts();
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchPosts();
    if (auth.token) {
      fetchUserLikedPosts();
    }
  }, [refreshPostsTrigger]);

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
                    backgroundColor: '#6C757D',
                    borderRadius: '10px',
                    padding: '4px 8px',
                    fontSize: '1.3rem',
                    lineHeight: '1'
                  }}
                  onClick={() =>
                    setActiveDropdown(prev => (prev === post.id ? null : post.id))
                  }
                >
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
                  setEditingPost(null);
                  setShowForm(false);
                  setEditingPostId(null); // ✅ needed to exit edit mode
                  fetchPosts();       
                }}
                onCancel={() => {
                  setEditingPost(null);
                  setShowForm(false);
                  setEditingPostId(null);
                }}
              />

            ) : (
              <div className="post-content">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
              </div>
            )}

            <div className="post-actions">
              <div className="like-comment-row">
                <button
                  className={`btn btn-sm like-button ${likedPosts[post.id] ? 'liked' : 'unliked'}`}
                  onClick={() => handleLikeToggle(post.id)}
                  disabled={!auth.token}
                >
                  ❤️
                </button>
                <span className="like-count">{likesByPostId[post.id] || 0}</span>

                <button
                  className="btn btn-sm comment-button"
                  onClick={() =>
                    setActiveCommentInput(prev => prev === post.id ? null : post.id)
                  }
                >
                  💬 Comments
                </button>
              </div>
            </div>
          </div>

          <CommentSection
            postId={post.id}
            showInput={activeCommentInput === post.id}
          />
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
