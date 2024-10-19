import { useSelector } from 'react-redux';

export default function Home() {
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.user.language);

  return (
    <>
      <div className="home-container">
        <div className="user-card">
          <h2>{language === 'en' ? 'Welcome' : 'Bienvenue'}, {user && user.name}!</h2>
        </div>
      </div>
    </>
  );
}
