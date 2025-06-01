import { useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PartForm = ({ onPartAdded }) => {
  const { auth } = useAuth(); // Auth context to get token
  const [form, setForm] = useState({
    name: '',
    type: '',
    specs: '',
    price: ''
  });
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle part submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, type, specs, price } = form;

    // Basic validation
    if (!name || !type || !price) {
      return setMessage('Please fill in required fields.');
    }

    try {
      await axios.post('/parts', form, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // Reset form on success
      setMessage('✅ Part added successfully!');
      setForm({ name: '', type: '', specs: '', price: '' });
      onPartAdded?.(); // Optional callback to refresh list
    } catch {
      setMessage('❌ Failed to add part.');
    }
  };

  return (
    <div className="mb-4">
      <h5>Add New Part</h5>
      {message && <div className="text-muted mb-2">{message}</div>}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        {/* Name input */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Part name"
          className="form-control"
        />

        {/* Part type dropdown */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Select type</option>
          <option>CPU</option>
          <option>GPU</option>
          <option>RAM</option>
          <option>Motherboard</option>
          <option>Storage</option>
          <option>PSU</option>
          <option>Case</option>
        </select>

        {/* Optional specs */}
        <input
          name="specs"
          value={form.specs}
          onChange={handleChange}
          placeholder="Specs (optional)"
          className="form-control"
        />

        {/* Price input */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price €"
          className="form-control"
          type="number"
          step="0.01"
        />

        {/* Submit button */}
        <button className="btn btn-success">Add Part</button>
      </form>
    </div>
  );
};

export default PartForm;
