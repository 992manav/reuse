import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddItem.css';

export default function AddItem() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tops',
    type: '',
    size: '',
    condition: 'good',
    pointValue: 50,
    status: 'available'
  });
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const conditions = [
    { value: 'new', label: 'New with tags' },
    { value: 'like-new', label: 'Like new' },
    { value: 'good', label: 'Good condition' },
    { value: 'fair', label: 'Fair condition' }
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=500',
    'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=500'
  ];

  function addSampleImage() {
    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    if (images.length < 5 && !images.includes(randomImage)) {
      setImages([...images, randomImage]);
    }
  }

  function removeImage(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }

  function removeTag(tagToRemove) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images,
          tags
        })
      });

      if (!res.ok) {
        throw new Error('Failed to add item');
      }

      alert('Item added successfully! It will be reviewed before appearing in the browse section.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Type"
          value={formData.type}
          onChange={e => setFormData({ ...formData, type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Size"
          value={formData.size}
          onChange={e => setFormData({ ...formData, size: e.target.value })}
        />
        <select
          value={formData.condition}
          onChange={e => setFormData({ ...formData, condition: e.target.value })}
        >
          {conditions.map(cond => (
            <option key={cond.value} value={cond.value}>{cond.label}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Point Value"
          value={formData.pointValue}
          onChange={e => setFormData({ ...formData, pointValue: Number(e.target.value) })}
          min={0}
        />

        <div className="images-section">
          <button type="button" onClick={addSampleImage} className="add-image-btn">Add Sample Image</button>
          <div className="images-list">
            {images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt="preview" />
                <button type="button" onClick={() => removeImage(idx)} className="remove-image-btn">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="tags-section">
          <input
            type="text"
            placeholder="Add tag"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
          />
          <button type="button" onClick={addTag} className="add-tag-btn">Add Tag</button>
          <div className="tags-list">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="remove-tag-btn">x</button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}
