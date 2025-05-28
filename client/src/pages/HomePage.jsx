import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import PostList from '../components/PostList';
import PostForm from '../components/PostForm';
import '../styles/HomePage.css';

function HomePage() {
  const { auth } = useAuth();

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
            Logged in as <strong>User ID: {auth.userId}</strong>{' '}
            {auth.isAdmin && '(Admin)'}
          </p>
        )}
      </div>

      {/* Only show create post UI if user is logged in */}
      {auth.token && (
        <>
          {/* Button to toggle visibility of the post form */}
          <div className="create-post-toggle">
            <button
              className="btn btn-outline-primary"
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
                }}
                onCancel={() => {
                  setEditingPost(null);
                  setShowForm(false);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Display all posts, pass down edit handlers */}
      <PostList setEditingPost={setEditingPost} setShowForm={setShowForm} />
    </div>
  );
}

export default HomePage;
