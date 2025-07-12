import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./BrowseItems.css";

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get("http://localhost:8080/api/items");

        // Normalize the response data to a proper array
        const data = res.data;
        const itemList = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.data)
          ? data.data
          : [];

        setItems(itemList);
      } catch (err) {
        console.error("Error fetching items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tops", label: "Tops" },
    { value: "bottoms", label: "Bottoms" },
    { value: "dresses", label: "Dresses" },
    { value: "outerwear", label: "Outerwear" },
    { value: "shoes", label: "Shoes" },
    { value: "accessories", label: "Accessories" },
  ];

  const conditions = [
    { value: "all", label: "All Conditions" },
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];

  const filteredItems = items.filter((item) => {
    // Only include approved items
    if (item.approved === false) return false;

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(search));

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    const matchesCondition =
      selectedCondition === "all" || item.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  return (
    <div className="browse-items-container">
      <h1>Browse Items</h1>

      <div className="browse-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
        >
          {conditions.map((condition) => (
            <option key={condition.value} value={condition.value}>
              {condition.label}
            </option>
          ))}
        </select>
      </div>

      <div className="browse-items-list">
        {loading ? (
          <div className="loading-list">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-list">No items found.</div>
        ) : (
          filteredItems.map((item) => (
            <Link
              to={`/item/${item._id}`}
              key={item._id}
              className="browse-item-card"
            >
              <img
                src={item.images?.[0] || "/placeholder.jpg"}
                alt={item.title}
                className="browse-item-img"
              />
              <div className="browse-item-info">
                <div className="browse-item-title">{item.title}</div>
                <div className="browse-item-desc">{item.description}</div>
                <div className="browse-item-tags">
                  {(item.tags || []).map((tag, idx) => (
                    <span key={idx} className="browse-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
