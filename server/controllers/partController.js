// controllers/partController.js
const partModel = require('../models/partModel');
const db = require('../config/db');

// Get all parts
const getAllParts = async (req, res) => {
  try {
    const parts = await partModel.getAllParts();
    res.status(200).json(parts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ message: 'Server error while retrieving parts' });
  }
};

// Get parts by type (e.g., CPU, GPU)
const getPartsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const parts = await partModel.getPartsByType(type);
    res.status(200).json(parts);
  } catch (error) {
    console.error('Error fetching parts by type:', error);
    res.status(500).json({ message: 'Server error while retrieving parts by type' });
  }
};

const addPart = async (req, res) => {
  const { name, type, specs, price } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO parts (name, type, specs, price) VALUES (?, ?, ?, ?)',
      [name, type, specs, price]
    );
    res.status(201).json({ message: 'Part added', id: result.insertId });
  } catch (error) {
    console.error('Error adding part:', error);
    res.status(500).json({ message: 'Server error while adding part' });
  }
};

module.exports = {
  getAllParts,
  getPartsByType,
  addPart,
};
