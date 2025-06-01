// Component to display and manage a user's PC builds
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BuildPage.css';

function UserBuildList({ builds, onDelete }) {
  const { auth } = useAuth();

  const [expandedBuildId, setExpandedBuildId] = useState(null); // ID of currently expanded build
  const [parts, setParts] = useState({}); // Maps buildId → array of parts
  const [editingBuildId, setEditingBuildId] = useState(null); // ID of build being edited
  const [editName, setEditName] = useState(''); // Name input for editing
  const [editParts, setEditParts] = useState({}); // Selected part IDs for editing
  const [allParts, setAllParts] = useState({}); // All parts grouped by type
  const [error, setError] = useState(''); // Error message

  const partTypes = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case'];

  // Fetch all available parts grouped by type on mount
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const result = {};
        for (const type of partTypes) {
          const res = await axios.get(`/parts/${type}`);
          result[type] = res.data;
        }
        setAllParts(result);
      } catch {
        setError('Failed to load parts.');
      }
    };
    fetchParts();
  }, []);

  // Toggle part visibility for a specific build
  const handleViewParts = async (buildId) => {
    if (expandedBuildId === buildId) {
      setExpandedBuildId(null);
      return;
    }
    try {
      const res = await axios.get(`/builds/${buildId}/parts`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setParts(prev => ({ ...prev, [buildId]: res.data }));
      setExpandedBuildId(buildId);
    } catch {
      setError('Failed to load build parts.');
    }
  };

  // Enter edit mode for a specific build
  const enterEditMode = (build) => {
    setEditingBuildId(build.id);
    setEditName(build.name);
    const partMap = {};
    parts[build.id]?.forEach(p => {
      partMap[p.type] = p.id;
    });
    setEditParts(partMap);
  };

  // Submit edited build (includes compatibility check)
  const handleEditSubmit = async () => {
    const partIds = Object.values(editParts);
    if (!editName || partIds.length === 0) {
      alert('Please provide name and parts');
      return;
    }

    // Run compatibility check before saving
    try {
      const res = await axios.post('/parts/check-compatibility', { partIds });
      if (!res.data.compatible) {
        alert('Selected parts are not compatible!');
        return;
      }
    } catch {
      alert('Error while checking compatibility');
      return;
    }

    // Save build if compatible
    try {
      await axios.put(`/builds/${editingBuildId}`, {
        name: editName,
        partIds
      }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // Reset editing state
      setEditingBuildId(null);
      setEditName('');
      setEditParts({});
      setExpandedBuildId(null);
    } catch {
      alert('Failed to update build.');
    }
  };

  // Calculate total price of a part list
  const calculateTotal = (partsArr) =>
    partsArr.reduce((sum, p) => sum + parseFloat(p.price || 0), 0).toFixed(2);

  return (
    <div className="user-builds-container mt-4">
      <h4>Your Builds</h4>
      {error && <div className="text-danger">{error}</div>}

      {builds.length === 0 ? (
        <p>You haven't created any builds yet.</p>
      ) : (
        <div className="user-build-list">
          {builds.map(build => (
            <div key={build.id} className="user-build-card">
              {/* Edit form */}
              {editingBuildId === build.id ? (
                <div className="edit-build-form">
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="form-control mb-2"
                    placeholder="Build name"
                  />

                  {partTypes.map(type => (
                    <select
                      key={type}
                      value={editParts[type] || ''}
                      onChange={e => setEditParts(prev => ({ ...prev, [type]: Number(e.target.value) }))}
                      className="form-select mb-2"
                    >
                      <option value="">Select {type}</option>
                      {allParts[type]?.map(part => (
                        <option key={part.id} value={part.id}>
                          {part.name} – {part.price}€
                        </option>
                      ))}
                    </select>
                  ))}

                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" onClick={handleEditSubmit}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingBuildId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Build name and action buttons */}
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{build.name}</strong>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleViewParts(build.id)}>
                        {expandedBuildId === build.id ? 'Hide Parts' : 'View Parts'}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => enterEditMode(build)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(build.id)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Part list for expanded build */}
                  {expandedBuildId === build.id && (
                    <div className="mt-3">
                      {parts[build.id]?.length > 0 ? (
                        <>
                          <ul className="list-unstyled">
                            {parts[build.id].map(p => (
                              <li key={p.id}>
                                - {p.type}: {p.name} ({p.price}€)
                              </li>
                            ))}
                          </ul>
                          <strong>Total: {calculateTotal(parts[build.id])}€</strong>
                        </>
                      ) : (
                        <p className="text-muted">No parts found.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBuildList;
