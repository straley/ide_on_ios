/* globals $ */

class Comm {
    constructor() {
        this.sessionId = false;
        this.nextId = false;
        this.queue = [];
        this._checkQueue = false;
    }
    
    auth( user, pass, callback ) {
        $.ajax( {
           url: "/api/auth",
           method: "POST",
           data: { user, pass },
           dataType: "json",
           success: ( response ) => {
               if ( response.user === user && response.session && response.next ) {
                   this.nextId = response.next;
                   this.sessionId = response.session;
                   callback( true );
               } else {
                   callback( false );
               }
            },
            error: ( response ) => {
               return false;
            }
        } );
    }
    
    enqueue( request ) {
        this.queue.push( request );
        this.nextQueue();
    }
    
    processQueue() {
        this._checkQueue = false;
        if ( this.queue.length ) {
            if ( this.nextId ) {
                const nextId = this.nextId;
                this.nextId = false;
                const request = this.queue.shift();
                $.ajax( {
                   url: request.url,
                   method: "POST",
                   data: Object.assign( request.data || {}, { session: this.sessionId, next: nextId } ),
                   dataType: "json",
                   success: ( response ) => {
                       if ( !response.error && response.next ) {
                           this.nextId = response.next;
                           request.callback( response );
                           this.nextQueue();
                       } else {
                           request.callback( { error: "no next id" } );
                           this.nextQueue();
                       }
                    },
                    error: ( response ) => {
                       request.callback( { error: "error" } );
                       this.nextQueue();
                    }
                } );
            } else {
                this.nextQueue();
            }
        }
    }
    
    nextQueue() {
        if ( !this._checkQueue ) {
            this._checkQueue = setTimeout( this.processQueue.bind( this ), 200 );
        }
    }
    
    ls( path, callback ) {
        this.enqueue( {
            url: `/api/ls/${path}`,
            callback
        } );
    }
}