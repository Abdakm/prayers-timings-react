import './toggle.css';
import { FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from 'react';

export default function Toggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setIsDarkMode(theme === 'dark');
      document.body.className = theme
    }
  }, []);

  const handleToggle = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme; // Optionally, apply the theme to the body element
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        checked={isDarkMode}
        onChange={handleToggle}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <FaMoon fontSize='70px' className='fa fa-moon'/>
        <FaSun fontSize='70px' className='fa fa-sun'/>
      </label>
    </div>
  );
}