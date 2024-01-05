#! /usr/bin/env node
const parseUrl = require("../src/script");
const audio = require("../src/download");

const option = process.argv[2];
const url = process.argv[3];

switch (option) {
  case undefined:
    console.log("\nWelcome to scrape :)");
    console.log("Type --help for more information\n ");
    break;
  case "--help":
    console.log("\nOptions:\r");
    console.log("    -d, --download\t");
    console.log("\t--help\t\t      " + "Show help");
    break;

  case "-d":
    parseUrl
      .getSongInfo(url)
      .then((result) => {
        (async () => {
          await audio.downloadAndWrite(result.web_cdn, result.song);
        })();
      })
      .catch((error) => console.error(error));
    break;
  default:
}
