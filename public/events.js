/* globals $ */

class Events {
    constructor( ide, id ) {
        this.ide = ide;
        this.keyboard = { newKey: true, key: null, action: null, repeatDelay: null, repeatInterval: null, aux: null, target: null };
        $( window ).keyup( this.newKey.bind( this ) );        
        $( window ).keydown( this.keyDown.bind( this ) );
        $( "#keycapture" ).click( this.clickCapture.bind( this ) );
        $( "#keycapture" ).mousemove( this.mousemoveCapture.bind( this ) );
        this.startMomentumMonitor();
        this.isSelectingWithMouse = false;
        if ( id ) {
            this.setTarget( id );
        }
    }
    
    setTarget( target_id ) {
        if ( $( `#${ target_id }` ) ) {
            this.keyboard.target = target_id;
        }
    }
    
    newKey() {
        this.keyboard.newKey = true;
        this.keyboard.key = null;
        this.keyboard.aux = null;
        clearTimeout( this.keyboard.repeatDelay );
        clearInterval( this.keyboard.repeatInterval );
    }
    
    keyDown( e ) {
        e.stopPropagation();
        e.preventDefault();
        
        // this needs to be e[ "key" ] and not e.key
        const key = e[ "key" ];
        
        if ( key !== this.keyboard.key ) {
            this.newKey();
        }
    
        /*
        const result = {};
        [
            "altGraphKey", "altKey", "charCode", "code", "ctrlKey", "isComposing", 
            "key", "keyCode", "keyIdentifier", "keyLocation", "location", 
            "metaKey", "repeat", "shiftKey", "which"Ô
        ].forEach( ( id ) => {
            result[ id ] = e[ id ];
        } );
        console.log ( JSON.stringify( result ) );
        */
        
        const map = this.ide.keyMappings.mapping[ key ];
        const aux = ( ( e.metaKey ? "meta_" : "" ) + ( e.ctrlKey ? "ctrl_" : "" ) + ( e.altKey ? "alt_" : "" ) + ( e.shiftKey ? "shift_" : "" ) ).slice( 0,-1 ) || "naked";
        this.keyboard.key = key;
        this.keyboard.aux = aux;
        if ( map && map[ aux ] ) {
            if ( !this.ide.keyActions.actions[ map[ aux ] ] ) {
                console.warn( `${ map[ aux ] } has no keyActions mapping` );
                this.keyboard.action = null;
            } else {
                this.keyboard.action = this.ide.keyActions.actions[ map[ aux ] ];
            }
        } else {
            console.warn( `${ e[ "key"] } has no keyMapping mapping for ${ aux }` );
            this.keyboard.action = null;
        }
        
        if( this.keyboard.action && this.keyboard.newKey ) {
            this.keyboard.action( e );
            this.ide.renderer.scrollCursorIntoView();
            this.keyboard.repeatDelay = setTimeout( () => {
                this.keyboard.repeatInterval = setInterval( () => {
                    this.keyboard.action( e );
                    this.ide.renderer.scrollCursorIntoView();
                }, 100 ); 
            }, 500 );
            this.keyboard.newKey = false;
        }
        
        this.ide.renderer.scrollCursorIntoView();
    }
    
    clickCapture( e ) {
        const coordinates = this.ide.renderer.screenToTextCoordinates( e.clientX, e.clientY );
        if ( ( typeof this.ide.events.keyboard.aux === "string" ) && this.ide.events.keyboard.aux.includes("shift")  ) {
            this.ide.selection.selectTo( coordinates.row, coordinates.column, false );
        } else {
            if ( !this.isSelectingWithMouse ) {
                this.ide.selection.clearSelection();
                this.ide.selection.moveCursorTo( coordinates.row, coordinates.column, false );
            }
        }
    } 

    mousemoveCapture( e ) {
        if ( e.which ) {
            const coordinates = this.ide.renderer.screenToTextCoordinates( e.clientX, e.clientY );
            if ( !this.isSelectingWithMouse ) {
                this.ide.selection.clearSelection();
                this.isSelectingWithMouse = true;
            }
            this.ide.selection.moveCursorTo( coordinates.row, coordinates.column, false );
            this.ide.selection.selectTo( coordinates.row, coordinates.column, false );
        } else {
            this.isSelectingWithMouse = false;
        }
    } 

    startMomentumMonitor() {
        const $momentum = $( "#momentum" );
        const _renderer = this.ide.renderer;
        const _session = this.ide.session;
        
        const syncMomentum = () => {
            $momentum.height( _renderer.layerConfig.maxHeight );
            if ( _session.getScrollTop() !== -$momentum.position().top ) {
                _session.setScrollTop( -$momentum.position().top );
            }
            window.requestAnimationFrame( syncMomentum );
        };
        syncMomentum();
    }
}
