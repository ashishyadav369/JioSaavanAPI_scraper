async function getAlbumInfo(url) {
  const albumId = url.split("album")[1].split("/").pop();
  const headers = { Host: "www.jiosaavn.com" };
  const params = {
    __call: "webapi.get",
    token: albumId,
    type: "album",
  };
  const response = await fetch(
    `https://www.jiosaavn.com/api.php?${new URLSearchParams(params)}`,
    { headers }
  );

  const responseJSON = await response.json();
  const key = Object.keys(responseJSON)[9];
  const playlistTracks = responseJSON[key];
  return playlistTracks;
}

exports.getAlbumInfo = getAlbumInfo;
