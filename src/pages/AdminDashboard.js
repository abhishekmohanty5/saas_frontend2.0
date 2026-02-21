import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, subscriptionAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    duration: '',
    features: ''
  });

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchData = React.useCallback(async () => {
    try {
      const [usersRes, plansRes] = await Promise.all([
        adminAPI.getAllUsers(),
        subscriptionAPI.getAllPlans()
      ]);
      setUsers(usersRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate, fetchData]);


  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createPlan({
        name: newPlan.name,
        price: parseFloat(newPlan.price),
        duration: parseInt(newPlan.duration),
        features: newPlan.features
      });
      alert('Plan created successfully!');
      setShowCreatePlan(false);
      setNewPlan({ name: '', price: '', duration: '', features: '' });
      fetchData();
    } catch (err) {
      if (err.response?.status === 409 ||
        (err.response?.status === 500 && err.message.includes('Duplicate'))) {
        alert('Failed to create plan: A plan with this name already exists.');
      } else {
        alert('Failed to create plan: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }
    try {
      await adminAPI.deletePlan(planId);
      alert('Plan deleted successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  if (loading) {
    return <div className="admin-dashboard"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')}>User View</button>
            <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-box">
            <h3>Total Users</h3>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-box">
            <h3>Total Plans</h3>
            <p className="stat-number">{plans.length}</p>
          </div>
          <div className="stat-box">
            <h3>Active Subscriptions</h3>
            <p className="stat-number">
              {users.filter(u => u.subscription?.status === 'ACTIVE').length}
            </p>
          </div>
        </div>

        {/* Plans Management */}
        <div className="admin-section">
          <div className="section-header">
            <h2>Subscription Plans</h2>
            <button
              className="btn-create"
              onClick={() => setShowCreatePlan(!showCreatePlan)}
            >
              {showCreatePlan ? 'Cancel' : '+ Create Plan'}
            </button>
          </div>

          {showCreatePlan && (
            <form className="create-plan-form" onSubmit={handleCreatePlan}>
              <input
                type="text"
                placeholder="Plan Name (e.g., BASIC)"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Duration (days)"
                value={newPlan.duration}
                onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                required
              />
              <textarea
                placeholder="Features (comma-separated)"
                value={newPlan.features}
                onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                required
              />
              <button type="submit" className="btn-submit">Create Plan</button>
            </form>
          )}

          <div className="plans-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id}>
                    <td>{plan.id}</td>
                    <td>{plan.name}</td>
                    <td>${plan.price}</td>
                    <td>{plan.duration} days</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Management */}
        <div className="admin-section">
          <h2>Users</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Subscription</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role?.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      {user.subscription ? (
                        <span className={`status-badge ${user.subscription.status?.toLowerCase()}`}>
                          {user.subscription.planName} - {user.subscription.status}
                        </span>
                      ) : (
                        <span className="no-sub">No subscription</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
