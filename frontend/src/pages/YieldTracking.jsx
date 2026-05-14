import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const YieldTracking = () => {
  const [yields, setYields] = useState([]);
  const [cropName, setCropName] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchYields();
  }, [user, navigate]);

  const fetchYields = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/yields/user/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setYields(data);
      }
    } catch (error) {
      console.error('Error fetching yields:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/yields/user/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cropName,
          quantityKg: parseFloat(quantityKg),
          harvestDate,
        }),
      });

      if (response.ok) {
        setCropName('');
        setQuantityKg('');
        setHarvestDate('');
        fetchYields(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding yield:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h2>Yield Tracking</h2>
      <p>Welcome back, {user.name}! Track your harvests here.</p>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3>Log New Harvest</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
            <div>
              <label>Crop Name</label>
              <input type="text" value={cropName} onChange={(e) => setCropName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>Quantity (Kg)</label>
              <input type="number" step="0.1" value={quantityKg} onChange={(e) => setQuantityKg(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div>
              <label>Harvest Date</label>
              <input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <button type="submit" className="btn btn-outline" style={{ background: '#10B981', color: 'white', border: 'none' }}>Save Yield</button>
          </form>
        </div>

        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3>Your Logged Yields</h3>
          {yields.length === 0 ? (
            <p>No yields logged yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Crop</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Quantity (Kg)</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {yields.map((y) => (
                  <tr key={y.id}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{y.cropName}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{y.quantityKg}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{y.harvestDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldTracking;
