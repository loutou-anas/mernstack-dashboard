import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { get, put, delet } from '../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import '../components/Admin.css'; // Import the CSS file

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const loggedInUser = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.user.language);

  const labels = {
    manageUsers: language === 'en' ? 'Manage Users' : 'Gestions Les Utilisateurs',
    searchPlaceholder: language === 'en' ? 'Search by username or email' : 'Rechercher par nom d\'utilisateur ou e-mail',
    editUser: language === 'en' ? 'Edit User' : 'Modifier Les Utilisateurs',
    username: language === 'en' ? 'Username' : 'Nom d\'utilisateur',
    email: language === 'en' ? 'Email' : 'Email',
    password: language === 'en' ? 'Password' : 'Mot de Passe',
    update: language === 'en' ? 'Update' : 'Modifier',
    cancel: language === 'en' ? 'Cancel' : 'Annuler',
    actions: language === 'en' ? 'Actions' : 'Actions',
    delete: language === 'en' ? 'Delete' : 'Supprimer',
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const request = await get('/api/admin/admin');
        const response = request.data;
        setUsers(response.users);
        setFilteredUsers(response.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this user?');

    if (!userConfirmed) {
      return; // If the admin cancels, do nothing
    }

    try {
      const request = await delet(`/api/admin/deletuser/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter(user => user._id !== id));
        setFilteredUsers(filteredUsers.filter(user => user._id !== id));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    try {
      const request = await put(`/api/admin/updateuser/${currentUser._id}`, formData);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.map(user => user._id === currentUser._id ? response.user : user));
        setFilteredUsers(filteredUsers.map(user => user._id === currentUser._id ? response.user : user));
        setEditMode(false);
        setCurrentUser(null);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-container">
      <h2>{labels.manageUsers}</h2>
      <input
        type="text"
        placeholder={labels.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {editMode ? (
        <div className="edit-user">
          <h3>{labels.editUser}</h3>
          <form>
            <div className="input-group">
              <label htmlFor="name">{labels.username}</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={labels.username}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">{labels.email}</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={labels.email}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">{labels.password}</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={labels.password}
                className="input-field"
              />
            </div>
            <div className="button-group">
              <button type="button" onClick={handleUpdate} className="update-button">{labels.update}</button>
              <button type="button" onClick={() => setEditMode(false)} className="cancel-button">{labels.cancel}</button>
            </div>
          </form>
        </div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>{labels.username}</th>
              <th>{labels.email}</th>
              <th>{labels.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="action-buttons">
                  {loggedInUser._id === user._id ? (
                    <button className="edit-button" onClick={() => handleEdit(user)}>{labels.update}</button>
                  ) : user.role !== 'admin' ? (
                    <>
                      <button className="edit-button" onClick={() => handleEdit(user)}>{labels.update}</button>
                      <button className="delete-button" onClick={() => handleDelete(user._id)}>{labels.delete}</button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
