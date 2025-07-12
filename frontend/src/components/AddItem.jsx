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
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const categories = [
    "tops",
    "bottoms",
    "dresses",
    "outerwear",
    "shoes",
    "accessories",
  ];
  const conditions = ["new", "like-new", "good", "fair"];
  const purchaseAgeOptions = [
    "Less than 3 months",
    "3–6 months",
    "6–12 months",
    "About 1 year",
    "Over 2 years",
    "Can't remember",
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

    if (formData.images.length === 0) {
      alert("Please add at least one image URL");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        uploader: user?._id,
      };

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
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Type (e.g., T-shirt, Jacket)"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />

        <input
          type="text"
          placeholder="Size (e.g., M, L, 32)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        />

        <select
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
        >
          {conditions.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Redeem Points"
          value={formData.redeemPoints}
          onChange={(e) =>
            setFormData({ ...formData, redeemPoints: Number(e.target.value) })
          }
          min={0}
        />

        <input
          type="number"
          placeholder="Original Purchase Price (₹)"
          value={formData.purchasePrice}
          onChange={(e) =>
            setFormData({ ...formData, purchasePrice: Number(e.target.value) })
          }
        />

        <select
          value={formData.purchaseAge}
          onChange={(e) =>
            setFormData({ ...formData, purchaseAge: e.target.value })
          }
        >
          <option value="">Select Purchase Age</option>
          {purchaseAgeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="image-inputs">
          <input
            type="text"
            placeholder="Image URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <button type="button" onClick={handleAddImage}>
            Add Image
          </button>
          <div className="images-preview">
            {formData.images.map((img, idx) => (
              <div key={idx} className="image-preview">
                <img src={img} alt="Preview" />
                <button type="button" onClick={() => removeImage(idx)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="tag-inputs">
          <input
            type="text"
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button type="button" onClick={handleAddTag}>
            Add Tag
          </button>
          <div className="tags-list">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Item"}
        </button>
      </form>
    </div>
  );
}
