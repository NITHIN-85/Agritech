import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!user) {
      alert("Please sign in to checkout");
      return;
    }
    setIsCheckingOut(true);
    
    const orderRequests = [];
    const itemMap = new Map();
    
    cartItems.forEach(item => {
      if (itemMap.has(item.id)) {
        itemMap.set(item.id, itemMap.get(item.id) + 1);
      } else {
        itemMap.set(item.id, 1);
      }
    });
    
    itemMap.forEach((quantity, productId) => {
      orderRequests.push({ userId: user.id, productId, quantity });
    });

    fetch('http://localhost:8080/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderRequests),
    })
      .then(async res => {
        console.log("Checkout response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Checkout failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Checkout success data:", data);
        alert('Order placed successfully!');
        setCartItems([]);
        setIsCartOpen(false);
        navigate('/buyer-dashboard');
      })
      .catch(err => {
        console.error("Checkout error:", err);
        alert(err.message || 'Error placing order.');
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.append('name', search);
    if (unitFilter) query.append('unit', unitFilter);
    if (maxPrice) query.append('maxPrice', maxPrice);

    fetch(`http://localhost:8080/api/products?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [search, unitFilter, maxPrice]);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 2rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>CropConnect <span className="text-gradient">Marketplace</span></h2>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-outline" onClick={() => setIsCartOpen(!isCartOpen)}>
            <ShoppingCart size={20} />
            Cart ({cartItems.length})
          </button>
          {/* Cart Dropdown */}
          {isCartOpen && (
            <div className="glass-panel" style={{ 
              position: 'absolute', 
              top: '100%', 
              right: 0, 
              marginTop: '0.5rem',
              width: '300px', 
              zIndex: 10,
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Cart</h3>
              {cartItems.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Cart is empty</p>
              ) : (
                <>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                    {cartItems.map((item, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{item.name}</span>
                        <span>₹{item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span>₹{cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.75rem' }}
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search crops..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control" 
            style={{ paddingLeft: '40px', width: '100%' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select 
            className="form-control" 
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            style={{ padding: '0.5rem 1rem' }}
          >
            <option value="">All Units</option>
            <option value="kg">Per KG</option>
            <option value="ton">Per Ton</option>
            <option value="ear">Per Ear</option>
          </select>
          <input 
            type="number" 
            placeholder="Max Price" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="form-control" 
            style={{ width: '120px', padding: '0.5rem 1rem' }} 
          />
        </div>
      </div>
      
      {loading ? (
        <p>Loading market data...</p>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products available currently.</p>
          ) : (
            products.map(product => (
              <div key={product.id} className="glass-panel product-card">
                <div className="badge">{product.farmer?.name || 'Local Farmer'}</div>
                <h3>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', flexGrow: 1 }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="product-price">₹{product.price.toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {product.unit}</span></span>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
