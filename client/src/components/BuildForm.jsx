// Form component for creating a new PC build
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function BuildForm({ onBuildCreated }) {
  const { auth } = useAuth(); // Access auth context
  const [name, setName] = useState(''); // Build name
  const [partsByType, setPartsByType] = useState({}); // Available parts grouped by type
  const [selectedParts, setSelectedParts] = useState({}); // Selected part IDs
  const [message, setMessage] = useState(''); // Status message
  const [compatibilityStatus, setCompatibilityStatus] = useState(null); // Result of compatibility check

  const partTypes = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'PSU', 'Case']; // All required part types

  // Fetch all parts by type on mount
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const result = {};
        for (const type of partTypes) {
          const res = await axios.get(`/parts/${type}`);
          result[type] = res.data;
        }
        setPartsByType(result);
      } catch {
        setMessage('❌ Failed to load parts.');
      }
    };

    fetchParts();
  }, []);

  // Handle selecting a part from dropdown
  const handlePartSelect = (type, partId) => {
    setSelectedParts(prev => ({ ...prev, [type]: Number(partId) }));
    setMessage('');
  };

  // Trigger manual compatibility check
  const checkCompatibility = async () => {
    const partIds = Object.values(selectedParts);
    if (partIds.length < 2) {
      setCompatibilityStatus({ compatible: false, message: 'Select at least 2 parts.' });
      return;
    }

    try {
      const res = await axios.post('/parts/check-compatibility', { partIds });
      setCompatibilityStatus(res.data);
    } catch {
      setCompatibilityStatus({ compatible: false, message: 'Error checking compatibility.' });
    }
  };

  // Submit the form to create a build
  const handleSubmit = async (e) => {
    e.preventDefault();
    const partIds = Object.values(selectedParts);

    if (!name || partIds.length === 0) {
      return setMessage('❌ Build name and parts are required.');
    }

    try {
      const res = await axios.post('/parts/check-compatibility', { partIds });
      if (!res.data.compatible) {
        return setMessage('❌ Build contains incompatible parts.');
      }

      await axios.post('/builds', { name, partIds }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // Reset form state on success
      setName('');
      setSelectedParts({});
      setCompatibilityStatus(null);
      setMessage('✅ Build created successfully!');
      onBuildCreated?.();
    } catch {
      setMessage('❌ Failed to create build.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h4>Create a PC Build</h4>

      {/* Input for build name */}
      <div className="mb-3">
        <label className="form-label">Build Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setMessage('');
          }}
          required
        />
      </div>

      {/* Dropdowns for selecting each part */}
      {partTypes.map(type => (
        <div className="mb-3" key={type}>
          <label className="form-label">{type}</label>
          <select
            className="form-select"
            value={selectedParts[type] || ''}
            onChange={(e) => handlePartSelect(type, e.target.value)}
          >
            <option value="">Select {type}</option>
            {partsByType[type]?.map(part => (
              <option key={part.id} value={part.id}>
                {part.name} – {part.price}€
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Display compatibility result */}
      {compatibilityStatus && (
        <div className={`alert ${compatibilityStatus.compatible ? 'alert-success' : 'alert-danger'}`}>
          {compatibilityStatus.compatible
            ? 'All parts are compatible!'
            : compatibilityStatus.message || 'Incompatible part pairs detected'}
        </div>
      )}

      {/* Display form status message */}
      {message && <div className="text-muted mb-2">{message}</div>}

      {/* Action buttons */}
      <div className="d-flex gap-2">
        <button type="button" className="btn btn-outline-info" onClick={checkCompatibility}>
          Check Compatibility
        </button>
        <button type="submit" className="btn btn-success">
          Create Build
        </button>
      </div>
    </form>
  );
}

export default BuildForm;
