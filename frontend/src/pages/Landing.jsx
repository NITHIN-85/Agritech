import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Truck, Activity, ShieldCheck, ArrowRight, MousePointer2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page" style={{ background: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <div className="container" style={{ padding: '0 1rem' }}>
        <section className="hero-section" style={{ 
          borderRadius: '40px', 
          overflow: 'hidden',
          minHeight: '80vh',
          marginTop: '1rem',
          backgroundImage: `url('C:/Users/DELL/.gemini/antigravity/brain/37828d3f-c859-4e0b-99a2-7c4e52a7f411/harvest_hero_bg_1778006392932.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1
          }}></div>
          
          <div className="container hero-content animate-fade-in" style={{ zIndex: 2, padding: '4rem', color: 'white', maxWidth: '900px', margin: 0 }}>
            <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '2rem', padding: '0.5rem 1.5rem' }}>
              Announcing new Agricultural Features
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 500, lineHeight: 1.1, color: 'white', marginBottom: '2rem' }}>
              Driving Agricultural Evolution with Innovation
            </h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '500px', fontSize: '1.1rem', marginBottom: '3rem' }}>
              Driving the next generation of agriculture. Embracing cutting-edge technology and sustainable practices, we're cultivating a brighter future for farming and global food security.
            </p>
            <div className="hero-buttons" style={{ gap: '1.5rem' }}>
              <Link to="/signup" className="btn btn-primary btn-lg" style={{ background: '#d4f26e', color: '#1e293b', borderRadius: '100px', border: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Join now <div style={{ background: '#1e293b', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight size={16} /></div>
              </Link>
              <Link to="/marketplace" className="btn btn-glass btn-lg" style={{ background: 'white', color: '#1e293b', borderRadius: '100px', border: 'none' }}>
                Learn more
              </Link>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2, opacity: 0.8 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Scroll More</span>
            <div style={{ width: '20px', height: '30px', border: '2px solid white', borderRadius: '10px', display: 'flex', justifyContent: 'center', padding: '4px' }}>
              <div className="scroll-dot" style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%' }}></div>
            </div>
          </div>
        </section>
      </div>

      {/* Modules Section */}
      <section className="container modules-section" style={{ marginTop: '5rem' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '3rem' }}>Core <span className="text-gradient">Ecosystem</span></h2>
          <p>Four powerful pillars driving the future of agriculture.</p>
        </div>

        <div className="modules-grid">
          <div className="glass-card module-card">
            <div className="icon-wrapper green">
              <Leaf size={32} />
            </div>
            <h3>CropConnect</h3>
            <p>A decentralized marketplace where farmers list fresh produce directly for buyers, eliminating middle-men.</p>
            <Link to="/marketplace" className="card-link">Explore Marketplace →</Link>
          </div>

          <div className="glass-card module-card">
            <div className="icon-wrapper blue">
              <ShieldCheck size={32} />
            </div>
            <h3>TraceTide</h3>
            <p>End-to-end supply chain provenance. Every order is tracked from the farm soil to the delivery point.</p>
            <Link to="/login" className="card-link">Track Your Order →</Link>
          </div>

          <div className="glass-card module-card">
            <div className="icon-wrapper amber">
              <Activity size={32} />
            </div>
            <h3>AgritechHub</h3>
            <p>Advanced predictive yield analytics and farm management tools to help farmers optimize their crops.</p>
            <Link to="/harvest" className="card-link">Farmer Insights →</Link>
          </div>

          <div className="glass-card module-card">
            <div className="icon-wrapper purple">
              <TrendingUp size={32} />
            </div>
            <h3>AgriSync</h3>
            <p>Logistics and equipment sharing network that connects farmers with heavy machinery and transport services.</p>
            <Link to="/agrisync" className="card-link">Logistics Hub →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export default Landing;
