import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [activeList, setActiveList] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);

    if (!token) {
      console.warn("No token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        console.log("Request headers:", headers);

        const userRes = await axios.get(
          "http://localhost:8080/api/users/profile/me",
          {
            headers,
          }
        );
        console.log("User data fetched:", userRes.data);
        setUser(userRes.data);

        // if (userRes.data.role !== "admin") {
        //   console.warn("User is not admin. Redirecting to dashboard...");
        //   navigate("/dashboard");
        //   return;
        // }

        const itemsRes = await axios.get("http://localhost:8080/api/items", {
          headers,
        });
        console.log("Fetched items:", itemsRes.data);
        setItems(itemsRes.data);
      } catch (error) {
        console.error("Error loading admin data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch users from backend
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers,
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("http://localhost:8080/api/swaps", {
        headers,
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch listings from backend
  const fetchListings = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await axios.get("http://localhost:8080/api/items", {
        headers,
      });
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  // Accept/approve item
  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/items/${id}`,
        { approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Reject/delete item
  const handleReject = async (id) => {
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

  // Show only the relevant list for each button
  const handleManageUsers = async () => {
    await fetchUsers();
    setActiveList("users");
  };
  const handleManageOrders = async () => {
    await fetchOrders();
    setActiveList("orders");
  };
  const handleManageListings = async () => {
    await fetchListings();
    setActiveList("listings");
  };

  // Filter items by search term
  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-panel-loading">Loading...</div>;

  return (
    <div className="admin-sketch-bg">
      <div className="admin-sketch-window">
        <div className="admin-sketch-title">Admin Panel</div>
        <div className="admin-sketch-topbar">
          <input
            className="admin-sketch-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="admin-sketch-tabs">
          <button className="admin-sketch-tab" onClick={handleManageUsers}>
            Manage User
          </button>
          <button className="admin-sketch-tab" onClick={handleManageOrders}>
            Manage Orders
          </button>
          <button className="admin-sketch-tab" onClick={handleManageListings}>
            Manage Listings
          </button>
        </div>
        <div className="admin-sketch-section">Manage Users</div>
        {activeList === "users" && (
          <div className="admin-sketch-list">
            {users.length === 0 ? (
              <div className="empty-list">No users to display.</div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="admin-sketch-row">
                  <div className="admin-sketch-avatar"></div>
                  <div className="admin-sketch-details">
                    <div className="admin-sketch-details-title">
                      {user.name}
                    </div>
                    <div className="admin-sketch-details-desc">
                      {user.email}
                    </div>
                  </div>
                  <div className="admin-sketch-actions">
                    <button className="admin-sketch-action">Edit</button>
                    <button className="admin-sketch-action">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="admin-sketch-section">Manage Orders</div>
        {activeList === "orders" && (
          <div className="admin-sketch-list">
            {orders.length === 0 ? (
              <div className="empty-list">No orders to display.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="admin-sketch-row">
                  <div className="admin-sketch-avatar"></div>
                  <div className="admin-sketch-details">
                    <div className="admin-sketch-details-title">
                      Order #{order._id}
                    </div>
                    <div className="admin-sketch-details-desc">
                      Status: {order.status}
                    </div>
                  </div>
                  <div className="admin-sketch-actions">
                    <button className="admin-sketch-action">Accept</button>
                    <button className="admin-sketch-action">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        <div className="admin-sketch-section">Manage Listings</div>
        {activeList === "listings" && (
          <div className="admin-sketch-list">
            {items.length === 0 ? (
              <div className="empty-list">No listings to display.</div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="admin-sketch-row">
                  <div className="admin-sketch-avatar"></div>
                  <div className="admin-sketch-details">
                    <div className="admin-sketch-details-title">
                      {item.title}
                    </div>
                    <div className="admin-sketch-details-desc">
                      {item.description}
                    </div>
                  </div>
                  <div className="admin-sketch-actions">
                    <button className="admin-sketch-action">Accept</button>
                    <button className="admin-sketch-action">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
