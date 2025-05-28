// Import the PostList component (renders all posts)
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import PostForm from '../components/PostForm';
import '../styles/HomePage.css';

function HomePage() {
  const { auth } = useAuth();            // Get user auth info (token, userId, isAdmin)
  const [showForm, setShowForm] = useState(false); // Track whether to show the post form

  return (
    <div className="container">
      
      {/* Header section with greeting and user info */}
      <div className="home-header">
        <h1>Welcome to MasterRace</h1>
        {auth.token && (
          <p className="user-info">
            Logged in as <strong>User ID: {auth.userId}</strong>{' '}
            {auth.isAdmin && '(Admin)'}
          </p>
        )}
      </div>

      {/* Toggle button to show/hide the post creation form */}
      {auth.token && (
        <>
          <div className="create-post-toggle">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowForm(prev => !prev)}
            >
              {showForm ? 'Hide Form' : '+ Create New Post'}
            </button>
          </div>

          {/* Conditionally render the post form */}
          {showForm && (
            <div className="create-post-box">
              {/* PostForm takes onSuccess which hides the form after submission */}
              <PostForm onSuccess={() => setShowForm(false)} />
            </div>
          )}
        </>
      )}

      {/* Display all posts below the form */}
      <PostList />
    </div>
  );
}

export default HomePage;
