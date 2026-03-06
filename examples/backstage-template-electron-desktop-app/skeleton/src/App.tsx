import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
      setMessage('')
    }, 2000)
  }

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1><span className="emoji">⚛️</span> $BACKSTAGE_APP_NAME</h1>
          <p className="subtitle">Plantilla Electron + React</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">👤 Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">💬 Mensaje</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
            />
          </div>

          <button type="submit" className="btn">✈️ Enviar</button>
        </form>

        {submitted && (
          <div className="success-message">
            ✨ ¡Formulario enviado correctamente!
          </div>
        )}
      </div>
    </div>
  )
}

export default App
