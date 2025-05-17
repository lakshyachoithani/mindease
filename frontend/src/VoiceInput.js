import React, { useState, useEffect } from "react";
import { Button, Typography, Stack, Tooltip, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export default function VoiceInput() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Speech Recognition API not supported in this browser.");
      return;
    }
    setError(null);
    setTranscript("");
    setListening(true);

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + event.results[i][0].transcript + " ");
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript((prev) => prev.trim() + " " + interimTranscript);
    };

    recognition.onerror = (event) => {
      setError("Error occurred in recognition: " + event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <Stack spacing={1} mb={3}>
      <Tooltip title="Click to start voice input">
        <Button
          variant="contained"
          startIcon={listening ? <MicOffIcon /> : <MicIcon />}
          onClick={startListening}
          aria-label="Start voice input"
          disabled={listening}
        >
          {listening ? "Listening..." : "Start Voice Input"}
          {listening && <CircularProgress size={20} sx={{ ml: 1 }} />}
        </Button>
      </Tooltip>
      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-wrap", minHeight: "3rem" }}
        aria-live="polite"
        aria-atomic="true"
      >
        <strong>Transcript:</strong> {transcript.trim() || "..."}
      </Typography>
      {error && (
        <Typography variant="body2" color="error" role="alert" mt={1}>
          {error}
        </Typography>
      )}
    </Stack>
  );
}