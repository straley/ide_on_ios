/* globals $, ace, performance */

class UI {}

UI.unique = UI.prototype.unique = () => {
    return Math.floor( ( ( Math.floor( Date.now() / 1000 ) + ( ( performance.now() / 1000) % 1 ) * 1000000 ) + Math.random() ) * 1000 ).toString(36);
}

UI.SafeTextInput = UI.prototype.SafeTextInput = class {
    constructor( ide, parent, parameters ) {
        this._ide = ide;
        this._parent = parent;
        
        if ( !parameters ) {
            parameters = {};
        }
          
        if ( !parameters.id ) {
            parameters.id = "safetext-" + UI.unique();
        }
        
        this.parameters = parameters;
        
        //todo: add input ephermeral field and overlay with visibile div
        //see:
        /*
                const orig_id  = $( "#searchbox" ).children().first().attr( "id" );
                const new_id = orig_id.slice( 0, orig_id.lastIndexOf( "-" ) ) + "-" + ( parseInt( orig_id.slice( orig_id.lastIndexOf( "-" ) + 1 ), 10 ) + 1 );
                const search_panel = $("#searchbox");
                $( `#${orig_id}` ).remove();
                $( `<input id="${ new_id }" class="" type="text" value="${ new_id }" />` ).appendTo( search_panel );
                setTimeout( () => {
                    // do this to lose focus from the input so ios doesn't pop-up the built-in search box on subsequent finds
                    $( `#${ new_id }` ).remove();
                    $( `<input id="${ new_id }" type="text" value="${ new_id }" />` ).appendTo( search_panel );
                    
                }, 10 );

                $( `#${ new_id }` ).focus();
                $( "#editor-container" ).css( { height: `calc( 100% - ${ 300 }px )` }) ;
                $( "#editor" ).css( { height: `calc( 100% - ${ 300 }px )` }) ;
                this.ide.editor.resize( true );
                this.ide.events.newKey();
        */
        
        this._dom = $( `
            <div id="${ parameters.id }" class="safetext">
                <div id="${ parameters.id }-editor" class="safetext"></div>
                ${ this._inputBox() }
            </div>
        ` );
        
        this._dom.appendTo( this._parent );
        this._editor = ace.edit( `${ parameters.id }-editor` );
        this._editor.setOptions( {
            hScrollBarAlwaysVisible: false,
            vScrollBarAlwaysVisible: false,
            highlightGutterLine: false,
            animatedScroll: false,
            showInvisibles: false,
            showPrintMargin:false,
            showFoldWidgets: false,
            showLineNumbers: false,
            showGutter: false,
            displayIndentGuides: false,
            maxLines: 1,
            minLines:1,
            scrollPastEnd: false,
            mode: "ace/mode/plain_text"
        } );
        this._session = this._editor.getSession();
        this._document = this._session.getDocument();
        
        this._dom.on( "keypress", ( e ) => {
            this._document.replace( this._editor.selection.getRange(), e.key );
        } );
    }
    
    get id() {
        return this.parameters.id;
    }
    
    get dom() {
        return this._dom;
    }
    
    _inputBox() {
        this._current_input_box = `${ this.parameters.id }-input-${ UI.unique() }`;
        return `<input id="${ this._current_input_box }" class="safetext-input" type="text"/>`;
    }
    
    _detatchInputBox() {
        this._attached = false;
        $( `#${ this._current_input_box }` ).remove();
        this._ide.events.keyboard.target = this._ide.id;
    }
    
    _attachInputBox() {
        this._attached = true;
        $( this._inputBox() ).appendTo( `#${ this.parameters.id }` );
        this._ide.events.keyboard.target = this.parameters.id;
        this._editor.renderer.showCursor();
    }
    
    focus() {
        $( `#${ this._current_input_box }` ).focus();
        setTimeout( ()=>{
            this._detatchInputBox();
            this._attachInputBox();
        }, 1 );
    }
    
    
    

};