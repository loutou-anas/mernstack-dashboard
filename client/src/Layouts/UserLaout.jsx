import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../components/Sidebar.css';  // Correct way to import CSS
import Sidebar from '../components/Sidebar';  // Component import

const UserLayout = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState(JSON.parse(localStorage.getItem('widgets')) || []);
  const [dashboardLayout, setDashboardLayout] = useState(localStorage.getItem('dashboardLayout') || 'default');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if the user is not logged in
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
    setWidgets(savedWidgets);
  }, []);

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout') || 'default';
    setDashboardLayout(savedLayout);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      {user && <Sidebar isAdmin={user.role === 'admin'} />}  {/* Render Sidebar only if user exists */}
      <div className={`dashboard-container ${dashboardLayout}`} style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        {widgets.filter(widget => widget.enabled).map(widget => (
          <div key={widget.id} className="widget-container">
            {/* Widget Component Render Based on Widget ID */}
            <h3>{widget.name} Widget</h3>
          </div>
        ))}
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
