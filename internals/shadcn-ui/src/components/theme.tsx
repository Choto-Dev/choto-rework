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
  defaultTheme?: TTheme;
  storageKey?: string;
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
const localStorageKey = "rework-theme";
const isServer = typeof window === "undefined";
const MEDIA_STRING = "(prefers-color-scheme: dark)";
const ThemeContext = createContext<TThemeProviderState>(initialThemeState);

/**
 * Get theme from localStorage.
 * @param key localStorage key
 * @returns theme
 */
const getTheme = (key: string): TTheme | undefined => {
  if (isServer) {
    return;
  }

  return (localStorage.getItem(key) as TTheme) || "dark";
};

const getSystemTheme = (
  event?: MediaQueryList | MediaQueryListEvent
): TTheme => {
  let e = event;
  if (!e) {
    e = window.matchMedia(MEDIA_STRING);
  }
  return e.matches ? "dark" : "light";
};

/**
 * Theme component.
 * @param props theme props
 * @returns JSX element
 */
const Theme = (props: TThemeProviderProps) => {
  const [themeState, setThemeState] = useState<TTheme>(
    () => getTheme(localStorageKey) || "dark"
  );
  const [systemThemeState, setSystemThemeState] = useState(() =>
    getSystemTheme()
  );

  /**
   * Apply theme in class list.
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

  /**
   * Handle deprecated listener to support iOS & old browsers.
   */
  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setSystemThemeState(resolved);

      if (themeState === "system") {
        applyTheme("system");
      }
    },
    [themeState, applyTheme]
  );

  useEffect(() => {
    const media = window.matchMedia(MEDIA_STRING);
    media.addListener(handleMediaQuery);
    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

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

export const useTheme = () => useContext(ThemeContext) ?? initialThemeState;

export const ThemeProvider = (props: TThemeProviderProps) => {
  const context = useContext(ThemeContext);

  if (context) {
    return <>{props.children}</>;
  }
  return <Theme {...props} />;
};
