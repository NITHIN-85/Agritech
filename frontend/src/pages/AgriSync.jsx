import React, { useState, useEffect } from 'react';
import { Truck, Wrench, Calendar, MapPin, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgriSync = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('equipment');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleBooking = async (item) => {
    const bookingData = {
      itemName: item.name,
      itemType: item.type || (activeTab === 'logistics' ? 'Logistics' : 'Machinery'),
      price: item.price,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        alert(`${item.name} booked successfully!`);
        fetchBookings();
      } else {
        const errorText = await response.text();
        alert(`Failed to create booking: ${response.status} ${errorText}`);
      }
    } catch (err) { 
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const equipment = [
    { id: 1, name: 'John Deere 8R 410', type: 'Tractor', price: 150, rating: 4.8, status: 'Available' },
    { id: 2, name: 'Case IH Axial-Flow', type: 'Combine Harvester', price: 300, rating: 4.9, status: 'In Use' },
    { id: 3, name: 'DJI Agras T40', type: 'Spraying Drone', price: 80, rating: 4.7, status: 'Available' },
    { id: 4, name: 'Mahindra Shaktiman', type: 'Rotavator', price: 45, rating: 4.6, status: 'Available' },
    { id: 5, name: 'Massey Ferguson 3-Bottom', type: 'Plough', price: 35, rating: 4.5, status: 'Available' },
    { id: 6, name: 'John Deere 1590', type: 'Seed Drill', price: 120, rating: 4.8, status: 'Available' },
    { id: 7, name: 'Punia Thresher', type: 'Thresher', price: 90, rating: 4.7, status: 'Available' },
  ];

  const logistics = [
    { id: 1, driver: 'Robert Fox', vehicle: 'Flatbed Truck', name: 'Robert Fox Transport', capacity: '10 Tons', price: 2.5, rating: 4.9 },
    { id: 2, driver: 'Jane Cooper', vehicle: 'Refrigerated Van', name: 'Jane Cooper Logistics', capacity: '5 Tons', price: 3.0, rating: 4.8 },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div className="badge">Logistics & Sharing</div>
        <h1>Agri<span className="text-gradient">Sync</span> Hub</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Rent heavy machinery and book verified transport for your harvest.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={`btn ${activeTab === 'equipment' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('equipment')}
            >
              <Wrench size={18} /> Machinery Rental
            </button>
            <button 
              className={`btn ${activeTab === 'logistics' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('logistics')}
            >
              <Truck size={18} /> Crop Transport
            </button>
          </div>

          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {activeTab === 'equipment' ? (
              equipment.map(e => (
                <div key={e.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="badge-sm">{e.type}</span>
                    <span style={{ color: e.status === 'Available' ? '#10B981' : '#F59E0B', fontSize: '0.8rem', fontWeight: 600 }}>
                      ● {e.status}
                    </span>
                  </div>
                  <h3>{e.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#F59E0B' }}>
                    <Star size={16} fill="#F59E0B" /> <span>{e.rating}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{e.price}</span>
                      <span style={{ color: 'var(--text-muted)' }}>/day</span>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleBooking(e)} disabled={e.status !== 'Available'}>Rent Now</button>
                  </div>
                </div>
              ))
            ) : (
              logistics.map(l => (
                <div key={l.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)' }}></div>
                    <div>
                      <h4 style={{ margin: 0 }}>{l.driver}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.vehicle}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><ShieldCheck size={14} color="#10B981" /> Verified Logistics Partner</p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}><MapPin size={14} /> Capacity: {l.capacity}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{l.price}</span>
                      <span style={{ color: 'var(--text-muted)' }}>/mile</span>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => handleBooking(l)}>Book Driver</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Bookings</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                  <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                  <p>No active rentals or bookings yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bookings.map(b => (
                    <div key={b.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>{b.itemType}</span>
                        <span className="badge-sm" style={{ fontSize: '0.6rem' }}>{b.status}</span>
                      </div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{b.itemName}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(b.bookingDate).toLocaleDateString()}</span>
                        <span style={{ fontWeight: 600 }}>₹{b.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h4 style={{ color: '#3B82F6', marginBottom: '0.5rem' }}>Pro Tip:</h4>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                Book transport at least 48 hours before harvest to ensure the best rates and availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriSync;
