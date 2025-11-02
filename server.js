// Simple locally ran server for testing

const { error } = require("console");
const http = require("http");
const fs = require("fs").promises;

const host = "localhost";
const port = 3000;

async function fetchPlayer(user) {
  try {
    const response = await fetch(
      `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${user}`
    );
    if (response.status !== 200) {
      return { error: "Player not found" };
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

const requestListener = async function (request, response) {
  const splitUrl = request.url.split("?");
  switch (splitUrl[0]) {
    // API call
    case "/api/player":
      let data = await fetchPlayer(splitUrl[1]);
      // Cleaning data to reduce properties

      const res = JSON.stringify(data);
      try {
        response.setHeader("Content-Type", "application/json");
        response.writeHead(200);
        response.end(res);
      } catch (err) {
        response.writeHead(500);
        response.end(err);
      }
      break;
    // Case for the opening page
    case "/":
      fs.readFile("./index/index.html")
        .then((contents) => {
          response.setHeader("Content-Type", "text/html");
          response.writeHead(200);
          response.end(contents);
        })
        .catch((err) => {
          response.writeHead(500);
          response.end(err);
        });
      break;
    case "/styles.css":
      fs.readFile("./index/styles.css")
        .then((contents) => {
          response.setHeader("Content-Type", "text/css");
          response.writeHead(200);
          response.end(contents);
        })
        .catch((err) => {
          response.writeHead(500);
          response.end(err);
        });
      break;
    case "/runescapeWikiAPI.js":
      fs.readFile("./index/runescapeWikiAPI.js")
        .then((contents) => {
          response.setHeader("Content-Type", "text/javascript");
          response.writeHead(200);
          response.end(contents);
        })
        .catch((err) => {
          response.writeHead(500);
          response.end(err);
        });
      break;
    case "/icons.js":
      fs.readFile("./index/icons.js")
        .then((contents) => {
          response.setHeader("Content-Type", "text/javascript");
          response.writeHead(200);
          response.end(contents);
        })
        .catch((err) => {
          response.writeHead(500);
          response.end(err);
        });
      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
