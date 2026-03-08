import { useState } from 'react'

const Login = ({ setUser }) => {
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user)
        else alert('เข้าสู่ระบบล้มเหลว')
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="รหัสนักศึกษา (10 หลัก)" maxLength="10" pattern="[0-9]{10}" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="อีเมล" />
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ-นามสกุล" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="รหัสผ่าน" />
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  )
}

export default Login