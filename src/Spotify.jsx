import { spotify_id, spotify_redirect_uri } from "../config"
import { useState, useEffect } from 'react';
import "./spotify.css"

async function fetchCurrentSong(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();

  } catch (error) {
    console.error('Error fetching current song:', error);
  }
}

function getAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  const accessTokenExpireAt = localStorage.getItem('accessTokenExpireAt');

  if (accessTokenExpireAt != undefined && Date.now() < parseInt(accessTokenExpireAt)) {
    return accessToken;
  }
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${spotify_id}&response_type=code&redirect_uri=${spotify_redirect_uri}&scope=user-read-currently-playing`;
  return undefined;
}

function App() {
  const [currentSong, setCurrentSong] = useState();
  const [artists, setArtists] = useState();
  const [progress, setProgress] = useState(0);
  const [progressMax, setProgressMax] = useState(0);

  function updateSong() {
    const token = getAccessToken()
    if (token == undefined)
      return;

    fetchCurrentSong(token).then(data => {
      setCurrentSong(data)
      setArtists(data.item.artists.map(a => a.name).join(", "))
      setProgress(data.progress_ms)
      setProgressMax(data.item.duration_ms)
    });
  }

  useEffect(() => {
    const delta = 100
    const interval = setInterval(() => {
      setProgress(progress + delta)
    }, delta);
    return () => {
      clearInterval(interval);
    };
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => updateSong(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(updateSong, []);

  if (!currentSong || !currentSong.is_playing)
    return;

  let image = currentSong.item.album.images[1];
  let track = currentSong.item.name;

  return (
    <>
      <main className="spotify">
        <div className="album">
          <img width={image.height} height={image.height} src={image.url} />
        </div>
        <div className="track_infos">
          <div className="track ellipsis">{track}</div>
          <div className="artists ellipsis">{artists}</div>
          <div className="bar">
            <div className="barProgress" style={{ width: progress / progressMax * 100 + '%' }}>
            </div>
          </div>
        </div>
      </main >
    </>
  )
}

export default App;