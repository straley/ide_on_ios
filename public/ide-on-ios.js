/* globals ace, $ */

const clipboard = {text: ""};

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

load("public/ide-on-ios.js");

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
    
    // this needs to be e[ "key" ] and not e.key
    const key = e[ "key" ];
    
    if ( key !== keyboard.key ) {
        newKey();
    }

    /*
    const result = {};
    [
        "altGraphKey", "altKey", "charCode", "code", "ctrlKey", "isComposing", 
        "key", "keyCode", "keyIdentifier", "keyLocation", "location", 
        "metaKey", "repeat", "shiftKey", "which"
    ].forEach( ( id ) => {
        result[ id ] = e[ id ];
    } );
    console.log ( JSON.stringify( result ) );
    */
    
    const map = keyMapping[ key ];
    const aux = ( ( e.metaKey ? "meta_" : "" ) + ( e.ctrlKey ? "ctrl_" : "" ) + ( e.altKey ? "alt_" : "" ) + ( e.shiftKey ? "shift_" : "" ) ).slice( 0,-1 ) || "naked";
    if ( map && map[ aux ] ) {
        if ( !keyActions[ map[ aux ] ] ) {
            // console.warn( `${ map[ aux ] } has no keyActions mapping` );
            keyboard.action = null;
        } else {
            keyboard.key = key;
            keyboard.action = keyActions[ map[ aux ] ];
        }
    } else {
        // console.warn( `${ e[ "key"] } has no keyMapping mapping for ${ aux }` );
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

