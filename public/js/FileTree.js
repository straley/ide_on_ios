/* globals $ */

class FileTree {
    constructor( ide, target, path="" ) {
        this.ide = ide;
        this.target = target;
        this.path = path;
        
        $.getJSON( `/api/ls/${ path }`, {}, ( source ) => {
            $( `#${ target }` ).fancytree( {
                source,
                lazyLoad: ( event, data ) => {
                    data.result = {
                        url: `/api/ls/${ data.node.key }`
                    };
                },
                clickFolderMode: 3,
                click: (event, data) => {
                    if ( data.targetType === "icon" || data.targetType == "title" ) {
                        if ( !data.node.folder ) {
                            this.ide.load( data.node.key );
                        }
                    }
                }
            });
        });
    }
}