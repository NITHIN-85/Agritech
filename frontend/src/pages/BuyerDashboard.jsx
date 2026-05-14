import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Truck, IndianRupee, Package } from 'lucide-react';

const BuyerDashboard = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingData, setTrackingData] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders for user ID:", user.id);
      const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched orders:", data);
        if (!Array.isArray(data)) {
          console.error("Orders response is not an array:", data);
          setOrders([]);
        } else {
          setOrders(data);
        }
      } else {
        console.error("Failed to fetch orders:", response.status, response.statusText);
        if (response.status === 403) {
          console.error("403 Forbidden: Check if the token is valid and has correct permissions.");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await fetch(`http://localhost:8080/api/tracking/order/${order.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTrackingData(data);
      } else {
        // Mock tracking if none exists for demo
        setTrackingData([
          { id: 1, status: 'ORDERED', location: 'Farmer Store', timestamp: order.orderDate || new Date().toISOString() },
          { id: 2, status: 'PACKED', location: 'Regional Warehouse', timestamp: new Date().toISOString() },
          { id: 3, status: 'SHIPPED', location: 'In Transit', timestamp: new Date().toISOString() }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Buyer <span className="text-gradient">Dashboard</span></h1>
        <button className="btn btn-outline" onClick={fetchOrders} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="product-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px' }}><ShoppingBag color="#3B82F6" /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Orders</p>
            <h3 style={{ margin: 0 }}>{orders.length}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px' }}><Truck color="#10B981" /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>In Transit</p>
            <h3 style={{ margin: 0 }}>{orders.filter(o => o.status !== 'DELIVERED').length}</h3>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px' }}><IndianRupee color="#F59E0B" /></div>
          <div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Spent</p>
            <h3 style={{ margin: 0 }}>₹{orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0).toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Order History</h3>
        {loading ? <p>Loading orders...</p> : (
          orders.length === 0 ? <p>No orders found. Visit the marketplace to start shopping!</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>Product</th>
                    <th style={{ padding: '1rem' }}>Quantity</th>
                    <th style={{ padding: '1rem' }}>Total</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>#{order.id}</td>
                      <td style={{ padding: '1rem' }}>{order.product?.name || 'Product'}</td>
                      <td style={{ padding: '1rem' }}>{order.quantity}</td>
                      <td style={{ padding: '1rem' }}>₹{(order.totalPrice || 0).toFixed(2)}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '20px', 
                          fontSize: '0.875rem',
                          background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: order.status === 'DELIVERED' ? '#10B981' : '#3B82F6'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Link to={`/track/${order.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none' }}>Track</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Tracking Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Supply Chain Tracking <span className="text-gradient">#{selectedOrder.id}</span></h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            <div style={{ position: 'relative', paddingLeft: '2.5rem', marginTop: '2rem' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'var(--border-color)' }}></div>
              
              {trackingData.map((item, index) => (
                <div key={item.id || index} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                  {/* Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-32px', 
                    top: '5px', 
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: index === trackingData.length - 1 ? 'var(--accent-color)' : 'var(--border-color)',
                    border: '4px solid var(--panel-bg)',
                    boxShadow: index === trackingData.length - 1 ? '0 0 10px var(--accent-color)' : 'none',
                    zIndex: 1
                  }}></div>
                  
                  <div>
                    <h4 style={{ margin: 0, color: index === trackingData.length - 1 ? 'var(--accent-color)' : 'inherit' }}>{item.status}</h4>
                    <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.location}</p>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
