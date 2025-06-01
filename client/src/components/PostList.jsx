import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostForm from './PostForm';
import CommentSection from './CommentSection';

function PostList({ setEditingPost, setShowForm, refreshPostsTrigger }) {
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
      await fetchLikeCounts(res.data); // Fetch likes in parallel
    } catch (err) {
      setError('Failed to load posts');
    }
  };

  // Get total like counts for all posts
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
    } catch {
      console.error('Failed to fetch like counts');
    }
  };

  // Find which posts the current user liked
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
    } catch {
      console.error('Failed to fetch user liked posts');
    }
  };

  // Like/unlike toggle
  const handleLikeToggle = async (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    try {
      await axios.post('/likes', { postId }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
    } catch {
      // Rollback on failure
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      alert('Failed to toggle like');
    }

    try {
      const res = await axios.get(`/likes/${postId}`);
      setLikesByPostId(prev => ({
        ...prev,
        [postId]: res.data.totalLikes
      }));
    } catch {
      console.warn('Failed to refresh like count');
    }
  };

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      fetchPosts();
      fetchUserLikedPosts();
    } catch {
      alert('Delete failed');
    }
  };

  // Fetch posts and liked posts on load or when refresh trigger changes
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
          {/* Image preview section */}
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

            {/* Three-dot menu for owner or admin */}
            {(auth.token && (auth.userId === post.user_id || auth.isAdmin)) && (
              <div className="post-menu">
                <button
                  className="btn btn-sm dropdown-toggle"
                  type="button"
                  onClick={() =>
                    setActiveDropdown(prev => (prev === post.id ? null : post.id))
                  }
                ></button>

                {activeDropdown === post.id && (
                  <div className="dropdown-menu show">
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
                )}
              </div>
            )}
          </div>

          <div className="card-body">
            {/* Edit form or post content */}
            {editingPostId === post.id ? (
              <PostForm
                editingPost={post}
                onSuccess={() => {
                  setEditingPost(null);
                  setShowForm(false);
                  setEditingPostId(null);
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

            {/* Like and comment actions */}
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

          {/* Comment section for each post */}
          <CommentSection
            postId={post.id}
            showInput={activeCommentInput === post.id}
          />
        </div>
      ))}

      {/* Full image preview modal */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Full view" />
        </div>
      )}
    </div>
  );
}

export default PostList;
