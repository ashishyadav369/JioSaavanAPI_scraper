const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ProgressBar = require("progress");

const downloadAndWrite = async (url, songName) => {
  const { data, headers } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  const totalLength = headers["content-length"];

  console.log("Starting download");
  const progressBar = new ProgressBar("-> downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  const writer = fs.createWriteStream(
    path.resolve(__dirname, "downloads", `${songName}.mp3`)
  );

  data.on("data", (chunk) => progressBar.tick(chunk.length));
  data.pipe(writer);
};

exports.downloadAndWrite = downloadAndWrite;
