import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { X, Edit3, LogOut } from 'lucide-react';

const AdminDashboard = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('portfolio_admin') === 'true';
    setIsAdmin(loggedIn);
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password for now
      localStorage.setItem('portfolio_admin', 'true');
      setIsAdmin(true);
      window.location.reload(); // Refresh to show edit buttons
    } else {
      alert('Wrong password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin');
    setIsAdmin(false);
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay">
      <div className="admin-modal animate-scale-in">
        <button className="admin-close" onClick={onClose}><X size={24} /></button>
        
        {!isAdmin ? (
          <div className="admin-login">
            <h2 className="admin-title">Owner Login</h2>
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                className="admin-input" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn-coral w-full">Login</button>
            </form>
          </div>
        ) : (
          <div className="admin-panel">
            <h2 className="admin-title">Admin Dashboard</h2>
            <p className="admin-status">Logged in as Owner</p>
            
            <div className="admin-actions">
              <button className="admin-action-btn" onClick={onClose}>
                <Edit3 size={20} /> Enable Editing
              </button>
              <button className="admin-action-btn admin-action-btn--danger" onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </button>
            </div>
            
            <div className="admin-tip">
              Tip: When editing is enabled, hover over sections to see edit controls.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
