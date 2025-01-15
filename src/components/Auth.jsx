'use client'

import { useState } from 'react'
import { ref, set, get } from 'firebase/database'
import { realtimeDb } from '@/lib/firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      // Login
      const userRef = ref(realtimeDb, `users/${username}`)
      const snapshot = await get(userRef)
      if (snapshot.exists()) {
        const userData = snapshot.val()
        if (userData.password === password) {
          onLogin(username)
        } else {
          setError('Invalid password')
        }
      } else {
        setError('User not found')
      }
    } else {
      // Register
      const userRef = ref(realtimeDb, `users/${username}`)
      const snapshot = await get(userRef)
      if (snapshot.exists()) {
        setError('Username already exists')
      } else {
        await set(userRef, { password })
        onLogin(username)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
          <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

