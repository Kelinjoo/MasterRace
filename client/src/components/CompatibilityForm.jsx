// Component for administrators to define compatibility between two parts
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CompatibilityForm = () => {
  const { auth } = useAuth();

  const [parts, setParts] = useState([]);       
  const [partA, setPartA] = useState('');       
  const [partB, setPartB] = useState('');       
  const [status, setStatus] = useState('');     

  // Fetch all parts to populate dropdowns
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await axios.get('/parts');
        setParts(res.data);
      } catch {
        setStatus('❌ Failed to load parts.');
      }
    };
    fetchParts();
  }, []);

  // Handle form submission to add a compatibility link
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that two different parts are selected
    if (!partA || !partB || partA === partB) {
      return setStatus('Select two different parts.');
    }

    try {
      console.log('Sending compatibility:', partA, partB, auth.token);

      await axios.post('/parts/add-compatibility', {
        partId: Number(partA),
        compatibleWithId: Number(partB)
      }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // Success: reset fields and show confirmation
      setStatus('✅ Compatibility added.');
      setPartA('');
      setPartB('');
    } catch {
      setStatus('❌ Failed to add compatibility.');
    }
  };

  return (
    <div className="mb-4">
      <h5>Define Compatibility</h5>

      {/* Status message (e.g. success or failure feedback) */}
      {status && <div className="text-muted mb-2">{status}</div>}

      {/* Compatibility form with two dropdowns */}
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        <select
          value={partA}
          onChange={(e) => setPartA(e.target.value)}
          className="form-select"
        >
          <option value="">Select Part A</option>
          {parts.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.type})
            </option>
          ))}
        </select>

        <select
          value={partB}
          onChange={(e) => setPartB(e.target.value)}
          className="form-select"
        >
          <option value="">Select Part B</option>
          {parts.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.type})
            </option>
          ))}
        </select>

        <button className="btn btn-primary">Add Compatibility</button>
      </form>
    </div>
  );
};

export default CompatibilityForm;
