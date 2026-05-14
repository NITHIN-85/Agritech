import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Sprout, Landmark, TrendingUp, Cloud, Sun, CloudRain, Map, Navigation, BrainCircuit } from 'lucide-react';

const FarmerDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  

  
  // Dashboard State
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [products, setProducts] = useState([]);
  const [farmerOrders, setFarmerOrders] = useState([]);
  
  // UI State
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  // Form Data State
  const [farmData, setFarmData] = useState({ farmName: '', location: '', size: '' });
  const [cropData, setCropData] = useState({ cropName: '', season: '', quantity: '', expectedYield: '', actualYield: '' });
  const [productData, setProductData] = useState({ name: '', price: '', unit: 'kg', availableQuantity: '' });

  // Production data for Donut Chart
  const productionData = [
    { name: 'Harvested', value: crops.reduce((acc, c) => acc + (c.actualYield || 0), 0) || 270, color: '#F59E0B' },
    { name: 'Waste', value: 30, color: '#8B5CF6' }
  ];

  const financialStats = {
    revenue: crops.reduce((acc, c) => acc + (c.actualYield || 0) * 2, 0) || 4500,
    expense: crops.reduce((acc, c) => acc + (c.quantity || 0) * 1.5, 0) || 2800,
  };
  const netProfit = financialStats.revenue - financialStats.expense;

  useEffect(() => {
    if (user) {
      console.log("Current User Data:", user);
      fetchFarms();
      fetchFarmerProducts();
      fetchFarmerOrders();
    }
  }, [user]);

  const fetchFarms = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/farms/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFarms(data);
        if (data.length > 0) {
          setSelectedFarmId(data[0].id);
          fetchCrops(data[0].id);
        }
      }
    } catch (err) { console.error(err); }
  };

  const fetchCrops = async (farmId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/crops/farm/${farmId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCrops(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchFarmerProducts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/products?location=${user.location}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.filter(p => p.farmer?.id === user.id));
      }
    } catch (err) { console.error(err); }
  };

  const fetchFarmerOrders = async () => {
    try {
      // Fetching orders for products owned by this farmer
      const response = await fetch(`http://localhost:8080/api/orders/farmer/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFarmerOrders(data); 
      }
    } catch (err) { console.error(err); }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...farmData,
        size: parseFloat(farmData.size)
      };
      
      const response = await fetch(`http://localhost:8080/api/farms/user/${user.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.ok) {
        setShowFarmForm(false);
        setFarmData({ farmName: '', location: '', size: '' });
        fetchFarms();
        alert('Farm saved successfully!');
      } else {
        const errorText = await response.text();
        alert(`Failed to save farm: ${response.status} ${errorText}`);
      }
    } catch (err) { 
      console.error(err);
      alert('Error connecting to server. Please ensure the backend is running.');
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...cropData,
        quantity: parseFloat(cropData.quantity),
        expectedYield: parseFloat(cropData.expectedYield),
        actualYield: cropData.actualYield ? parseFloat(cropData.actualYield) : 0
      };

      const response = await fetch(`http://localhost:8080/api/crops/farm/${selectedFarmId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      if (response.ok) {
        setShowCropForm(false);
        setCropData({ cropName: '', season: '', quantity: '', expectedYield: '', actualYield: '' });
        fetchCrops(selectedFarmId);
        alert('Crop added successfully!');
      } else {
        const errorText = await response.text();
        alert(`Failed to add crop: ${response.status} ${errorText}`);
      }
    } catch (err) { 
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const handleListProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      ...productData,
      price: parseFloat(productData.price),
      availableQuantity: parseInt(productData.availableQuantity),
      farmer: user,
      cropId: selectedCrop.id,
      status: 'AVAILABLE'
    };
    try {
      const response = await fetch(`http://localhost:8080/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct)
      });
      if (response.ok) {
        setShowProductForm(false);
        setProductData({ name: '', price: '', unit: 'kg', availableQuantity: '' });
        fetchFarmerProducts();
      }
    } catch (err) { console.error(err); }
  };

  const handleStartPrediction = () => {
    navigate('/analytics');
  };

  // Logic to determine chart data: Use real crop data if available, otherwise use mock data for demo
  const chartData = crops.length > 0 
    ? crops.map(c => ({ month: c.season || 'Season', yield: c.actualYield || c.expectedYield }))
    : [
        { month: 'Jan', yield: 110 },
        { month: 'Feb', yield: 135 },
        { month: 'Mar', yield: 120 },
        { month: 'Apr', yield: 160 },
        { month: 'May', yield: 155 },
        { month: 'Jun', yield: 175 },
        { month: 'Jul', yield: 165 },
      ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Farmer <span className="text-gradient">Dashboard</span></h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--primary)' }} 
            onClick={handleStartPrediction}
          >
            <BrainCircuit size={18} color="var(--primary)" /> 
            View AI Insights
          </button>


          <button className="btn btn-outline" onClick={() => setShowFarmForm(true)}><Plus size={18} /> Add Farm</button>
          <button className="btn btn-primary" onClick={() => setShowCropForm(true)} disabled={farms.length === 0}><Sprout size={18} /> Add Crop</button>
        </div>
      </div>

      {/* Financial Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Crop Details List (Simplified) */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Crop Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {crops.length > 0 ? crops.slice(0,3).map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span>{c.cropName}</span>
                <span style={{ fontWeight: 600 }}>{c.size || 12}ac</span>
              </div>
            )) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>Cotton</span> <span style={{ fontWeight: 600 }}>12ac</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span>Sugarcane</span> <span style={{ fontWeight: 600 }}>12ac</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Total Production Donut */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Total Production</h3>
          <div style={{ height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productionData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem' }}>
            <span>● Harvested</span>
            <span>● Waste</span>
          </div>
        </div>

        {/* Profit/Loss Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Profit/Loss</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span>Revenue</span>
                <span>₹{financialStats.revenue}</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '85%', background: 'linear-gradient(90deg, #8B5CF6, #6366F1)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span>Expense</span>
                <span>₹{financialStats.expense}</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)', borderRadius: '10px' }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span>Net Profit</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>₹{netProfit}</span>
              </div>
              <div style={{ height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '45%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Widgets Row: Satellite View & Weather */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Satellite View */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Satellite View</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ fontSize: '0.7rem' }}>Live</span>
              <Navigation size={16} color="var(--primary)" />
            </div>
          </div>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '240px' }}>
            <iframe 
              title="Farm Location"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              allowFullScreen 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1714923456789!5m2!1sen!2sin&maptype=satellite"
            ></iframe>
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', pointerEvents: 'none' }}>
              Lat: 12.9716° N, Lon: 77.5946° E
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Weather</h3>
            <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <Sun size={48} color="#F59E0B" />
            <div>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>24°C</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Mostly Sunny</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>Weekly Forecast</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {[
                { day: 'Mon', temp: '22°', icon: <Sun size={18} color="#F59E0B" /> },
                { day: 'Tue', temp: '24°', icon: <Sun size={18} color="#F59E0B" /> },
                { day: 'Wed', temp: '21°', icon: <Cloud size={18} color="#94A3B8" /> },
                { day: 'Thu', temp: '19°', icon: <CloudRain size={18} color="#3B82F6" /> },
                { day: 'Fri', temp: '23°', icon: <Sun size={18} color="#F59E0B" /> },
              ].map((w, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.day}</span>
                  {w.icon}
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{w.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Farm List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Farms</h3>
          {farms.length === 0 ? <p>No farms added yet.</p> : (
            farms.map(f => (
              <div 
                key={f.id} 
                onClick={() => { setSelectedFarmId(f.id); fetchCrops(f.id); }}
                style={{ 
                  padding: '1rem', 
                  borderRadius: '8px', 
                  background: selectedFarmId === f.id ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  border: selectedFarmId === f.id ? '1px solid var(--accent-color)' : '1px solid transparent',
                  marginBottom: '0.5rem'
                }}
              >
                <h4 style={{ margin: 0 }}>{f.farmName}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f.location} • {f.size} Acres</p>
              </div>
            ))
          )}
        </div>

        {/* Analytics Section */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Harvest Details</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  domain={[0, 220]}
                  ticks={[0, 100, 140, 180, 220]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorYield)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Orders and Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Orders to Fulfill</h3>
          {farmerOrders.length === 0 ? <p>No active orders.</p> : (
            farmerOrders.map(o => (
              <div key={o.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{o.product.name} (x{o.quantity})</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Buyer ID: {o.buyer?.id}</p>
                </div>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>{o.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Marketplace Listings</h3>
          {crops.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quick List from Crops:</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {crops.map(c => (
                  <button 
                    key={c.id} 
                    className="btn btn-outline" 
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => { setSelectedCrop(c); setProductData({...productData, name: c.cropName, availableQuantity: c.actualYield || c.quantity}); setShowProductForm(true); }}
                  >
                    List {c.cropName}
                  </button>
                ))}
              </div>
            </div>
          )}
          {products.length === 0 ? <p>No products listed yet.</p> : (
            products.map(p => (
              <div key={p.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{p.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{p.price}/{p.unit} • Qty: {p.availableQuantity}</p>
                </div>
                <span className="badge">{p.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Forms Modals */}
      {showFarmForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <h3>Add New Farm</h3>
            <form onSubmit={handleAddFarm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input 
                type="text" 
                placeholder="Farm Name (e.g. Orange Farm)" 
                value={farmData.farmName} 
                onChange={e => setFarmData({...farmData, farmName: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <input 
                type="text" 
                placeholder="Location (e.g. Ballari)" 
                value={farmData.location} 
                onChange={e => setFarmData({...farmData, location: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <input 
                type="number" 
                placeholder="Size (Acres)" 
                value={farmData.size} 
                onChange={e => setFarmData({...farmData, size: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowFarmForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Farm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCropForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <h3>Add Crop to {farms.find(f => f.id === selectedFarmId)?.farmName}</h3>
            <form onSubmit={handleAddCrop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input 
                type="text" 
                placeholder="Crop Name (e.g. Wheat)" 
                value={cropData.cropName} 
                onChange={e => setCropData({...cropData, cropName: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <input 
                type="text" 
                placeholder="Season (e.g. Kharif)" 
                value={cropData.season} 
                onChange={e => setCropData({...cropData, season: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <input 
                type="number" 
                placeholder="Quantity (Seedlings/Kg)" 
                value={cropData.quantity} 
                onChange={e => setCropData({...cropData, quantity: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <input 
                type="number" 
                placeholder="Expected Yield (Kg)" 
                value={cropData.expectedYield} 
                onChange={e => setCropData({...cropData, expectedYield: e.target.value})} 
                required 
                className="form-control" 
                style={{ background: 'white', color: 'black' }}
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowCropForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Crop</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem' }}>
            <h3>List {selectedCrop?.cropName} in Marketplace</h3>
            <form onSubmit={handleListProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Product Name" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} required className="form-control" />
              <input type="number" placeholder="Price per Unit" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required className="form-control" />
              <select className="form-control" value={productData.unit} onChange={e => setProductData({...productData, unit: e.target.value})}>
                <option value="kg">Per KG</option>
                <option value="ton">Per Ton</option>
                <option value="ear">Per Ear</option>
              </select>
              <input type="number" placeholder="Available Quantity" value={productData.availableQuantity} onChange={e => setProductData({...productData, availableQuantity: e.target.value})} required className="form-control" />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowProductForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>List Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
