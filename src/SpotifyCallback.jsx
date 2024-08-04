import { spotify_id, spotify_secret, spotify_redirect_uri } from "../secrets"


async function getToken(code) {
  
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${spotify_id}:${spotify_secret}`),

    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code',
    }),
  })

  if (!res.ok)
    throw new Error("Can't fetch")

  return await res.json();
}


export default function SpotifyCallback() {

  const accessTokenExpireAt = localStorage.getItem('accessTokenExpireAt');

  if (parseInt(accessTokenExpireAt) > Date.now()) {
    window.location.href = "/spotify"
    return;
  }
  else {
    const code = new URLSearchParams(window.location.search).get('code');

    getToken(code).then(data => {
      console.log(data);
      localStorage.setItem('accessTokenExpireAt', Date.now() + data.expires_in * 1000);
      localStorage.setItem('accessToken', data.access_token);
      window.location.href = "/spotify"
    })
  }
}