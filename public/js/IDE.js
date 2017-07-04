/* globals $, ace, Events, KeyMappings, KeyActions, PanelManager, FileTree, Tabs, Comm */

class IDE {
    constructor( id ) {
        this.id = id; 
        this.comm = new Comm();
        this.files = {};
        
        $( "#dock-left" ).resizable( {
            handleSelector: ".splitter",
            resizeHeight: false
        } );
        
        
        $( "#login-form-form" ).bind( "submit", ( e )=>{
            e.preventDefault();
            setTimeout( () => {
                this.comm.auth( $( "#login-user" ).val(), $( "#login-pass" ).val(), ( response ) => { 
                    if ( response ) {
                        this.afterLogin();
                    } else {
                        // handle error
                    }
                } );
            }, 1);
        } );
    }
    
    afterLogin() {
        $("#login-modal").hide();
        $("#login-form").hide();
        
        this.clipboard = {text: ""};
        this.editor = ace.edit( this.id );
        this.modelist = ace.require( "ace/ext/modelist" );
        this.session = this.editor.getSession();
        this.document = this.session.getDocument();
        this.selection = this.editor.getSelection();
        this.renderer = this.editor.renderer;
        this.events = new Events( this, this.id );
        this.keyActions = new KeyActions( this );
        this.keyMappings = new KeyMappings( this );
        this.undoManager = this.session.getUndoManager();
        this.panelManager = new PanelManager( this );
        this.tabs = new Tabs( "tabs" );
        
        this.renderer.showCursor();
        this.editor.setAutoScrollEditorIntoView( true );
        
        this.filetree = new FileTree( this, "dock-left" );
        
        // some default settings for now, move these to a config
        this.editor.$blockScrolling = Infinity;
        this.editor.setTheme( "ace/theme/monokai");
        
        this.searchbox = this.panelManager.add( "searchbox", ( dom ) => {
            $( `<input id="search-input-1" type="text" />` ).appendTo( dom );
        } );
        
        // add tab for empty file
        this.tabs.add().activate();
        this.events.start();
    }

    
    load( filename ) {
        $.getJSON( `/api/load/${ filename }`, {}, ( response ) => {
            this.tabs.add( {
                title: filename,
                filename: filename,
                saved: response.contents,
                current: response.contents,
                onActivate: ( tab ) => {
                    this.editor.setValue( tab.settings.current );
                    this.session.setMode( this.modelist.getModeForPath( tab.settings.filename ).mode );    
                    this.selection.clearSelection();
                    this.selection.moveCursorFileStart();
                    //hack -- todo: save undo states 
                    setTimeout( ()=>{
                        this.undoManager.reset();
                    }, 700 );
                }
            } ).activate();

        } );
    } 
}

