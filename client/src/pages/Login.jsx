import { useState } from 'react';
import { post } from '../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/AuthSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.user.language);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const labels = {
    login: language === 'en' ? 'Login' : 'Connexion',
    email: language === 'en' ? 'Email' : 'Email',
    password: language === 'en' ? 'Password' : 'Mot de Passe',
    submit: language === 'en' ? 'Login' : 'Connexion'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('/api/auth/login', { email, password });
      const response = request.data;
      
      if (request.status === 200) {
        if (response.user.role === 'admin') {
          dispatch(setUser(response.user)); 
          navigate('/admin');
        } else if (response.user.role === 'user') {
          dispatch(setUser(response.user)); 
          navigate('/');
        }
        
        toast.success(response.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>{labels.login}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{labels.submit}</button>
      </form>
    </div>
  );
}
