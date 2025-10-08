import React, { useState, useContext } from 'react';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt:6 }}>
      <Paper sx={{ p:3 }}>
        <Typography variant="h6" gutterBottom>Login</Typography>
        <form onSubmit={submit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e=>setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <Typography color="error" sx={{ mt:1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt:2 }}>Login</Button>
        </form>
      </Paper>
    </Container>
  );
}
