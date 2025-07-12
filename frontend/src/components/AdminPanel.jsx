import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const userRes = await axios.get("http://localhost:8080/api/users/me", {
          headers,
        });
        setUser(userRes.data);

        if (!userRes.data.isAdmin) {
          navigate("/dashboard");
          return;
        }

        const itemsRes = await axios.get("http://localhost:8080/api/items", {
          headers,
        });
        setItems(itemsRes.data);
      } catch (error) {
        console.error("Error loading admin data:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const approveItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/items/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, approved: true } : item
        )
      );
    } catch (error) {
      console.error("Error approving item:", error);
    }
  };

  const rejectItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error rejecting item:", error);
    }
  };

  const pendingItems = items.filter((item) => !item.approved);
  const approvedItems = items.filter((item) => item.approved);

  const getDisplayItems = () => {
    switch (selectedTab) {
      case "pending":
        return pendingItems;
      case "approved":
        return approvedItems;
      case "all":
        return items;
      default:
        return pendingItems;
    }
  };

  const displayItems = getDisplayItems();

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h1>Admin Panel</h1>
        <p>Moderate and manage platform content</p>
      </div>
      <div className="admin-panel-stats">
        <div className="stat-card yellow">
          <div className="stat-value">{pendingItems.length}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{approvedItems.length}</div>
          <div className="stat-label">Approved Items</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Total Items</div>
        </div>
      </div>
      <div className="admin-panel-tabs">
        {[
          {
            key: "pending",
            label: "Pending Approval",
            count: pendingItems.length,
          },
          { key: "approved", label: "Approved", count: approvedItems.length },
          { key: "all", label: "All Items", count: items.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={selectedTab === tab.key ? "active" : ""}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <div className="admin-panel-list">
        {displayItems.length === 0 ? (
          <div className="empty-list">No items to display.</div>
        ) : (
          displayItems.map((item) => (
            <div key={item._id} className="admin-item-card">
              <div className="admin-item-info">
                <div className="admin-item-title">{item.title}</div>
                <div className="admin-item-desc">{item.description}</div>
              </div>
              <div className="admin-item-actions">
                {!item.approved ? (
                  <>
                    <button
                      onClick={() => approveItem(item._id)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectItem(item._id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="approved-label">Approved</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
