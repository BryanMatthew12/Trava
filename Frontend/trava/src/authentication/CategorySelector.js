import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking, faUtensils, faShoppingCart, faLandmark, faPrayingHands } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { BASE_URL } from '../config'; // Adjust the import based on your project structure
import { useNavigate } from 'react-router-dom';

const CategorySelector = () => {
  const categories = [
    { id: 1, name: 'Adventure', icon: faHiking },
    { id: 2, name: 'Culinary', icon: faUtensils },
    { id: 3, name: 'Shopping', icon: faShoppingCart },
    { id: 4, name: 'Culture', icon: faLandmark },
    { id: 5, name: 'Religious', icon: faPrayingHands },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    try {
      // If no categories are selected, default to all categories (1-5)
      const categoriesToSave =
        selectedCategories.length === 0
          ? categories.map((category) => category.id)
          : selectedCategories;

      const response = await axios.post(
        `${BASE_URL}/v1/user-preference`,
        {
          category_ids: categoriesToSave,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      navigate("/Home");
    } catch (error) {
      console.error('Error saving categories:', error);
      alert('Failed to save categories. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 className='font-bold text-md'>Select Your Categories</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          margin: '20px auto',
          maxWidth: '600px',
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              border: selectedCategories.includes(category.id)
                ? '2px solid #87CEEB'
                : '1px solid #ccc',
              backgroundColor: selectedCategories.includes(category.id)
                ? '#E6F7FF'
                : '#fff',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleCategoryChange(category.id)}
          >
            <FontAwesomeIcon icon={category.icon} size="2x" style={{ marginBottom: '10px' }} />
            <p style={{ margin: '10px 0', fontWeight: 'bold' }}>{category.name}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default CategorySelector;