import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AdminPanel.css';

export default function AdminPanel() {
  const { user, items, approveItem, rejectItem } = useApp();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('pending');

  if (!user || !user.isAdmin) {
    navigate('/dashboard');
    return null;
  }

  const pendingItems = items.filter(item => !item.approved);
  const approvedItems = items.filter(item => item.approved);
  const allItems = items;

  function getDisplayItems() {
    switch (selectedTab) {
      case 'pending':
        return pendingItems;
      case 'approved':
        return approvedItems;
      case 'all':
        return allItems;
      default:
        return pendingItems;
    }
  }

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
          <div className="stat-value">{allItems.length}</div>
          <div className="stat-label">Total Items</div>
        </div>
      </div>
      <div className="admin-panel-tabs">
        {[
          { key: 'pending', label: 'Pending Approval', count: pendingItems.length },
          { key: 'approved', label: 'Approved', count: approvedItems.length },
          { key: 'all', label: 'All Items', count: allItems.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={selectedTab === tab.key ? 'active' : ''}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
      <div className="admin-panel-list">
        {displayItems.length === 0 ? (
          <div className="empty-list">No items to display.</div>
        ) : (
          displayItems.map(item => (
            <div key={item.id} className="admin-item-card">
              <div className="admin-item-info">
                <div className="admin-item-title">{item.title}</div>
                <div className="admin-item-desc">{item.description}</div>
              </div>
              <div className="admin-item-actions">
                {!item.approved && (
                  <>
                    <button onClick={() => approveItem(item.id)} className="approve-btn">Approve</button>
                    <button onClick={() => rejectItem(item.id)} className="reject-btn">Reject</button>
                  </>
                )}
                {item.approved && <span className="approved-label">Approved</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
