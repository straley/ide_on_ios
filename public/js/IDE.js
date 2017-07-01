/* globals $, ace, Events, KeyMappings, KeyActions, PanelManager */

// const config = require("ace/config");

class IDE {
    constructor( id ) {
        this.id = id; 
        this.clipboard = {text: ""};
        this.editor = ace.edit( id );
        this.session = this.editor.getSession();
        this.document = this.session.getDocument();
        this.selection = this.editor.getSelection();
        this.renderer = this.editor.renderer;
        this.events = new Events( this, id );
        this.keyActions = new KeyActions( this );
        this.keyMappings = new KeyMappings( this );
        this.undoManager = this.session.getUndoManager();
        this.panelManager = new PanelManager( this );
        
        this.renderer.showCursor();
        this.editor.setAutoScrollEditorIntoView( true );
    }

    
    load( filename ) {
        $.getJSON( `/api/load/${ filename }`, {}, ( response ) => {
            this.editor.setValue( response.contents );
            this.selection.clearSelection();
            this.selection.moveCursorFileStart();
            
            //hack
            setTimeout( ()=>{
                this.undoManager.reset();
            }, 700 );
        } );
    } 
    
}

const ide = new IDE( "editor" );

// some default settings for now, move these to a config
ide.editor.$blockScrolling = Infinity;
ide.editor.setTheme( "ace/theme/monokai");
ide.session.setMode( "ace/mode/javascript" );
ide.load( "public/key-actions.js" );

ide.searchbox = ide.panelManager.add( "searchbox", ( dom ) => {
    $( `<input id="search-input-1" type="text" />` ).appendTo( dom );
} );


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

