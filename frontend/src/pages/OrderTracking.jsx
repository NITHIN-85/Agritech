import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Package, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTracking();
  }, [orderId]);

  const fetchTracking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/tracking/order/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by timestamp descending (newest first)
        setTrackingData(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      }
    } catch (err) {
      console.error("Error fetching tracking:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toUpperCase()) {
      case 'PLACED': return <Clock className="text-blue-500" />;
      case 'PACKED': return <Package className="text-orange-500" />;
      case 'SHIPPED': return <Truck className="text-purple-500" />;
      case 'IN_TRANSIT': return <Truck className="text-yellow-500" />;
      case 'DELIVERED': return <CheckCircle className="text-green-500" />;
      default: return <Clock />;
    }
  };

  const getStepStatus = (status) => {
    // This logic determines if a step is completed or current
    const statuses = ['PLACED', 'PACKED', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'];
    const currentStatusIndex = trackingData.length > 0 ? statuses.indexOf(trackingData[0].status.toUpperCase()) : 0;
    
    return statuses.map((s, index) => ({
      name: s,
      completed: index <= currentStatusIndex,
      current: index === currentStatusIndex
    }));
  };

  const steps = getStepStatus();

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px' }}>
      <Link to="/buyer-dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>TraceTide Tracking</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Order ID: #{orderId}</p>

        {/* Visual Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '5%', 
            right: '5%', 
            height: '4px', 
            background: 'rgba(0,0,0,0.05)',
            zIndex: 0
          }}></div>
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '5%', 
            width: `${(steps.filter(s => s.completed).length - 1) * 25}%`, 
            height: '4px', 
            background: 'var(--primary)',
            transition: 'width 1s ease',
            zIndex: 0
          }}></div>

          {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: '20%' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: step.completed ? 'var(--primary)' : 'var(--bg-card)',
                border: step.current ? '2px solid white' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                boxShadow: step.current ? '0 0 15px var(--primary)' : 'none'
              }}>
                {step.completed ? <CheckCircle size={20} color="white" /> : <Clock size={20} color="gray" />}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: step.current ? 'bold' : 'normal', textAlign: 'center' }}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Detailed Timeline */}
        <div style={{ marginTop: '3rem' }}>
          <h3>Tracking History</h3>
          <div style={{ marginTop: '1.5rem', borderLeft: '2px solid rgba(0,0,0,0.05)', paddingLeft: '2rem' }}>
            {loading ? (
              <p>Loading tracking data...</p>
            ) : trackingData.length === 0 ? (
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <p>Order is being processed at the farm. Check back soon for shipping updates.</p>
              </div>
            ) : (
              trackingData.map((update, index) => (
                <div key={update.id} style={{ position: 'relative', marginBottom: '2rem' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '-2.7rem', 
                    top: '0', 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    background: index === 0 ? 'var(--primary)' : 'gray' 
                  }}></div>
                  <div className="glass-panel" style={{ padding: '1.5rem', background: index === 0 ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getStatusIcon(update.status)} {update.status}
                        </h4>
                        <p style={{ margin: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                          <MapPin size={14} /> {update.location}
                        </p>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(update.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
