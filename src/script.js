async function getSongInfo(url, trackObj) {
  try {
    let songInfo = trackObj;
    const headers = { Host: "www.jiosaavn.com" };
    if (!songInfo.hasOwnProperty("encrypted_media_url")) {
      if (!url) {
        return { error: "URL is not provided" };
      }

      const songID = url.split("song")[1].split("/")[2];

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

      if (responseJSON.status === "failure") {
        throw new Error(
          "\nUnable to parse song url. Please recheck the song url\n"
        );
      }

      const key = Object.keys(responseJSON)[0];
      songInfo = responseJSON[key];

      if (!songInfo.encrypted_media_url) {
        throw new Error("\nNo encrypted_media_url found in the API response\n");
      }
    }
    const encryptedMediaURL = songInfo.encrypted_media_url;

    // TODO :: To download lyrics in text file
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
    console.error(error.message || "An error occurred");
    process.exit();
  }
}

exports.getSongInfo = getSongInfo;
