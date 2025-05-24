import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface NewPlayer {
  name: string;
  currentTeam: string;
  league: string;
  height: string;
  weight: string;
  nationality: string;
  leagueType: string;
}

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  newPlayer: NewPlayer;
  setNewPlayer: (player: NewPlayer) => void;
  isFormValid: boolean;
}


const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({ open, onClose, onAdd, newPlayer, setNewPlayer, isFormValid }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add New Player</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Name"
        fullWidth
        value={newPlayer.name}
        onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Current Team"
        fullWidth
        value={newPlayer.currentTeam}
        onChange={e => setNewPlayer({ ...newPlayer, currentTeam: e.target.value })}
      />
      <TextField
        margin="dense"
        label="League"
        fullWidth
        value={newPlayer.league}
        onChange={e => setNewPlayer({ ...newPlayer, league: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Height (inches)"
        fullWidth
        type="number"
        value={newPlayer.height}
        onChange={e => setNewPlayer({ ...newPlayer, height: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Weight (lbs)"
        fullWidth
        type="number"
        value={newPlayer.weight}
        onChange={e => setNewPlayer({ ...newPlayer, weight: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Nationality"
        fullWidth
        value={newPlayer.nationality}
        onChange={e => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
      />
      <TextField
        margin="dense"
        label="League Type"
        fullWidth
        value={newPlayer.leagueType}
        onChange={e => setNewPlayer({ ...newPlayer, leagueType: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onAdd} variant="contained" disabled={!isFormValid}>
        Add
      </Button>
    </DialogActions>
  </Dialog>
);

export default AddPlayerDialog; 