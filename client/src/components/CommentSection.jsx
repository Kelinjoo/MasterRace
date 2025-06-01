// Component to display and manage comments under a specific post
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/CommentSection.css';

function CommentSection({ postId, showInput }) {
  const { auth } = useAuth();

  const [comments, setComments] = useState([]);         
  const [newComment, setNewComment] = useState('');     
  const [error, setError] = useState('');               

  // Fetch all comments for the current post
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  // Submit a new comment to the server
  const handlePostComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    try {
      await axios.post('/comments', 
        { postId, content: newComment }, 
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      setNewComment('');     // Clear input
      fetchComments();       // Refresh comment list
    } catch {
      alert('Failed to post comment');
    }
  };

  // Delete a comment by ID (only if user is owner or admin)
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      fetchComments(); // Refresh list after deletion
    } catch {
      alert('Failed to delete comment');
    }
  };

  // Fetch comments every time postId changes (e.g., when switching posts)
  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      {/* Input box for posting a new comment (visible only when logged in) */}
      {showInput && auth.token && (
        <div className="comment-input-box">
          <input
            type="text"
            value={newComment}
            placeholder="Write a comment..."
            className="form-control"
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-success btn-sm mt-2"
            onClick={handlePostComment}
          >
            Post
          </button>
        </div>
      )}

      {/* Render list of comments if any exist */}
      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="comment-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{comment.username}</strong>: {comment.content}
              </div>

              {/* Show delete button only if user is the author or an admin */}
              {(auth.userId === comment.user_id || auth.isAdmin) && (
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error message if something went wrong */}
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
}

export default CommentSection;
