import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ReminderSection() {
  const [reminder, setReminder] = useState("");
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!reminder.trim()) return;
    setReminders((prev) => [...prev, reminder]);
    setReminder("");
  };

  const deleteReminder = (index) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(reminders[index]);
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setEditText("");
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    const newReminders = [...reminders];
    newReminders[editIndex] = editText;
    setReminders(newReminders);
    cancelEdit();
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Reminders
      </Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Add reminder"
          variant="outlined"
          fullWidth
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          aria-label="New reminder input"
          onKeyDown={(e) => e.key === "Enter" && addReminder()}
        />
        <Button
          variant="contained"
          onClick={addReminder}
          aria-label="Add reminder button"
        >
          Add
        </Button>
      </Stack>
      <List>
        {reminders.map((r, i) => (
          <ListItem
            key={i}
            secondaryAction={
              editIndex === i ? (
                <>
                  <IconButton
                    edge="end"
                    aria-label="Save reminder"
                    onClick={saveEdit}
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="Cancel edit"
                    onClick={cancelEdit}
                  >
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    edge="end"
                    aria-label="Edit reminder"
                    onClick={() => startEdit(i)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="Delete reminder"
                    onClick={() => deleteReminder(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
          >
            {editIndex === i ? (
              <TextField
                fullWidth
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                aria-label="Edit reminder input"
              />
            ) : (
              <Typography tabIndex={0}>{r}</Typography>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
}