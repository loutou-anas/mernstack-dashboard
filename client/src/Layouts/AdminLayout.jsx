import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isAdmin={true} />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Outlet />  {/* This is important for rendering child routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
