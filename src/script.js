async function getSongInfo(url) {
  try {
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
      ctx: "web6dot0",
      _format: "json",
      _marker: 0,
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

    return responseJSONFinal;
  } catch (error) {
    return { error: error.message || "An error occurred" };
  }
}

exports.getSongInfo = getSongInfo;
