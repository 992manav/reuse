import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    async function fetchData() {
      try {
        const [userRes, itemsRes, swapsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/users/profile/me", { headers }),
          axios.get("http://localhost:8080/api/users/profile/items", { headers }),
          axios.get("http://localhost:8080/api/users/profile/swaps", { headers }),
        ]);

        setUser(userRes.data);
        setItems(itemsRes.data);
        setSwaps(swapsRes.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  const userItems = items.filter((item) => item.uploader === user._id);
  const completedSwaps = swaps.filter((s) => s.status === "completed");
  const pendingApproval = userItems.filter((i) => !i.approved);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        {/* Left Panel */}
        <div className="dashboard-left">
          <div className="card profile-card">
            <h3>Profile</h3>
            <p className="username">{user.name}</p>
            <p className="location">📍 {user.location}</p>
            <p className="joined">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="card actions-card">
            <h3>Quick Actions</h3>
            <button className="action green" onClick={() => navigate("/add-item")}>＋ Add New Item</button>
            <button className="action blue" onClick={() => navigate("/browse")}>🧺 Browse Items</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="dashboard-right">
          <div className="header">
            <h1>Welcome back, {user.name}!</h1>
            <p>Manage your sustainable wardrobe and track your swaps</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card green">
              <div className="value">{user.points ?? 0}</div>
              <div className="label">Points Balance</div>
            </div>
            <div className="stat-card blue">
              <div className="value">{userItems.length}</div>
              <div className="label">Items Listed</div>
            </div>
            <div className="stat-card purple">
              <div className="value">{completedSwaps.length}</div>
              <div className="label">Completed Swaps</div>
            </div>
            <div className="stat-card orange">
              <div className="value">{pendingApproval.length}</div>
              <div className="label">Pending Approval</div>
            </div>
          </div>

          <div className="card section">
            <div className="section-header">
              <h2>Your Items</h2>
              <button onClick={() => navigate("/add-item")} className="link-btn">Add Item</button>
            </div>
            {userItems.length === 0 ? (
              <div className="empty-box">
                📦 No items listed yet<br />
                <span className="link" onClick={() => navigate("/add-item")}>List your first item</span>
              </div>
            ) : (
              <ul className="list">
                {userItems.map((item) => (
                  <li key={item._id}>
                    <strong>{item.title}</strong> — {item.approved ? "Approved" : "Pending"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card section">
            <h2>Recent Swaps</h2>
            {swaps.length === 0 ? (
              <div className="empty-box">
                🔄 No swaps yet<br />
                <span className="link" onClick={() => navigate("/browse")}>Start browsing items</span>
              </div>
            ) : (
              <ul className="list">
                {swaps.map((swap) => (
                  <li key={swap._id}>
                    <strong>{swap.status}</strong> — {swap.message || "No message"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
