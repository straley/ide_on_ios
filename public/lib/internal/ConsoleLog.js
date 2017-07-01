/* globals $ */

function console_write(level, args) {
  const $console_output = $("#console .output");
  const lines = $console_output.html().split("<br/>");
  if (lines.length > 100) {
    lines.pop();
  }
  
  Object.keys( args ).forEach( ( key ) => {
    if ( !isNaN( parseInt( key, 10 ) ) ) {
      if ( typeof args[key] === "string" ) {
        lines.push( `<span class="${level}">${ args[ key ] }</span>` );
      } else {
        lines.push( `<span class="${level}">${ JSON.stringify( args[ key ] ) }</span>` );
      }
    }
  } );
  
  $console_output.html( lines.join( "<br/>" ) );
  $console_output.scrollTop($console_output.prop( "scrollHeight" ) );
}

window.console = {
  log: function(){ return console_write("log", arguments)}, 
  info: function(){ return console_write("info", arguments)}, 
  warn: function(){ return console_write("warn", arguments)}, 
  debug: function(){ return console_write("debug", arguments)}, 
  error: function(){ return console_write("error", arguments)}, 
  profile: function(){ return console_write("profile", arguments)}, 
  timestamp: function(){ return console_write("timestamp", arguments)}, 
  trace: function(){ return console_write("trace", arguments)}, 
};
console = window.console;

window.addEventListener("error", function (e) {
  console.error([e.error.message, "from", e.error.stack]);
});    

