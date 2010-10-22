(function(has, addtest, cssprop){

    if(!has("dom")){ return; }

    addtest("dom-quirks", function(g, d, el){
        if(typeof d.compatMode == "string"){
            return (d.compatMode == "BackCompat");
        }
        el.style.width = "1";
        var supported = e.style.width === "1px";
        el.style.cssText = "";
        return supported;
    });

    addtest("dom-dataset", function(g, d, el){
        el.setAttribute("data-a-b", "c");
        return has.isHostType(el, "dataset") && el.dataset.aB == "c";
    });

    // works in all but IE < 9
    addtest("dom-addeventlistener", function(g, d){
        return has.isHostType(d, "addEventListener");
    }, true);

    // works in all but IE
    addtest("dom-createelementns", function(g, d){
        return has.isHostType(d, "createElementNS");
    });

    // should fail in webkit, as they dont support it.
    addtest("dom-attrmodified", function(g, d, el){
        var supported = false,
            listener = function(){ supported = true; };

        if(has("dom-addeventlistener")){
            supported = false;
            el.addEventListener("DOMAttrModified", listener, false);
            el.setAttribute("___TEST___", true);
            el.removeAttribute("___TEST___", true);
            el.removeEventListener("DOMAttrModified", listener, false);
        }
        return supported;
    });

    addtest("dom-subtreemodified", function(g, d, el){
        var supported = false,
            listener = function(){ supported = true; };

        if(has("dom-addeventlistener")){
            supported = false;
            el.appendChild(d.createElement("div"));
            el.addEventListener("DOMSubtreeModified", listener, false);
            has.clearElement(el);
            el.removeEventListener("DOMSubtreeModified", listener, false);
        }
        return supported;
    });

    //  FROM cft.js
    addtest("dom-children", function(g, d, el){
        var supported = false;
        if(has.isHostType(el, "children")){
            var div = el.appendChild(d.createElement("div")),
                children = el.children;

            // Safari 2.x returns ALL children including text nodes
            el.appendChild(d.createTextNode("x"));
            div.appendChild(div.cloneNode(false));
            supported = !!children && children.length == 1 && children[0] == div;
            has.clearElement(el);
        }
        return supported;
    });

    // true for html, xhtml and unknown elements are case
    // sensitive to how they are written in the markup
    addtest("dom-tagname-uppercase", function(g, d, el){
        return el.nodeName == "DIV";
    });

    addtest("dom-html5-elements", function(g, d, el){
        el.innerHTML = "<nav>a</nav>";
        return el.childNodes.length == 1;
    });


    // TODO: see
    // http://msdn.microsoft.com/en-us/library/ms536389(VS.85).aspx vs
    // http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-2141741547
    addtest("dom-create-attr", function(g, d){
        var supported = false;
        try{
            d.createElement("<input type='hidden' name='hasjs'>");
            supported = true;
        }catch(e){}
        return supported;
    });

    // true for IE
    addtest("dom-selectable", function(g, d, el){
        var supported = false;
        try{
          // TODO: this test is really testing if expando's become attributes (IE)
          el.unselectable = "on";
          supported = typeof e.attributes.unselectable != "undefined" &&
                e.attributes.unselectable.value == "on";
        }catch(e){}
        el.unselectable = "off";
        return supported;
    });

    // true for all modern browsers, including IE 9+
    addtest("dom-computed-style", function(g, d){
        return has.isHostType(d, "defaultView") && has.isHostType(d.defaultView, "getComputedStyle");
    });

    // true for IE
    addtest("dom-current-style", function(g, d){
        return !has("dom-computed-style") && has.isHostType(d.documentElement, "currentStyle");
    });

    // true for IE
    addtest("dom-element-do-scroll", function(g, d){
        return has.isHostType(d.documentElement, "doScroll");
    });

})(has, has.add, has.cssprop);
