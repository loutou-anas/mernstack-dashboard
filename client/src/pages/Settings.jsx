import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/AuthSlice';
import lightLogo from '../assets/icons8-sun-48.png'; // Updated light theme logo
import darkLogo from '../assets/icons8-moon-and-stars-48(1).png'; // Updated dark theme logo
import enFlag from '../assets/icons8-united-kingdom-48.png'; // Path to your English flag icon
import frFlag from '../assets/icons8-france-48.png'; // Path to your French flag icon

const Settings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const dispatch = useDispatch();
    const language = useSelector((state) => state.user.language);

    const handleThemeChange = (event) => {
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    };

    const handleLanguageChange = (event) => {
        dispatch(setLanguage(event.target.value));
    };

    return (
        <div className="settings-container">
            <h2>{language === 'en' ? 'Settings' : 'Paramètres'}</h2>

            <div className="settings-section">
                <h3>{language === 'en' ? 'Theme' : 'Thème'}</h3>
                <div className="theme-options">
                    <label>
                        <input 
                            type="radio" 
                            value="light" 
                            checked={theme === 'light'} 
                            onChange={handleThemeChange} 
                        />
                        <img src={lightLogo} alt="Light Theme" />
                        {language === 'en' ? 'Light' : 'Claire'}
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="dark" 
                            checked={theme === 'dark'} 
                            onChange={handleThemeChange} 
                        />
                        <img src={darkLogo} alt="Dark Theme" />
                        {language === 'en' ? 'Dark' : 'Sombre'}
                    </label>
                </div>
            </div>

            <div className="language-setting">
                <h3>{language === 'en' ? 'Language' : 'Langue'}</h3>
                <div className="language-options">
                    <label>
                        <input 
                            type="radio" 
                            value="en" 
                            checked={language === 'en'} 
                            onChange={handleLanguageChange} 
                        />
                        <img src={enFlag} alt="English" />
                        English
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="fr" 
                            checked={language === 'fr'} 
                            onChange={handleLanguageChange} 
                        />
                        <img src={frFlag} alt="Français" />
                        Français
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
