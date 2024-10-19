import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { post } from './services/ApiEndPoint';
import { useSelector } from 'react-redux';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role is 'user'

  const language = useSelector((state) => state.user.language);

  const labels = {
    register: language === 'en' ? 'Register' : 'Inscrire',
    username: language === 'en' ? 'Username' : 'Nom d\'utilisateur',
    email: language === 'en' ? 'Email' : 'Email',
    password: language === 'en' ? 'Password' : 'Mot de Passe',
    role: language === 'en' ? 'Role' : 'Rôle',
    user: language === 'en' ? 'User' : 'Utilisateur',
    admin: language === 'en' ? 'Admin' : 'Administrateur',
    submit: language === 'en' ? 'Register' : 'Inscrire'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const request = await post('/api/auth/register', { name, email, password, role });
      const response = request.data;

      if (request.status === 201) {
        toast.success(response.message);
        setEmail('');
        setName('');
        setPassword('');
        setRole('user'); // Reset role to default
      } else {
        toast.error(request.data.message);
      }
      console.log(response.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>{labels.register}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">{labels.username}:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">{labels.email}:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">{labels.password}:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">{labels.role}:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">{labels.user}</option>
            <option value="admin">{labels.admin}</option>
          </select>
        </div>
        <button type="submit">{labels.submit}</button>
      </form>
    </div>
  );
}
