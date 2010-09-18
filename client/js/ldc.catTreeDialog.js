ldc.catTreeDialog = function() {

        var SELECTOR = "#cat-tree-dialog"; 

        /* tree */
        ldc.catTree.fill();
        $(SELECTOR).dialog({ 
                modal: true,
                buttons: { "Ok": selectCat},
                autoOpen: false,
                draggable: true,
                title: 'Catégories',
                resizable: true
        });
        /* open tree */
        $("div.cat").delegate("a", "click", function() {
                $("#cat-tree-dialog").dialog("open");
                return false;
        });

        /* actions on tree buttons */
        $(SELECTOR+" button.create").click(function() {
                ldc.catTree.create();
                return false;
                });
        $(SELECTOR+" button.remove").click(function() {
                var name = ldc.catTree.getSelected();
                if (confirm("Voulez-vous vraiment supprimer la catégorie "+name+" ainsi que toutes ses sous-categories?")) {
                    ldc.catTree.remove();
                }
                return false;
                });
        $(SELECTOR+" button.rename").click(function() {
                ldc.catTree.rename();
                return false;
                });

        function selectCat() {
            return false;
        }
}
