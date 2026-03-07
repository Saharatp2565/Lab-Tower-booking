import { useState } from 'react'

const Register = ({ setUser }) => {
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, name, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) alert('Registered successfully, please login')
        else alert('Registration failed')
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="รหัสนักศึกษา (10 ตัว)" maxLength="10" pattern="[0-9]{10}" required />
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ-นามสกุล" required />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="อีเมล" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="รหัสผ่าน" required />
      <button type="submit">Register</button>
    </form>
  )
}

export default Register