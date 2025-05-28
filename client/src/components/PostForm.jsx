import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function PostForm({ onSuccess, editingPost = null, onCancel }) {
  const { auth } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // If editing an existing post, pre-fill the form
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setDescription(editingPost.description);
      setImageUrl(editingPost.image_url);
    }
  }, [editingPost]);

  // Submit handler for creating or updating a post
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Include auth token
        },
      };

      if (editingPost) {
        // Update existing post
        await axios.put(`/posts/${editingPost.id}`, { title, description, imageUrl }, config);
      } else {
        // Create new post
        await axios.post('/posts', { title, description, imageUrl }, config);
      }

      onSuccess(); // Trigger refresh in parent
      setTitle('');
      setDescription('');
      setImageUrl('');
      if (onCancel) onCancel(); // Exit edit mode if applicable
    } catch (err) {
      setError('Failed to save post');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>{editingPost ? 'Edit Post' : 'Create New Post'}</h4>

      {/* Title Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description Textarea */}
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Image URL Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
      </div>

      {/* Error display */}
      {error && <div className="text-danger">{error}</div>}

      {/* Action buttons */}
      <button className="btn btn-success me-2" type="submit">
        {editingPost ? 'Update' : 'Create'}
      </button>
      {editingPost && (
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default PostForm;
