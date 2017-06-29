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

