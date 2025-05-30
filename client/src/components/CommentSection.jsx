import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/CommentSection.css';

function CommentSection({ postId, showInput }) {
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  // Fetch all comments for this post
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      setError('Failed to load comments');
    }
  };

  // Post new comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post('/comments', { postId, content: newComment }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setNewComment('');
      fetchComments();
    } catch {
      alert('Failed to post comment');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchComments();
    } catch {
      alert('Failed to delete comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
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

      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{comment.username}</strong>: {comment.content}
              </div>
              {(auth.userId === comment.user_id || auth.isAdmin) ? (
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              ) : null}

            </div>
          ))}
        </div>
      )}

      {error && <div className="text-danger">{error}</div>}
    </div>
  );
}

export default CommentSection;
