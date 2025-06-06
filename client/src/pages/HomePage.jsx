import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import '../styles/HomePage.css';

function HomePage() {
  const { auth, isLoaded } = useAuth(); // Destructure isLoaded


  // Wait for auth to be loaded before rendering anything
  if (!isLoaded) return null;

  // refresh trigger
  const [refreshPostsTrigger, setRefreshPostsTrigger] = useState(0);

  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores the post currently being edited (if any)
  const [editingPost, setEditingPost] = useState(null);

  return (
    <div className="container">
      {/* Page title and user info */}
      <div className="home-header">
        <h1>Welcome to MasterRace</h1>
        {auth.token && (
          <p className="user-info">
            Logged in as <strong>{auth.username}</strong>{' '}
            {auth.isAdmin === true && <span className="admin-badge">Admin</span>}
          </p>
        )}
      </div>

      {/* Only show create post UI if user is logged in */}
      {auth.token && (
        <>
          {/* Button to toggle visibility of the post form */}
          <div className="create-post-toggle">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditingPost(null);       // Reset edit state if creating
                setShowForm(prev => !prev); // Toggle visibility
              }}
            >
              {showForm ? 'Hide Form' : '+ Create New Post'}
            </button>
          </div>

          {/* Render form if toggled on */}
          {showForm && (
            <div className="create-post-box">
              <PostForm
                editingPost={editingPost}
                onSuccess={() => {
                  setEditingPost(null);
                  setShowForm(false);
                  setRefreshPostsTrigger(prev => prev + 1); 
                }}
                onCancel={() => {
                  setEditingPost(null);
                  setShowForm(false);
                  setEditingPostId(null); // ✅ Needed to exit edit mode
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Display all posts, pass down edit handlers */}
      <PostList setEditingPost={setEditingPost} setShowForm={setShowForm} refreshPostsTrigger={refreshPostsTrigger}/>
    </div>
  );
}

export default HomePage;
