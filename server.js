const express = require("express");
const app = express();
const basicAuth = require("express-basic-auth");
const fs = require("fs");
const config = require("config");

if ( config.auth && config.auth.includes( ":" ) ) {
  const [ user, secret ] = config.auth.split( ":" );
  console.log( "Using Auth " );
  app.use( basicAuth( {
      users: { [ user ]: secret },
      challenge: true,
      realm: 'Imb4T3st4pp'
  } ) );
}


app.get( "/api/load/:filename*", function( req, res ) {
  const filename = `${config.path}/${req.params.filename}${req.param(0)}`.replace(/\/\.\.\//g, "/");
  console.log( filename );
  if ( fs.existsSync( filename ) ) {
    const response = {
      contents: fs.readFileSync( filename ).toString()
    };
    res.setHeader( "Content-Type", "application/json" );
    res.send( JSON.stringify( response ) );
  } else {
    res.send( "ERROR" );
  }
});

/* serves main page */
app.get("/", function(req, res) {
  res.sendfile('./public/index.html')
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params);
  res.sendfile( __dirname + "/public/" + req.params[0]); 
});

var port = 9000;
app.listen(port, function() {
  console.log( "Listening on " + port );
});