import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { auth } = useAuth();

  return (
    <div>
      <div className="text-center mt-4">
        <h1>Welcome to MasterRace</h1>
        {auth.token && (
          <p>
            Logged in as <strong>User ID: {auth.userId}</strong>{' '}
            {auth.isAdmin && '(Admin)'}
          </p>
        )}
      </div>
      <PostList />
    </div>
  );
}

export default HomePage;
