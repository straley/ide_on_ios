/* globals $, UI */

class KeyActions {
    constructor( ide ) {
        this.ide = ide;
        
        this.actions = { 
            "CURSOR_MOVE_UP" : () => {
                this.ide.selection.clearSelection();
                this.ide.selection.moveCursorUp();
            },
            "CURSOR_MOVE_DOWN" : () => {
                this.ide.selection.clearSelection();
                this.ide.selection.moveCursorDown();
            },
            "CURSOR_MOVE_LEFT" : () => {
                this.ide.selection.clearSelection();
                this.ide.selection.moveCursorLeft();
            },
            "CURSOR_MOVE_RIGHT" : () => {
                this.ide.selection.clearSelection();
                this.ide.selection.moveCursorRight();
            },
            "CURSOR_SELECT_UP" : () => {
                this.ide.selection.selectUp();
            },
            "CURSOR_SELECT_DOWN" : () => {
                this.ide.selection.selectDown();
            },
            "CURSOR_SELECT_LEFT" : () => {
                this.ide.selection.selectLeft();
            },
            "CURSOR_SELECT_RIGHT" : () => {
                this.ide.selection.selectRight();
            },
            "CURSOR_MOVE_PAGE_START": () => {
                this.ide.selection.moveCursorFileStart();
            },
            "CURSOR_MOVE_PAGE_UP": () => {
                this.ide.editor.gotoPageUp();
            },
            "CURSOR_SELECT_PAGE_START": () => {
                this.ide.selection.selectTo( 0, 0 );
            },
            "CURSOR_SELECT_PAGE_UP": () => {
                this.ide.editor.selectPageUp();
            },
            "CURSOR_MOVE_PAGE_END": () => {
                this.ide.selection.moveCursorFileEnd();
            },
            "CURSOR_MOVE_PAGE_DOWN": () => {
                this.ide.editor.gotoPageDown();
            },
            "CURSOR_SELECT_PAGE_END": () => {
                this.ide.selection.selectTo( this.ide.document.getLength() + 1, 0 );
            },
            "CURSOR_SELECT_PAGE_DOWN": () => {
                this.ide.editor.selectPageDown();
            },
            "CURSOR_MOVE_LINE_END": () => {
                this.ide.selection.moveCursorLineEnd();
            },
            "CURSOR_MOVE_NEXT_WORD": () => {
                this.ide.selection.moveCursorLongWordRight();
            },
            "CURSOR_SELECT_LINE_END": () => {
                const cursor = this.ide.selection.getCursor();
                const lineLength = this.ide.document.getLine( cursor.row ).length;
                this.ide.selection.selectTo( cursor.row, lineLength );
            },
            "CURSOR_SELECT_NEXT_WORD": () => {
                const start = this.ide.selection.getCursor();
                this.ide.selection.moveCursorLongWordRight();
                const end = this.ide.selection.getCursor();
                this.ide.selection.moveCursorTo( start.row, start.column );
                this.ide.selection.selectTo( end.row, end.column );
            },
            "CURSOR_MOVE_LINE_START": () => {
                this.ide.selection.moveCursorLineStart();
            },
            "CURSOR_MOVE_PREVIOUS_WORD": () => {
                this.ide.selection.moveCursorLongWordLeft();
            },
            "CURSOR_SELECT_LINE_START": () => {
                const cursor = this.ide.selection.getCursor();
                this.ide.selection.selectTo( cursor.row, 0 );
            },
            "CURSOR_SELECT_PREVIOUS_WORD": () => {
                const start = this.ide.selection.getCursor();
                this.ide.selection.moveCursorLongWordLeft();
                const end = this.ide.selection.getCursor();
                this.ide.selection.moveCursorTo( start.row, start.column );
                this.ide.selection.selectTo( end.row, end.column );
            },
            "SELECT_ALL": () => {
                this.ide.selection.selectAll();
            },
            "COPY": () => {
                this.ide.clipboard.text = this.ide.editor.getSelectedText();
            },
            "PASTE": () => {
                this.ide.document.replace( this.ide.selection.getRange(), this.ide.clipboard.text );
            },
            "CUT": () => {
                this.ide.clipboard.text = this.ide.editor.getSelectedText();
                this.ide.document.replace( this.ide.selection.getRange(), "" );
            },
            "BACKSPACE": () => {
                if ( this.ide.selection.isEmpty() ) {
                    this.ide.selection.selectLeft();
                }
                this.ide.document.replace( this.ide.selection.getRange(), "" );
            },
            "ENTER": () => {
                this.ide.editor.insert( "\n" );
            },
            "TAB": () => {
                if ( !this.ide.selection.isMultiLine() ) {
                    this.ide.editor.insert( "\t" );
                } else {
                    this.ide.editor.blockIndent();
                }
            },
            "UNTAB": () => {
                this.ide.editor.blockOutdent();
            },
            "OUTPUT": ( e ) => {
                if ( this.ide.events.keyboard.target === this.ide.id ) {
                    this.ide.document.replace( this.ide.selection.getRange(), this.ide.events.keyboard.key );
                } else {
                    $( `#${this.ide.events.keyboard.target}` ).trigger( Object.assign( $.Event( "keypress" ), { key: this.ide.events.keyboard.key } ) );
                }
            },
            "TOGGLE_FOLD_PARETHESES": () => {
                this.toggleFold( /[\(\)](?=[^\(\)]*$)/ );
            },
            "TOGGLE_FOLD_BRACES": () => {
                this.toggleFold( /[\{\}](?=[^\{\}]*$)/ );
            },
            "TOGGLE_FOLD_BRACKETS": () => {
                this.toggleFold( /[\[\]](?=[^\[\]]*$)/ );
            },
            "UNDO": () => {
                this.ide.editor.undo();
            },
            "REDO": () => {
                this.ide.editor.redo();
            },
            "FIND": () => {
                // hacking it here... 
                
                $( "#search-panel" ).height( 40 );
                
                // todo: this should all be handled by panel, so we're not always recreating this
                const $search_panel = $("#searchbox");
                const orig_id  = $search_panel.children().first().attr( "id" );
                if ( orig_id ) {
                    $( `#${orig_id}` ).remove();
                }
                const safetext = new UI.SafeTextInput( this.ide, $search_panel );
                // const new_id = safetext.id;
                safetext.focus();
                this.ide.events.newKey();
                
                /*
                const orig_id  = $( "#searchbox" ).children().first().attr( "id" );
                const new_id = orig_id.slice( 0, orig_id.lastIndexOf( "-" ) ) + "-" + ( parseInt( orig_id.slice( orig_id.lastIndexOf( "-" ) + 1 ), 10 ) + 1 );
                $( `#${orig_id}` ).remove();
                $( `<input id="${ new_id }" type="text" value="${ new_id }" />` ).appendTo( search_panel );
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
            },
            "ESCAPE": () => {
                $( "#dock-bottom" ).height( 0 );
                $( "#editor-container" ).css( { height: `calc( 100% - ${ 0 }px )` }) ;
                $( "#editor" ).css( { height: `calc( 100% - ${ 0 }px )` }) ;
                this.ide.editor.resize( true );
                this.ide.events.newKey();
            }
        };
    }
    
    toggleFold( regexp=/[\(\[\{](?=[^\(\[\{]*$)/ ) {
        const range = this.ide.selection.getRange();
        if ( range.isEmpty() ) {
            const cursor = this.ide.selection.getCursor();
            const line = this.ide.document.getLine( cursor.row );
            const pos = line.search( regexp ); // get last in row
            if ( pos ) {
                this.ide.selection.moveCursorTo( cursor.row, pos, false );
            }
            this.ide.session.toggleFold( true );
            this.ide.selection.moveCursorTo( cursor.row, cursor.column, false );
        } else {
            this.ide.session.toggleFold( true );
        }
    }
    
}


