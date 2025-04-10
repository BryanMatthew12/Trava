import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategorySelector = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    axios.get('/api/v1/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId) // Remove if already selected
        : [...prev, categoryId] // Add if not selected
    );
  };

  const handleSubmit = () => {
    axios.post('/api/v1/categories', { categories: selectedCategories })
      .then(response => alert('Categories saved successfully!'))
      .catch(error => console.error('Error saving categories:', error));
  };

  return (
    <div>
      <h2>Select Your Categories</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <label>
              <input
                type="checkbox"
                value={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Save Categories</button>
    </div>
  );
};

export default CategorySelector;