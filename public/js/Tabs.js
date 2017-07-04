/* globals $ */

// inspired by https://codepen.io/ademilter/pen/wfAer

class Tabs {
    constructor( target ) {
        this.$target = 
            ( typeof target === "string" ) ? 
            ( target.substr( 0, 1 ) === "#" ? $( target ) : $( `#${ target }` ) ) :
            target;
        this.tabs = [];
        this._nextId = 1;
        this.activeTab = false;
    }
    
    nextId() {
        return this._nextId++;
    }
    
    add( settings={} ) {
        settings.tabs = this;
        const tab = new Tab( settings );
        this.tabs.push( tab );
        this.$target.append( tab.$dom );
        
        const $tab = $( `#tab-${ tab.id }` );
        $tab.click( ( e ) => {
            e.stopPropagation();
            e.preventDefault();
            tab.activate();
        } );
        
        return tab;
    }
    
    activate( id ) {
        this.tabs.forEach( ( tab ) => {
            const $tab = $( `#tab-${ tab.id }` );
            if ( tab.id === id ) {
                $tab.addClass( "active" );
                this.activeTab = tab;
                tab.onActivate( tab );
            } else {
                if ( $tab.hasClass( "active" ) ) {
                    $tab.removeClass( "active" );
                    tab.onDeactivate( tab );
                }
            }
        } );
        
    }
}


class Tab {
    constructor( settings ) {
        if ( !settings ) {
            throw "Tab created without settings";
            return;
        }
        
        if ( !settings.tabs ) {
            throw "Tab created without Tabs container";
            return;
        }
        
        if ( !settings.style ) {
            settings.style = "";
        }
        
        this.settings = settings;
        this.id = settings.id || settings.tabs.nextId();
        this.tabs = settings.tabs;
        this.title = settings.title || "New File";
        this.className = settings.className;
        
        this.onActivate = settings.onActivate ? settings.onActivate : () => {};
        this.onDeactivate = settings.onDeactivate ? settings.onDeactivate: () => {};
        
        this.$dom = $( `<div id="tab-${ this.id }" class="tab${ this.className ? ` ${ this.className }` : "" }"><span>${ this.title }</span><a href="#">×</a></div>` ); //
    }
    
    activate() {
        
        this.tabs.activate( this.id );
    }
    
    dirty( isDirty = true ) {
        const $tab = $( `#tab-${ this.id }` );
        if ( isDirty ) {
            $tab.addClass( "dirty" );
        } else {
            $tab.removeClass( "dirty" );
        }
    }
    
    keep( isKeep = true ) {
        const $tab = $( `#tab-${ this.id }` );
        if ( isKeep ) {
            $tab.addClass( "keep" );
        } else {
            $tab.removeClass( "keep" );
        }
    }
}