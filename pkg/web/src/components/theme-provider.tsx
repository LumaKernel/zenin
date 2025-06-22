"use client";

import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

interface ThemeProviderProps {
  readonly children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("color-scheme") as MantineColorScheme | null;
    if (storedTheme) {
      setColorScheme(storedTheme);
    } else {
      setColorScheme("auto");
    }
  }, [setColorScheme]);

  return <>{children}</>;
}

export function useTheme() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = (scheme: MantineColorScheme) => {
    setColorScheme(scheme);
    localStorage.setItem("color-scheme", scheme);
  };

  return {
    colorScheme,
    setColorScheme: toggleColorScheme,
  };
}