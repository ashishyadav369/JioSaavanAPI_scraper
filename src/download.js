const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ProgressBar = require("progress");

const downloadAndWrite = async (url, songName, albumName) => {
  try {
    const { data, headers } = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    const totalLength = headers["content-length"];

    // colour for progress bar
    let green = "\u001b[42m \u001b[0m";
    let red = "\u001b[41m \u001b[0m";

    const progressBar = new ProgressBar(
      `➡️ DOWNLOADING ➡️ ${songName} from ${albumName} ➡️ ➡️ :bar :percent :etas`,
      {
        width: 40,
        complete: green,
        incomplete: red,
        renderThrottle: 1,
        total: parseInt(totalLength),
      }
    );

    const writer = fs.createWriteStream(
      path.resolve(process.cwd(), "downloads", `${songName}.mp3`)
    );

    // Return Promise which is resolved when download is complete
    return new Promise((resolve, reject) => {
      data.on("data", (chunk) => progressBar.tick(chunk.length));
      data.pipe(writer);

      writer.on("finish", () => {
        console.log(`Download complete for ${songName}`);
        resolve();
      });

      writer.on("error", (error) => {
        console.error(`Error writing file for ${songName}: ${error.message}`);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error downloading !!");
  }
};

exports.downloadAndWrite = downloadAndWrite;
