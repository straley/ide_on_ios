/* globals $, Comm */

class FileTree {
    constructor( ide, target, path="" ) {
        this.ide = ide;
        this.target = target;
        this.path = path;
        
        this.ide.comm.ls( path, ( source ) => { 
            $( `#${ target }` ).fancytree( {
                source: source.files,
                lazyLoad: ( event, data ) => {
                    const deferred = new $.Deferred();
                    data.result = deferred.promise();
                    this.ide.comm.ls( data.node.key, ( response ) => {
                        deferred.resolve( response.files );    
                    } );
                },
                clickFolderMode: 3,
                click: (event, data) => {
                    if ( data.targetType === "icon" || data.targetType == "title" ) {
                        if ( !data.node.folder ) {
                            this.ide.load( data.node.key );
                        }
                    }
                }
            } );
        } ); 
    }
}