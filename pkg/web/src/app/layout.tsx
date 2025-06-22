"use client";

import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "../components/theme-provider";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <ThemeProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
