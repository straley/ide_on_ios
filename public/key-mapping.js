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
