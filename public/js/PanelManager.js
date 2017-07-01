/* globals $, Panel */

class PanelManager {
    constructor( ide ) {
        this.ide = ide;
        this.panels = {};
    }
    
    add( id, builder, location=Panel.BOTTOM ) {
        let dom = $(`<div id="${ id }"></div>`);
        builder( dom );
        if ( location === Panel.BOTTOM ) {
            console.log( "ADDING", dom );
            $( "#dock-bottom" ).append( dom );
        }
        const panel = new Panel( this.ide, id, location );
        this.panels[ id ] = panel;
    }
}
