import React from "react";
import { Typography, Box } from "@mui/material";

const qaList = [
  { q: "How can I deal with anxiety?", a: "Try deep breathing and mindfulness." },
  { q: "What is depression?", a: "A mood disorder causing persistent sadness." },
  { q: "How do I get professional help?", a: "Consider talking to a counselor or doctor." },
];

export default function QASection() {
  return (
    <Box mb={3}>
      <Typography variant="h5" gutterBottom>
        FAQs
      </Typography>
      {qaList.map(({ q, a }, i) => (
        <Box key={i} mb={2}>
          <Typography variant="subtitle1" fontWeight="bold" tabIndex={0}>
            Q: {q}
          </Typography>
          <Typography variant="body2" tabIndex={0}>
            A: {a}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}