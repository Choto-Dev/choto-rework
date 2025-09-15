import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TTheme = "dark" | "light" | "system";

type TThemeProviderProps = {
  children: React.ReactNode;
};

type TThemeProviderState = {
  theme: TTheme;
  systemTheme: TTheme;
  setTheme: (theme: TTheme) => void;
};

const initialThemeState: TThemeProviderState = {
  theme: "dark",
  systemTheme: "dark",
  setTheme: () => null,
};
const defaultTheme: TTheme = "dark";
const localStorageKey = "rework-theme";
const isServer = typeof window === "undefined";
const MEDIA_STRING = "(prefers-color-scheme: dark)";
const ThemeContext = createContext<TThemeProviderState>(initialThemeState);

/**
 * Get theme from localStorage. Helper function.
 * @param key localStorage key
 * @returns theme
 */
const getTheme = (key: string): TTheme | undefined => {
  if (isServer) {
    return;
  }

  return (localStorage.getItem(key) as TTheme) || defaultTheme;
};

/**
 * Get system theme. Helper function.
 * @param event Media query event
 * @returns theme
 */
const getSystemTheme = (
  event?: MediaQueryList | MediaQueryListEvent
): TTheme => {
  let e = event;
  if (isServer) {
    return defaultTheme;
  }

  if (!e) {
    e = window.matchMedia(MEDIA_STRING);
  }
  return e.matches ? "dark" : "light";
};

/**
 * Theme component.
 * @param props theme props
 * @returns Theme context provider
 */
const Theme = (props: TThemeProviderProps) => {
  const [themeState, setThemeState] = useState<TTheme>(
    () => getTheme(localStorageKey) || defaultTheme
  );
  const [systemThemeState, setSystemThemeState] = useState(() =>
    getSystemTheme()
  );

  /**
   * Apply theme in class list.
   * @param theme Theme
   */
  const applyTheme = useCallback(
    (theme: TTheme) => {
      let resolvedTheme = theme;

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (!resolvedTheme || resolvedTheme === "system") {
        resolvedTheme = getSystemTheme();

        root.classList.add(resolvedTheme);

        return;
      }

      root.classList.add(themeState);
    },
    [themeState]
  );

  // Listen for deprecated listener to support iOS & old browsers.
  useEffect(() => {
    const handleMediaQuery = (event: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(event);
      setSystemThemeState(resolved);

      if (themeState === "system") {
        applyTheme("system");
      }
    };

    const media = window.matchMedia(MEDIA_STRING);
    media.addListener(handleMediaQuery);
    return () => media.removeListener(handleMediaQuery);
  }, [themeState, applyTheme]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== localStorageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      if (e.newValue) {
        setThemeState(e.newValue as TTheme); // Direct state update to avoid loops
      } else {
        if (!isServer) {
          localStorage.setItem(localStorageKey, defaultTheme);
        }
        setThemeState(defaultTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    applyTheme(themeState);
  }, [themeState, applyTheme]);

  const value: TThemeProviderState = {
    theme: themeState,
    systemTheme: systemThemeState,
    setTheme: (t) => {
      if (!isServer) {
        localStorage.setItem(localStorageKey, t);
      }
      setThemeState(t);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
};

/**
 * Theme hook.
 * @returns Theme state
 */
export const useTheme = () => useContext(ThemeContext) ?? initialThemeState;

/**
 * Theme provider
 * @param props Theme provider props
 * @returns Theme component
 */
export const ThemeProvider = (props: TThemeProviderProps) => {
  return <Theme {...props} />;
};
