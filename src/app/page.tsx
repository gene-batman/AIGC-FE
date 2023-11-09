'use client'

import { useState, useEffect } from 'react';

import Main from '../components/container'
import { Box, Button, Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const getUser = async () => {
    const user = await fetch('/sdapi/user/profile').then(res => res.json())
    setUser(user.data)
  }

  const login = async () => {
    setLoading(true)
    const res = await fetch('/sdapi/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      })
    })
    const data = await res.json()
    console.log('===== login', data)
    if (data.code === 0) {
      await getUser()
      setLoading(false)
    }
  }
  useEffect(() => {
    if (typeof window === 'undefined') return
    getUser().then(() => {
      setMounted(true)
    })
  }, [])

  return (mounted && user?.id) ? <Main /> : (
    <Paper className='h-screen flex items-center justify-center' sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <h1 className='text-[32px]'>Login</h1>
        <TextField label='Username' value={username} onChange={(e) => {
          setUsername(e.target.value)
        }} />
        <TextField label='Password' type='password' value={password} onChange={(e) => {
          setPassword(e.target.value)
        }} />
        <LoadingButton loading={loading} variant="outlined" onClick={login}>
          Login
        </LoadingButton>
      </Box>
    </Paper>
  )
}
