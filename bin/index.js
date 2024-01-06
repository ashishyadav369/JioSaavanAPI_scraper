#! /usr/bin/env node
const parseUrl = require("../src/script");
const parseAlbum = require("../src/album");
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
      let isValidSubPath =
        subPath === "song" || subPath === "album" ? true : false;
      if (!isValidSubPath) {
        console.log(
          "\nAs of now only song or album can be downloded.\n--help for usage details\n"
        );
        process.exit();
      }
      if (subPath === "song") {
        parseUrl
          .getSongInfo(url, {})
          .then((result) => {
            (async () => {
              await audio.downloadAndWrite(
                result.web_cdn,
                result.song,
                result.album
              );
            })();
          })
          .catch((error) => console.error(error));
      }
      if (subPath === "album") {
        (async () => {
          let playlistTracks = await parseAlbum.getAlbumInfo(url);
          for (const track of playlistTracks) {
            try {
              const result = await parseUrl.getSongInfo("", track);

              // Download and write the file synchronously
              await audio.downloadAndWrite(
                result.web_cdn,
                result.song,
                result.album
              );
            } catch (error) {
              console.error(error);
            }
          }
        })();
      }
    } else {
      console.log(
        "\nPlease enter valid JioSaavan song link\n--help for usage details\n"
      );
      process.exit();
    }
  }
}

handelArgument(option, url);
