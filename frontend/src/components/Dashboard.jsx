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
      console.warn("No token found. Redirecting to login.");
      setLoading(false);
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    async function fetchData() {
      try {
        console.log("Fetching dashboard data...");

        // Use correct backend endpoints
        const [userRes, itemsRes, swapsRes] = await Promise.all([
          axios.get("http://localhost:8080/api/users/profile/me", { headers }),
          axios.get("http://localhost:8080/api/users/profile/items", {
            headers,
          }),
          axios.get("http://localhost:8080/api/users/profile/swaps", {
            headers,
          }),
        ]);

        console.log("User:", userRes.data);
        console.log("Items:", itemsRes.data);
        console.log("Swaps:", swapsRes.data);

        setUser(userRes.data);
        setItems(itemsRes.data);
        setSwaps(swapsRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  if (loading)
    return <div className="dashboard-loading">Loading dashboard...</div>;

  if (!user)
    return (
      <div className="dashboard-login">
        Please log in to access your dashboard.
      </div>
    );

  const userItems = items.filter((item) => item.uploader === user._id);
  const userSwaps = swaps.filter(
    (swap) =>
      swap.requester === user._id ||
      userItems.some((item) => item._id === swap.item)
  );

  const pendingApproval = userItems.filter((item) => !item.approved);
  const completedSwaps = userSwaps.filter(
    (swap) => swap.status === "completed"
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name || "User"}!</h1>
        <p>Manage your sustainable wardrobe and track your swaps</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card green">
          <div className="stat-value">{user.points ?? 0}</div>
          <div className="stat-label">Points Balance</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{userItems.length}</div>
          <div className="stat-label">Items Listed</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{completedSwaps.length}</div>
          <div className="stat-label">Completed Swaps</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">{pendingApproval.length}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
      </div>

      <div className="dashboard-profile">
        {user.avatar && (
          <img src={user.avatar} alt={user.name} className="dashboard-avatar" />
        )}
        <div className="dashboard-profile-info">
          <h3>{user.name}</h3>
          <p>{user.location}</p>
        </div>
      </div>

      <div className="dashboard-items">
        <h2>Your Items</h2>
        {userItems.length === 0 ? (
          <div className="empty-list">No items listed yet.</div>
        ) : (
          userItems.map((item) => (
            <div key={item._id} className="dashboard-item-card">
              <div className="dashboard-item-title">{item.title}</div>
              <div className="dashboard-item-desc">{item.description}</div>
              <div className="dashboard-item-status">
                {item.approved ? "Approved" : "Pending Approval"}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="dashboard-swaps">
        <h2>Your Swaps</h2>
        {userSwaps.length === 0 ? (
          <div className="empty-list">No swaps yet.</div>
        ) : (
          userSwaps.map((swap) => (
            <div key={swap._id} className="dashboard-swap-card">
              <div className="dashboard-swap-status">{swap.status}</div>
              <div className="dashboard-swap-message">
                {swap.message || "No message"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
