async function getSongInfo(url) {
  if (!url) {
    return { error: "URL is not provided" };
  }

  const songID = url.split("song")[1].split("/")[2];

  const headers = { Host: "www.jiosaavn.com" };
  const params = {
    __call: "webapi.get",
    token: songID,
    type: "song",
  };

  const response = await fetch(
    `https://www.jiosaavn.com/api.php?${new URLSearchParams(params)}`,
    { headers }
  );
  const responseJSON = await response.json();

  const key = Object.keys(responseJSON)[0];
  const songInfo = responseJSON[key];

  if (!songInfo.encrypted_media_url) {
    return { error: "No encrypted_media_url found in the API response" };
  }

  const encryptedMediaURL = songInfo.encrypted_media_url;
  const hasLyrics = songInfo.has_lyrics;

  const responseJSONFinal = {
    song: songInfo.song,
    album: songInfo.album,
  };

  const params2 = {
    __call: "song.generateAuthToken",
    url: encryptedMediaURL,
    bitrate: "320",
    api_version: "4",
    _format: "json",
  };

  // will parse params in url
  const response2 = await fetch(
    `https://www.jiosaavn.com/api.php?${new URLSearchParams(params2)}`,
    { headers }
  );
  const response2JSON = await response2.json();

  responseJSONFinal.mobile_cdn = response2JSON.auth_url
    .split("?")[0]
    .replace("ac.cf.saavncdn.com", "jsa.saavncdn.com");
  responseJSONFinal.web_cdn = response2JSON.auth_url
    .split("?")[0]
    .replace("ac.cf.saavncdn.com", "aac.saavncdn.com");

  if (hasLyrics) {
    const paramsLyrics = {
      __call: "lyrics.getLyrics",
      lyrics_id: key,
      ctx: "web6dot0",
      api_version: "4",
      _format: "json",
      _marker: "0",
    };

    const responseLyrics = await fetch(
      `https://www.jiosaavn.com/api.php?${new URLSearchParams(paramsLyrics)}`,
      { headers }
    );
    const responseLyricsJSON = await responseLyrics.json();

    if (!responseLyricsJSON.lyrics) {
      return { error: "Unexpected response structure from the lyrics API" };
    }

    responseJSONFinal.lyrics = responseLyricsJSON.lyrics;
  }

  return responseJSONFinal;
}

const url = "Enter URL Here";
getSongInfo(url).then((result) => console.log(result));
