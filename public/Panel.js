/* globals PanelManager */

class Panel {
    constructor( ide, id, location=Panel.BOTTOM ) {
        this.ide = ide;
        this.id = id;
        this.location = location;
    }
}

Panel.BOTTOM = Panel.prototype.BOTTOM = "BOTTOM";