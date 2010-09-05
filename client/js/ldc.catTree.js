
ldc.catTree = function () {

    var AJAX_URL = "../server/get_categories3.php";

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
            html += '<li cat_id="'+cat.id+'"><a href="#"><ins>&nbsp;</ins>'+cat.name+'</a>';
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
        html += '<li rel="root" cat_id="0"><a href="#"><ins>&nbsp;</ins>Catégories</a><ul>';
        for(var i in ldc.data.cats) {
            html = display_cat_r(ldc.data.cats[i], html);
        }
        html += '</ul></li></ul>';
        jDiv.append(html);

    $("#cat-tree").jstree({
        "themes" : {
            "theme" : "apple",
            "dots" : true,
            "icons" : true
        },
        "plugins" : [ "themes",  "html_data" ],
    });
}

    ldc.catTree.fill = function () {
        getCategories();
    }
}


