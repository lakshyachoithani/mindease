import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  TextField,
  List,
  ListItem,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

// VoiceInput component with start/stop, interim results, error handling
function VoiceInput({ onTranscriptChange }) {
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech Recognition not supported in your browser.");
      return;
    }
    const recog = new window.webkitSpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => {
            const updated = prev + event.results[i][0].transcript + " ";
            if (onTranscriptChange) onTranscriptChange(updated);
            return updated;
          });
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInterim(interimTranscript);
    };

    recog.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recog.onend = () => setListening(false);

    setRecognition(recog);
  }, [onTranscriptChange]);

  const startListening = () => {
    if (!recognition) return;
    setTranscript("");
    setInterim("");
    setError(null);
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
  };

  return (
    <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        {!listening ? (
          <Tooltip title="Start Voice Input">
            <Button
              variant="contained"
              color="primary"
              startIcon={<MicIcon />}
              onClick={startListening}
              aria-label="Start voice input"
            >
              Start Voice Input
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title="Stop Voice Input">
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              onClick={stopListening}
              aria-label="Stop voice input"
            >
              Stop
            </Button>
          </Tooltip>
        )}
        {listening && <CircularProgress size={24} />}
      </Stack>

      <Typography
        variant="body1"
        sx={{ minHeight: 80, whiteSpace: "pre-wrap" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {transcript} <i style={{ color: "#666" }}>{interim}</i>
      </Typography>

      {error && (
        <Typography variant="body2" color="error" mt={2} role="alert">
          Error: {error}
        </Typography>
      )}
    </Paper>
  );
}

// Main app
export default function App() {
  // Accessibility states
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Voice input transcript (to receive from VoiceInput)
  const [transcript, setTranscript] = useState("");

  // Reminder system states
  const [reminder, setReminder] = useState("");
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });

  // Mental health Q&A
  const qaList = [
    { q: "How can I deal with anxiety?", a: "Try deep breathing and mindfulness." },
    { q: "What is depression?", a: "A mood disorder causing persistent sadness." },
  ];

  // Add a new reminder
  const addReminder = () => {
    if (reminder.trim() === "") return;
    const newReminders = [...reminders, reminder];
    setReminders(newReminders);
    localStorage.setItem("reminders", JSON.stringify(newReminders));
    setReminder("");
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        padding: 4,
        bgcolor: darkMode ? "#121212" : highContrast ? "#030303" : "#F1EFEC",
        color: darkMode ? "#E0E0E0" : highContrast ? "#F1EFEC" : "#123458",
        fontSize: largeText ? "1.25rem" : "1rem",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="h3"
        mb={3}
        tabIndex={0}
        fontWeight="bold"
        align="center"
      >
        Accessible Mental Health Chatbot
      </Typography>

      {/* Accessibility toggles */}
      <Stack direction="row" spacing={2} mb={4} justifyContent="center">
        <Button
          variant={largeText ? "contained" : "outlined"}
          onClick={() => setLargeText(!largeText)}
          aria-pressed={largeText}
        >
          Toggle Large Text
        </Button>
        <Button
          variant={highContrast ? "contained" : "outlined"}
          onClick={() => setHighContrast(!highContrast)}
          aria-pressed={highContrast}
        >
          Toggle High Contrast
        </Button>
        <Button
          variant={darkMode ? "contained" : "outlined"}
          onClick={() => setDarkMode(!darkMode)}
          aria-pressed={darkMode}
        >
          Toggle Dark Mode
        </Button>
      </Stack>

      {/* Voice input */}
      <VoiceInput onTranscriptChange={setTranscript} />

      {/* Show latest transcript under VoiceInput for reference (optional) */}
      {transcript && (
        <Typography variant="body2" sx={{ mb: 4 }} aria-live="polite">
          <strong>Last Transcript:</strong> {transcript}
        </Typography>
      )}

      {/* Mental health Q&A */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          FAQs
        </Typography>
        {qaList.map(({ q, a }, idx) => (
          <Box key={idx} mb={2}>
            <Typography fontWeight="bold">Q: {q}</Typography>
            <Typography>A: {a}</Typography>
          </Box>
        ))}
      </Box>

      {/* Reminder system */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Reminders
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            placeholder="Add reminder"
            variant="outlined"
            fullWidth
            aria-label="Add reminder"
            size="small"
          />
          <Button variant="contained" onClick={addReminder} sx={{ ml: 2 }}>
            Add Reminder
          </Button>
        </Box>
        <List>
          {reminders.map((r, i) => (
            <ListItem key={i}>{r}</ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}