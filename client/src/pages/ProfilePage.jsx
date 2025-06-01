import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

function ProfilePage() {
  const { auth, setAuth } = useAuth(); 
  const [posts, setPosts] = useState([]); 
  const [error, setError] = useState('');

  // Fields for profile editing
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState('');

  // Fields for editing a post
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedImage, setEditedImage] = useState('');

  // Fetch all posts and filter by current user's ID
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get('/posts');
      const userPosts = res.data.filter(post => post.user_id === auth.userId);
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to load your posts');
    }
  };

  // Fetch user profile info for display/edit
  const fetchUserInfo = async () => {
    try {
      const res = await axios.get('/users/me', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      // Update only the user data fields, not token
      setAuth(prev => ({
        ...prev,
        username: res.data.username,
        bio: res.data.bio,
        profile_picture: res.data.profile_picture,
      }));
    } catch (err) {
      console.error('Failed to fetch user info');
    }
  };

  // Delete a user's post
  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
      alert('Failed to delete post.');
    }
  };

  // Start editing post
  const handleEdit = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    setEditingPostId(postId);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
    setEditedImage(post.image_url || '');
  };

  // Submit post update
  const handleUpdatePost = async () => {
    try {
      await axios.put(`/posts/${editingPostId}`, {
        title: editedTitle,
        description: editedDescription,
        imageUrl: editedImage,
      }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setEditingPostId(null);
      fetchUserPosts(); // refresh
    } catch {
      alert('Failed to update post.');
    }
  };

  // Start profile edit
  const handleProfileEdit = (field) => {
    setEditField(field);
    setNewValue('');
  };

  // Save profile field changes
  const handleSaveEdit = async () => {
    let url = '';
    let payload = {};

    switch (editField) {
      case 'username':
        url = '/users/username';
        payload = { newUsername: newValue };
        break;
      case 'bio':
        url = '/users/bio';
        payload = { newBio: newValue };
        break;
      case 'profilePic':
        url = '/users/profile-pic';
        payload = { profilePicUrl: newValue };
        break;
      case 'password':
        url = '/users/password';
        payload = { newPassword: newValue };
        break;
      default:
        return alert('Invalid field');
    }

    try {
      await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setEditField(null);
      fetchUserInfo(); // Refresh updated info
    } catch {
      alert('Update failed');
    }
  };

  useEffect(() => {
    fetchUserPosts();
    fetchUserInfo();
  }, []);

  return (
    <div className="profile-container container-fluid">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-pic-placeholder">
          {auth.profile_picture ? (
            <img src={auth.profile_picture} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic fallback" />
          )}
        </div>

        <div className="profile-info">
          <h2>{auth.username || 'User'}</h2>
          {auth.bio && <p className="profile-bio">{auth.bio}</p>}
          {auth.isAdmin === true && <span className="admin-badge">Admin</span>}

          {/* Profile Field Edit Buttons */}
          <div className="edit-buttons">
            <button onClick={() => handleProfileEdit("profilePic")} className="btn btn-outline-secondary btn-sm">Edit Profile Pic</button>
            <button onClick={() => handleProfileEdit("username")} className="btn btn-outline-secondary btn-sm">Edit Username</button>
            <button onClick={() => handleProfileEdit("password")} className="btn btn-outline-secondary btn-sm">Change Password</button>
            <button onClick={() => handleProfileEdit("bio")} className="btn btn-outline-secondary btn-sm">Edit Bio</button>
          </div>

          {/* Input field to update selected profile field */}
          {editField && (
            <div className="mt-3">
              <input
                type={editField === "password" ? "password" : "text"}
                placeholder={`Enter new ${editField}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="form-control mb-2"
              />
              <button className="btn btn-sm btn-success me-2" onClick={handleSaveEdit}>Save</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditField(null)}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      <hr />

      {/* User's Posts Section */}
      <div className="user-posts">
        <h3>Your Posts</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {posts.length === 0 ? (
          <p>You haven’t posted anything yet.</p>
        ) : (
          <div className="profile-post-grid">
            {posts.map(post => (
              <div key={post.id} className="profile-post-card">
                {editingPostId === post.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      placeholder="Edit title"
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editedDescription}
                      onChange={e => setEditedDescription(e.target.value)}
                      placeholder="Edit description"
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editedImage}
                      onChange={e => setEditedImage(e.target.value)}
                      placeholder="Image URL"
                    />
                    <div className="post-actions">
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdatePost}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingPostId(null)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="title">{post.title}</h5>
                    <p className="description">{post.description}</p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="profile-post-image"
                      />
                    )}
                    <div className="post-actions">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(post.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
