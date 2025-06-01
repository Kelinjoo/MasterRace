import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import BuildForm from '../components/BuildForm';
import BuildList from '../components/BuildList';
import PartForm from '../components/PartForm';
import CompatibilityForm from '../components/CompatibilityForm';
import '../styles/BuildPage.css';

function BuildPage() {
  const { auth } = useAuth();
  const [builds, setBuilds] = useState([]);
  const [mode, setMode] = useState('create'); // Can switch between 'create', 'view', or 'admin'

  // Fetch user's builds from the server
  const fetchBuilds = async () => {
    try {
      const res = await axios.get('/builds', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setBuilds(res.data);
    } catch (err) {
      console.error('Failed to fetch builds', err);
    }
  };

  // Delete a selected build
  const handleDeleteBuild = async (buildId) => {
    if (!window.confirm('Are you sure you want to delete this build?')) return;

    try {
      await axios.delete(`/builds/${buildId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchBuilds();
    } catch (err) {
      alert('Failed to delete build');
    }
  };

  // Fetch builds after login
  useEffect(() => {
    if (auth.token) {
      fetchBuilds();
    }
  }, [auth.token]);

  return (
    <div className="container mt-4 build-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Build My PC</h2>

        {/* Mode selection dropdown */}
        <select
          className="form-select mode-selector"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="create">Create Build</option>
          <option value="view">View Builds</option>
          {auth.isAdmin && <option value="admin">Admin Tools</option>}
        </select>
      </div>

      {/* Show content based on selected mode */}
      {mode === 'create' && <BuildForm onBuildCreated={fetchBuilds} />}
      {mode === 'view' && <BuildList builds={builds} onDelete={handleDeleteBuild} />}
      {mode === 'admin' && auth.isAdmin && (
        <div>
          <hr className="my-4" />
          <h4>Admin Tools</h4>
          <PartForm onPartAdded={fetchBuilds} />
          <CompatibilityForm />
        </div>
      )}
    </div>
  );
}

export default BuildPage;
