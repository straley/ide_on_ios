class KeyMappings {
    
    constructor( ide ) {
        this.ide = ide;
        this.mapping = {};

        // map standard characters 
        " ~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".split("").forEach( ( char ) => { this.mapping[ char ] = { naked: "OUTPUT", shift: "OUTPUT" }; } );
        " `1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./".split("").forEach( ( char ) => { this.mapping[ char ] = { naked: "OUTPUT", shift: "OUTPUT" }; } );

        // control characters
        
        this.mapping[ "`" ].meta = "ESCAPE";
        
        this.mapping[ "a" ].meta = "SELECT_ALL";
        this.mapping[ "c" ].meta = "COPY";
        this.mapping[ "f" ].meta = "FIND";
        this.mapping[ "v" ].meta = "PASTE";
        this.mapping[ "x" ].meta = "CUT";
        this.mapping[ "z" ].meta = "UNDO";
        this.mapping[ "z" ].meta_shift = "REDO";
        
        this.mapping[ "“" ] = { meta_alt_shift: "TOGGLE_FOLD_BRACES" }; // ⌥⌘{
        this.mapping[ "‘" ] = { meta_alt_shift: "TOGGLE_FOLD_BRACES" }; // ⌥⌘}
        this.mapping[ "“" ] = { meta_alt: "TOGGLE_FOLD_BRACKETS" }; // ⌥⌘[
        this.mapping[ "‘" ] = { meta_alt: "TOGGLE_FOLD_BRACKETS" }; // ⌥⌘]
        this.mapping[ "·" ] = { meta_alt_shift: "TOGGLE_FOLD_PARETHESES" }; // ⌥⌘(
        this.mapping[ "‚" ] = { meta_alt_shift: "TOGGLE_FOLD_PARETHESES" }; // ⌥⌘)
        
        this.mapping[ "Tab" ] = { naked: "TAB", shift: "UNTAB" };
        this.mapping[ "Backspace" ] = { naked: "BACKSPACE", shift: "BACKSPACE" };
        this.mapping[ "Enter" ] = { naked: "ENTER", shift: "ENTER" };
        
        // functions
        [ "UIKeyInputDownArrow", "ArrowDown", "\u001f" ].forEach( ( key ) => { 
            this.mapping[ key ] = { naked: "CURSOR_MOVE_DOWN", shift: "CURSOR_SELECT_DOWN", 
            meta: "CURSOR_MOVE_PAGE_END", alt: "CURSOR_MOVE_PAGE_DOWN", 
            meta_shift: "CURSOR_SELECT_PAGE_END", alt_shift: "CURSOR_SELECT_PAGE_DOWN" };
        } );
        
        [ "UIKeyInputUpArrow", "ArrowUp", "\u001e" ].forEach( ( key ) => { 
            this.mapping[ key ] = { naked: "CURSOR_MOVE_UP", shift: "CURSOR_SELECT_UP", 
            meta: "CURSOR_MOVE_PAGE_START", alt: "CURSOR_MOVE_PAGE_UP", 
            meta_shift: "CURSOR_SELECT_PAGE_START", alt_shift: "CURSOR_SELECT_PAGE_UP" };
        } );
        
        [ "UIKeyInputLeftArrow", "ArrowLeft", "\u001c" ].forEach( ( key ) => { 
            this.mapping[ key ] = { naked: "CURSOR_MOVE_LEFT", shift: "CURSOR_SELECT_LEFT",
            meta: "CURSOR_MOVE_LINE_START", alt: "CURSOR_MOVE_PREVIOUS_WORD", 
            meta_shift: "CURSOR_SELECT_LINE_START", alt_shift: "CURSOR_SELECT_PREVIOUS_WORD" };
        } );
        
        [ "UIKeyInputRightArrow", "ArrowRight", "\u001d" ].forEach( ( key ) => { 
            this.mapping[ key ] = { naked: "CURSOR_MOVE_RIGHT", shift: "CURSOR_SELECT_RIGHT",
            meta: "CURSOR_MOVE_LINE_END", alt: "CURSOR_MOVE_NEXT_WORD", 
            meta_shift: "CURSOR_SELECT_LINE_END", alt_shift: "CURSOR_SELECT_NEXT_WORD" };
        } );
    }
}

