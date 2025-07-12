import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

export default function AddItem() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tops",
    type: "",
    size: "",
    condition: "good",
    redeemPoints: 50,
    status: "available",
    tags: [],
    images: [],
    purchasePrice: "",
    purchaseAge: "",
  });
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/login");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const categories = ["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories"];
  const conditions = ["new", "like-new", "good", "fair"];
  const purchaseAgeOptions = [
    "Less than 3 months", "3–6 months", "6–12 months",
    "About 1 year", "Over 2 years", "Can't remember"
  ];

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleAddImage = () => {
    const img = newImage.trim();
    if (img && !formData.images.includes(img) && formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, img] });
      setNewImage("");
    }
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) return alert("Please add at least one image");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Remove pointValue if present, and ensure redeemPoints is sent
      const { redeemPoints, ...rest } = formData;
      const payload = { ...rest, redeemPoints, uploader: user?._id };

      const res = await fetch("http://localhost:8080/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add item");
      alert("Item submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("There was an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>

      <form onSubmit={handleSubmit} className="add-item-form">
        {/* PHOTOS */}
        <div className="section">
          <h3>Photos</h3>
          <p>Add up to 5 photos of your item</p>
          <div className="form-row">
            <input
              type="text"
              placeholder="Paste image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
            <button type="button" className="add-btn" onClick={handleAddImage}>
              Add Photo
            </button>
          </div>
          <div className="images-preview">
            {formData.images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt={`Upload ${idx + 1}`} />
                <button type="button" onClick={() => removeImage(idx)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* BASIC DETAILS */}
        <div className="section">
          <h3>Basic Details</h3>

          <div className="form-row">
            <div className="form-col">
              <label>Title *</label>
              <input type="text" placeholder="e.g. Vintage Denim Jacket" required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="form-col">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Type</label>
              <input type="text" placeholder="e.g. T-shirt, Jeans" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
            </div>
            <div className="form-col">
              <label>Size</label>
              <input type="text" placeholder="e.g. M, L, 32"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Condition *</label>
              <select value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
            <div className="form-col">
              <label>Point Value *</label>
              <input type="number"
                value={formData.redeemPoints}
                onChange={(e) =>
                  setFormData({ ...formData, redeemPoints: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe the item’s style, fit, material..."
            rows={4}
            required
          />
        </div>

        {/* TAGS */}
        <div className="section">
          <h3>Tags</h3>
          <p>Add tags to help others find your item</p>
          <div className="form-row">
            <input
              type="text"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button type="button" className="add-btn" onClick={handleAddTag}>+</button>
          </div>
          <div className="tags-list">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-row" style={{ justifyContent: "flex-end", gap: "1rem" }}>
          <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "List Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
