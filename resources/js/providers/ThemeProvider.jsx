import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(null);
  
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("theme", theme);
      localStorage.setItem("theme", theme)
    } else {
      setTheme(localStorage.getItem("theme") || "light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme == "light" ? "dark" : "light")

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}