#! /usr/bin/env node
const parseUrl = require("../src/script");
const audio = require("../src/download");
const urlParser = require("url");

const option = process.argv[2];
const url = process.argv[3];

function handelArgument(option, url) {
  if (option === undefined) {
    console.log("\nWelcome to scrape :)");
    console.log("Type --help for more information\n ");
  } else if (option === "--help") {
    console.log("\nOptions:\r");
    console.log("    -d, --download\tUsage: scrape -d <song_url>");
    console.log("\t--help\t\t" + "Show help");
  } else if (option === "-d" || option === "--download") {
    if (!url) {
      console.log("No URL Found");
      process.exit();
    }
    const { hostname, path } = urlParser.parse(url);
    let subPath = path.split("/")[1];
    if (hostname === "www.jiosaavn.com") {
      if (subPath !== "song") {
        console.log(
          "\nPlease enter single song url. It seems you are trying to download album or playlist\n--help for usage details\n"
        );
        process.exit();
      }
      parseUrl
        .getSongInfo(url)
        .then((result) => {
          (async () => {
            await audio.downloadAndWrite(result.web_cdn, result.song);
          })();
        })
        .catch((error) => console.error(error));
    } else {
      console.log(
        "\nPlease enter valid JioSaavan song link\n--help for usage details\n"
      );
      process.exit();
    }
  }
}

handelArgument(option, url);
