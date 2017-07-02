/* globals $, ace, Events, KeyMappings, KeyActions, PanelManager, FileTree */

// const config = require("ace/config");

class IDE {
    constructor( id ) {
        this.id = id; 
        this.clipboard = {text: ""};
        this.editor = ace.edit( id );
        this.modelist = ace.require( "ace/ext/modelist" );
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
        
        this.filetree = new FileTree( this, "dock-left" );
        
        $("#dock-left").resizable({
            handleSelector: ".splitter",
            resizeHeight: false
        });
        
    }

    
    load( filename ) {
        window.location.hash = filename;
        $.getJSON( `/api/load/${ filename }`, {}, ( response ) => {
            this.session.setMode( this.modelist.getModeForPath( filename ).mode );

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

ide.searchbox = ide.panelManager.add( "searchbox", ( dom ) => {
    $( `<input id="search-input-1" type="text" />` ).appendTo( dom );
} );

if ( window.location.hash ) {
    ide.load( window.location.hash.replace(/^#/, "") );
}
