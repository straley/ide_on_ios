const express = require("express");
const app = express();
// const basicAuth = require("express-basic-auth");
const fs = require("fs");
const config = require("config");
const  bodyParser = require('body-parser');

const getToken = () => {
    return Math.floor( ( ( Math.floor( Date.now() / 1000 ) + ( ( process.hrtime()[1] / 1000) % 1 ) * 1000000 ) + Math.random() ) * 1000 ).toString(36);
};
const auth = {};


const validate = ( session, token ) => {
  if ( auth[ session ] && auth[ session ].next === token ) {
    const nextId = getToken();
    auth[ session ].next = nextId;
    return nextId;
  } else {
    console.log( "VALIDATION ERROR", session, auth[ session ] );
    return false;
  }
};

/*
if ( config.auth && config.auth.includes( ":" ) ) {
  const [ user, secret ] = config.auth.split( ":" );
  console.log( "Using Auth" );
  app.use( basicAuth( {
      users: { [ user ]: secret },
      challenge: true,
      realm: 'Imb4T3st4pp'
  } ) );
}
*/

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

let user = false;
let pass = false;
if ( config.auth && config.auth.includes( ":" ) ) {
  [ user, pass ] = config.auth.split( ":" );
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

app.post( "/api/ls/:path*?", function( req, res ) {
  
  const nextId = validate( req.body.session, req.body.next );
  if ( !nextId ) {
    res.send( "ERROR ");
  } else {
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
    
    res.send( JSON.stringify( { files: results, next: nextId } ) );
  }
  
});

app.post( "/api/auth", function( req, res ) {
  if ( req.body && req.body.user === user && req.body.pass === pass ) {
    const sessionId = getToken();
    auth[ sessionId ] = {
      user: user,
      session: sessionId,
      next: getToken()
    };

    res.send( JSON.stringify( auth[ sessionId ] ) );
  } else {
    res.send( JSON.stringify( { error: "invalid auth" } ) );
  }
});


/* serves main page */
app.get("/", function(req, res) {
  res.sendFile( __dirname + "/public/index.html" );
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
  res.sendFile( __dirname + "/public/" + req.params[0]); 
});

var port = 9000;
app.listen(port, function() {
  console.log( "Listening on " + port );
});