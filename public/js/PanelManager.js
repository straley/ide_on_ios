/* globals $, Panel */

class PanelManager {
    constructor( ide ) {
        this.ide = ide;
        this.panels = {};
    }
    
    add( id, target, builder ) {
        const $target = 
            ( typeof target === "string" ) ? 
            ( target.substr( 0, 1 ) === "#" ? $( target ) : $( `#${ target }` ) ) :
            target;

        let dom = $( `<div id="${ id }"></div>` );
        $target.append( dom );
            
        if ( builder ) {
            builder( dom );
        }
        const panel = new Panel( this.ide, id, location );
        this.panels[ id ] = panel;
    }
}
