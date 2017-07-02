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

app.get( "/api/ls/:path*?", function( req, res ) {
  const relpath = `${ req.params.path || "" }${ req.param( 0 ) || "" }`.replace( /\/\.\.\//g, "/" );
  const fullpath = `${ config.path }/${ relpath }`;
  console.log( fullpath );
  
  let files = [];
  try {
    files = fs.readdirSync( fullpath );
  } catch ( e ) {
    res.send( "ERROR" );
  }
  // { title: "Folder 2", key: "2", folder: true, lazy: true }
  const results = [];
  
  files.forEach( ( filename ) => {
    try {
      const stat = fs.lstatSync( `${ fullpath }/${ filename }` );
      
      // todo: handle other forms
      if ( stat.isDirectory() || stat.isFile() ) {
        results.push( {
           title: filename,
           key: `${ relpath ? `${ relpath }/` : "" }${ filename }`,
           folder: stat.isDirectory(),
           lazy: stat.isDirectory()
        } );
      }
    } catch ( e ) {
      // todo: error?
    }
  });
  
  res.send( JSON.stringify( results ) );
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