/* Built in HTTP module for Node.js, which allows Node.js to transfer data over the Hyper Text
    Transfer Protocol. 
*/
const http = require("http");
const app = require("./app");

/*
 process.env a property returns an object containing the user environment. 
*/
const port = process.env.PORT || 8080;

// Returns a new instance of http.Server
const server = http.createServer(app);

server.listen(port);
