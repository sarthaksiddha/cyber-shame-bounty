
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from './ui/toggle';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for user preference in localStorage
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on stored preference or system preference
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Toggle 
      aria-label="Toggle theme" 
      className="rounded-full w-10 h-10 p-0 bg-secondary hover:bg-secondary/90 dark:bg-gray-800 dark:hover:bg-gray-700 border border-primary/10"
      pressed={isDarkMode}
      onPressedChange={toggleTheme}
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-yellow-300" />
      ) : (
        <Sun className="h-5 w-5 text-amber-500" />
      )}
    </Toggle>
  );
};

export default ThemeToggle;
