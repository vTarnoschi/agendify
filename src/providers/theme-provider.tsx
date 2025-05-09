"use client";

import { ComponentProps, Fragment, useEffect, useState } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Fragment>{children}</Fragment>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
