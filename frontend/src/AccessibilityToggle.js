import React from "react";
import { Button, Stack } from "@mui/material";

export default function AccessibilityToggle({
  largeText,
  setLargeText,
  highContrast,
  setHighContrast,
  darkMode,
  setDarkMode,
}) {
  return (
    <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
      <Button
        variant="outlined"
        onClick={() => setLargeText(!largeText)}
        aria-pressed={largeText}
        aria-label="Toggle large text"
      >
        {largeText ? "Normal Text" : "Large Text"}
      </Button>
      <Button
        variant="outlined"
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
      >
        {highContrast ? "Normal Contrast" : "High Contrast"}
      </Button>
      <Button
        variant="outlined"
        onClick={() => setDarkMode(!darkMode)}
        aria-pressed={darkMode}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
    </Stack>
  );
}
