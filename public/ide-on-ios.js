/* globals ace, $ */

const clipboard = {text: ""};

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
  
  $console_output.html(lines.join("<br/>"));
  $console_output.scrollTop($console_output.prop("scrollHeight"));
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

const editor = ace.edit("editor");
const session = editor.getSession();
const doc = session.getDocument();
const selection = editor.getSelection();
const renderer = editor.renderer;

editor.$blockScrolling = Infinity;
editor.setTheme("ace/theme/monokai");
session.setMode("ace/mode/javascript");

renderer.showCursor();
editor.setAutoScrollEditorIntoView( true );

function load( filename ) {
    $.getJSON( "/api/load/" + filename, {}, function( response ) {
        editor.session.setValue( response.contents );
    } );
} 



//load("src/intent_compiler.ts");

load("compiled/intent_compiler.js");

/*
function blockNativeFind() {
    event.preventDefault();
    $("#searchbox").show().select().focus();
    setTimeout(function(){
        $("#searchbox2").show().select().focus();
    }, 10);
    return;
}

$( document ).ready( function () {
    window.onkeydown = function( event ) {
        if ( (event.ctrlKey || event.metaKey ) && event.keyCode == 70 ) {
            blockNativeFind();
        } 
    };
});    
*/

const keyActions = {
    "CURSOR_MOVE_UP" : () => {
        selection.clearSelection();
        selection.moveCursorUp();
    },
    "CURSOR_MOVE_DOWN" : () => {
        selection.clearSelection();
        selection.moveCursorDown();
    },
    "CURSOR_MOVE_LEFT" : () => {
        selection.clearSelection();
        selection.moveCursorLeft();
    },
    "CURSOR_MOVE_RIGHT" : () => {
        selection.clearSelection();
        selection.moveCursorRight();
    },
    "CURSOR_SELECT_UP" : () => {
        selection.selectUp();
    },
    "CURSOR_SELECT_DOWN" : () => {
        selection.selectDown();
    },
    "CURSOR_SELECT_LEFT" : () => {
        selection.selectLeft();
    },
    "CURSOR_SELECT_RIGHT" : () => {
        selection.selectRight();
    },
    "CURSOR_MOVE_PAGE_START": () => {
        selection.moveCursorFileStart();
    },
    "CURSOR_MOVE_PAGE_UP": () => {
        editor.gotoPageUp();
    },
    "CURSOR_SELECT_PAGE_START": () => {
        selection.selectTo( 0, 0 );
    },
    "CURSOR_SELECT_PAGE_UP": () => {
        editor.selectPageUp();
    },
    "CURSOR_MOVE_PAGE_END": () => {
        selection.moveCursorFileEnd();
    },
    "CURSOR_MOVE_PAGE_DOWN": () => {
        editor.gotoPageDown();
    },
    "CURSOR_SELECT_PAGE_END": () => {
        selection.selectTo( doc.getLength() + 1, 0 );
    },
    "CURSOR_SELECT_PAGE_DOWN": () => {
        editor.selectPageDown();
    },
    "CURSOR_MOVE_LINE_END": () => {
        selection.moveCursorLineEnd();
    },
    "CURSOR_MOVE_NEXT_WORD": () => {
        selection.moveCursorLongWordRight();
    },
    "CURSOR_SELECT_LINE_END": () => {
        const cursor = selection.getCursor();
        const lineLength = doc.getLine( cursor.row ).length;
        selection.selectTo( cursor.row, lineLength );
    },
    "CURSOR_SELECT_NEXT_WORD": () => {
        const start = selection.getCursor();
        selection.moveCursorLongWordRight();
        const end = selection.getCursor();
        selection.moveCursorTo( start.row, start.column );
        selection.selectTo( end.row, end.column );
    },
    "CURSOR_MOVE_LINE_START": () => {
        selection.moveCursorLineStart();
    },
    "CURSOR_MOVE_PREVIOUS_WORD": () => {
        selection.moveCursorLongWordLeft();
    },
    "CURSOR_SELECT_LINE_START": () => {
        const cursor = selection.getCursor();
        selection.selectTo( cursor.row, 0 );
    },
    "CURSOR_SELECT_PREVIOUS_WORD": () => {
        const start = selection.getCursor();
        selection.moveCursorLongWordLeft();
        const end = selection.getCursor();
        selection.moveCursorTo( start.row, start.column );
        selection.selectTo( end.row, end.column );
    },
    "SELECT_ALL": () => {
        selection.selectAll();
    },
    "COPY": () => {
        clipboard.text = editor.getSelectedText();
    },
    "PASTE": () => {
        doc.replace( selection.getRange(), clipboard.text );
    },
    "CUT": () => {
        clipboard.text = editor.getSelectedText();
        doc.replace( selection.getRange(), "" );
    },
    "BACKSPACE": () => {
        if ( selection.isEmpty() ) {
            selection.selectLeft();
        }
        doc.replace( selection.getRange(), "" );
    },
    "ENTER": () => {
        editor.insert( "\n" );
    },
    "TAB": () => {
        if ( !selection.isMultiLine() ) {
            editor.insert( "\t" );
        } else {
            editor.blockIndent();
        }
    },
    "UNTAB": () => {
        editor.blockOutdent();
    },
    "OUTPUT": () => {
        doc.replace( selection.getRange(), keyboard.key );
    },
    "FOLD": () => {
        editor.session.toggleFold(true);
    },
    "UNFOLD": () => {
        editor.session.toggleFold(false);
    },
    "UNDO": () => {
        editor.undo();
    },
    "REDO": () => {
        editor.redo();
    }
};

const keyMapping = {};

// map standard characters 
" ~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".split("").forEach( ( char ) => { keyMapping[ char ] = { naked: "OUTPUT", shift: "OUTPUT" }; } );
" `1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./".split("").forEach( ( char ) => { keyMapping[ char ] = { naked: "OUTPUT", shift: "OUTPUT" }; } );

// control characters 
keyMapping["a"].meta = "SELECT_ALL";
keyMapping["c"].meta = "COPY";
keyMapping["v"].meta = "PASTE";
keyMapping["x"].meta = "CUT";
keyMapping["z"].meta = "UNDO";
keyMapping["z"].meta_shift = "REDO";

keyMapping["¬"] = { alt: "FOLD" };
keyMapping["Ò"] = { alt_shift: "UNFOLD" };
keyMapping["Tab"] = { naked: "TAB", shift: "UNTAB" };
keyMapping["Backspace"] = { naked: "BACKSPACE", shift: "BACKSPACE" };
keyMapping["Enter"] = { naked: "ENTER", shift: "ENTER" };

// functions
[ "UIKeyInputDownArrow", "ArrowDown", "\u001f" ].forEach( ( key ) => { 
    keyMapping[ key ] = { naked: "CURSOR_MOVE_DOWN", shift: "CURSOR_SELECT_DOWN", 
    meta: "CURSOR_MOVE_PAGE_END", alt: "CURSOR_MOVE_PAGE_DOWN", 
    meta_shift: "CURSOR_SELECT_PAGE_END", alt_shift: "CURSOR_SELECT_PAGE_DOWN" };
} );

[ "UIKeyInputUpArrow", "ArrowUp", "\u001e" ].forEach( ( key ) => { 
    keyMapping[ key ] = { naked: "CURSOR_MOVE_UP", shift: "CURSOR_SELECT_UP", 
    meta: "CURSOR_MOVE_PAGE_START", alt: "CURSOR_MOVE_PAGE_UP", 
    meta_shift: "CURSOR_SELECT_PAGE_START", alt_shift: "CURSOR_SELECT_PAGE_UP" };
} );

[ "UIKeyInputLeftArrow", "ArrowLeft", "\u001c" ].forEach( ( key ) => { 
    keyMapping[ key ] = { naked: "CURSOR_MOVE_LEFT", shift: "CURSOR_SELECT_LEFT",
    meta: "CURSOR_MOVE_LINE_START", alt: "CURSOR_MOVE_PREVIOUS_WORD", 
    meta_shift: "CURSOR_SELECT_LINE_START", alt_shift: "CURSOR_SELECT_PREVIOUS_WORD" };
} );

[ "UIKeyInputRightArrow", "ArrowRight", "\u001d" ].forEach( ( key ) => { 
    keyMapping[ key ] = { naked: "CURSOR_MOVE_RIGHT", shift: "CURSOR_SELECT_RIGHT",
    meta: "CURSOR_MOVE_LINE_END", alt: "CURSOR_MOVE_NEXT_WORD", 
    meta_shift: "CURSOR_SELECT_LINE_END", alt_shift: "CURSOR_SELECT_NEXT_WORD" };
} );

const keyboard = { newKey: true, key: null, action: null, repeatDelay: null, repeatInterval: null };

const newKey = () => {
    keyboard.newKey = true;
    clearTimeout( keyboard.repeatDelay );
    clearInterval( keyboard.repeatInterval );
};

$( window ).keyup( newKey );

$( window ).keydown( function( e ) {
    e.stopPropagation();
    e.preventDefault();
    
    const key = e[ "key" ];
    
    if ( key !== keyboard.key ) {
        newKey();
    }

    const result = {};
    [
        "altGraphKey", "altKey", "charCode", "code", "ctrlKey", "isComposing", 
        "key", "keyCode", "keyIdentifier", "keyLocation", "location", 
        "metaKey", "repeat", "shiftKey", "which"
    ].forEach( ( id ) => {
        result[ id ] = e[ id ];
    } );
    console.log ( JSON.stringify( result ) );

    const map = keyMapping[ key ];
    const aux = ( ( e.metaKey ? "meta_" : "" ) + ( e.ctrlKey ? "ctrl_" : "" ) + ( e.altKey ? "alt_" : "" ) + ( e.shiftKey ? "shift_" : "" ) ).slice( 0,-1 ) || "naked";
    if ( map && map[ aux ] ) {
        if ( !keyActions[ map[ aux ] ] ) {
            console.warn( `${ map[ aux ] } has no keyActions mapping` );
            keyboard.action = null;
        } else {
            keyboard.key = key;
            keyboard.action = keyActions[ map[ aux ] ];
        }
    } else {
        console.warn( `${ e[ "key"] } has no keyMapping mapping for ${ aux }` );
        keyboard.action = null;
    }
    
    if( keyboard.action && keyboard.newKey ) {
        keyboard.action();
        renderer.scrollCursorIntoView();
        keyboard.repeatDelay = setTimeout(()=>{
            keyboard.repeatInterval = setInterval(()=>{
                keyboard.action();
                renderer.scrollCursorIntoView();
            }, 100); 
        }, 500);
        keyboard.newKey = false;
    }
});

$( "#keycapture" ).click( ( e ) => { 
    const coordinates = renderer.screenToTextCoordinates( e.clientX, e.clientY );
    selection.moveCursorTo( coordinates.row, coordinates.column, false );
} );

$( window ).bind( "touchmove", function( e ) {
    e.preventDefault();
});

// pass-thru events
[ "touchstart", "touchend", "touchmove" ].forEach( ( event_name ) => { 
    document.getElementById( "keycapture" ).addEventListener( event_name, function ( e ) {
        selection.clearSelection();
        document.getElementById( "editor" ).dispatchEvent( new e.constructor( e.type, e ) );
    } );
} );

