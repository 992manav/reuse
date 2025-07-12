import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ItemDetail.css";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapType, setSwapType] = useState("points");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [pointsOffer, setPointsOffer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load current user from localStorage or elsewhere
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch item details
  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`http://localhost:8080/api/items/${id}`);
        const data = await res.json();
        setItem(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch item:", err);
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  // Fetch current user's approved items
  useEffect(() => {
    async function fetchUserItems() {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:8080/api/items");
        const data = await res.json();
        const filtered = data.filter(
          (i) => i.uploaderId === user.id && i.id !== id && i.approved
        );
        setUserItems(filtered);
      } catch (err) {
        console.error("Failed to fetch user items:", err);
      }
    }
    fetchUserItems();
  }, [user, id]);

  async function handleSwapRequest() {
    if (!user) {
      navigate("/login");
      return;
    }

    let requestBody = { itemId: item.id, message };

    if (swapType === "item" && selectedItemId) {
      requestBody.offeredItemId = selectedItemId;
    } else if (swapType === "points" && pointsOffer) {
      const points = parseInt(pointsOffer);
      if (points > user.points) {
        alert("You don't have enough points for this offer.");
        return;
      }
      requestBody.pointsOffered = points;
    }

    try {
      const res = await fetch("http://localhost:8080/api/swaps/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Adjust if your backend expects a token
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("Swap request failed");

      alert("Swap request sent successfully!");
      setShowSwapModal(false);
    } catch (error) {
      console.error("Swap request error:", error);
      alert("Failed to send swap request");
    }
  }

  if (loading) {
    return <div className="item-detail-loading">Loading item...</div>;
  }

  if (!item) {
    return (
      <div className="item-detail-notfound">
        <h2>Item not found</h2>
        <Link to="/browse" className="item-detail-back">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === item.uploaderId;

  return (
    <div className="item-detail-container">
      <Link to="/browse" className="item-detail-back">
        ← Back to browse
      </Link>
      <div className="item-detail-main">
        <div className="item-detail-gallery">
          <img
            src={item.images[selectedImage]}
            alt={item.title}
            className="item-detail-img"
          />
          {item.images.length > 1 && (
            <div className="item-detail-thumbs">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={selectedImage === index ? "active" : ""}
                >
                  <img src={image} alt={`${item.title} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="item-detail-info">
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <div className="item-detail-tags">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="item-detail-tag">
                {tag}
              </span>
            ))}
          </div>
          {!isOwner && (
            <div className="item-detail-actions">
              <button
                onClick={() => setShowSwapModal(true)}
                className="item-detail-swap-btn"
              >
                Request Swap
              </button>
            </div>
          )}
        </div>
      </div>

      {showSwapModal && (
        <div className="item-detail-modal">
          <div className="item-detail-modal-content">
            <h3>Request Swap</h3>
            <select
              value={swapType}
              onChange={(e) => setSwapType(e.target.value)}
            >
              <option value="points">Offer Points</option>
              <option value="item">Offer Item</option>
            </select>

            {swapType === "item" ? (
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
              >
                <option value="">Select your item</option>
                {userItems.map((ui) => (
                  <option key={ui.id} value={ui.id}>
                    {ui.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                placeholder="Points to offer"
                value={pointsOffer}
                onChange={(e) => setPointsOffer(e.target.value)}
                min={0}
              />
            )}

            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={handleSwapRequest}
              className="item-detail-modal-btn"
            >
              Send Request
            </button>
            <button
              onClick={() => setShowSwapModal(false)}
              className="item-detail-modal-close"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
