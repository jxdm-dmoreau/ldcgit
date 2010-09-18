
ldc.catTree = function () {

    var AJAX_URL = "../server/get_categories3.php";
    var SELECTOR = "#cat-tree";

    function storeCategories(data, textStatus) {
        ldc.data.cats = data;
        constructTree();
    }

    function getCategories() {
        $.getJSON(AJAX_URL, storeCategories);
    }


    function constructTree()  {

        var jDiv = $("#cat-tree");


        function display_cat_r(cat, html) {
            html += '<li id="cat_'+cat.id+'" cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
            var children = cat.children;
            if (children.length > 0) {
                html += '<ul>';
                for(var i in children) {
                    html = display_cat_r(children[i], html);
                }
                html += '</ul>';
            }
            html += '</li>';
            return html;
        }

        html = '<ul>';
        html += '<li rel="root" id="cat_0" cat_id="0"><a href="#"><ins>&nbsp;</ins>Catégories</a><ul>';
        for(var i in ldc.data.cats) {
            html = display_cat_r(ldc.data.cats[i], html);
        }
        html += '</ul></li></ul>';
        jDiv.append(html);


        /* jstree events */
        $(SELECTOR).bind("create.jstree", function(e, data) {
                var fNode = $(SELECTOR).jstree("get_selected");
                var fId = xtractId($(fNode).attr("id"));
                var name = $(SELECTOR+" li.new a").text();
                ldc.cat.add(name, fId, function(id) {
                    $(SELECTOR+" li.new").attr("id", "cat_"+id).removeClass("new");
                });
                return false;
        });

        $(SELECTOR).bind("rename.jstree", function(e, data) {
            var fNode = $(SELECTOR).jstree("get_selected");
            var id = xtractId($(fNode).attr("id"));
            var name = $(fNode).children("a").text();
            DEBUG($(fNode).attr("id"));
                return false;
        });

        $(SELECTOR).bind("remove.jstree", function(e, data) {
            var id = xtractId(ldc.catTree.idToRemove);
            ldc.cat.del(id);
        });

        $(SELECTOR).jstree({
            "themes" : {
                "theme" : "apple",
                "dots" : true,
                "icons" : true
            },
            "plugins" : [ "themes",  "html_data", "ui", "crrm" ],
            "core" : { "initially_open" : [ "cat_0" ] },
            "ui" :{ "select_limit" : 1}
        });


    }




    ldc.catTree.fill = function () {
        getCategories();
    }


    ldc.catTree.create = function() {
        var node = ($(SELECTOR).jstree("get_selected"));
        if ($(node).attr('class')=='new') {
            ldc.logger.error("Classe parente invalide");
            return false;
        }
        $(SELECTOR).jstree("create", null, "inside", {"attr": {'class':"new"}});
    }

    ldc.catTree.rename = function() {
        $(SELECTOR).jstree("rename");
    }

    ldc.catTree.remove = function() {
        ldc.catTree.idToRemove = $($(SELECTOR).jstree("get_selected")).attr("id");
        $(SELECTOR).jstree("remove");
    }

    ldc.catTree.getSelected = function() {
        var node = ($(SELECTOR).jstree("get_selected"));
        return ($(node).children("a").text());
    }

    function xtractId(str) {
        var tmp = str.split('_');
        return tmp[1];
    }
}


