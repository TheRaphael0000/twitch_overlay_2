import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Spotify from './Spotify'
import SpotifyCallback from './SpotifyCallback'
import Clock from './Clock'
import Chat from './Chat'
import "./app.css"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Spotify />} />
          <Route path="/spotify" element={<Spotify />} />
          <Route path="/clock" element={<Clock />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/callback" element={<SpotifyCallback />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
