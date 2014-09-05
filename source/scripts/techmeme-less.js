
/*jslint regexp: true*/
/*global document, alert, chrome*/

(function () {
    "use strict";

    function displayNode(node, display) {
        if (node && typeof node !== 'object') {
            node = document.getElementById(node);
        }
        if (node && node.style) {
            node.style.display = display;
        }
        return node;
    }

    function displayNodes(value, display) {
        var i;
        if (value) {
            if (value instanceof Array) {
                for (i = 0; i < value.length; i += 1) {
                    displayNode(value[i], display);
                }
            } else {
                displayNode(value, display);
            }
        }
    }

    function hideNode(value) {
        displayNodes(value, 'none');
    }

    function showNode(value) {
        displayNodes(value, 'block');
    }

    function getElement(cluster, item, tag) {
        return document.getElementById(cluster + tag + item);
    }

    function findFirstChildWithClass(node, className) {
        var i;
        if (node && typeof node !== 'object') {
            node = document.getElementById(node);
        }
        if (node && node.hasChildNodes && node.hasChildNodes()) {
            for (i = 0; i < node.childNodes.length; i += 1) {
                if (node.childNodes[i].className === className) {
                    return node.childNodes[i];
                }
            }
        }
        return undefined;
    }

    function findChildrenWithClass(node, className) {
        var children = [],
            i;
        if (node && typeof node !== 'object') {
            node = document.getElementById(node);
        }
        if (node && node.hasChildNodes && node.hasChildNodes()) {
            for (i = 0; i < node.childNodes.length; i += 1) {
                if (node.childNodes[i].className === className) {
                    children.push(node.childNodes[i]);
                }
            }
        }
        return children;
    }

    function countChildrenWithTag(node, tagName) {
        var count = 0,
            i;
        if (node && typeof node !== 'object') {
            node = document.getElementById(node);
        }
        if (node && node.hasChildNodes && node.hasChildNodes()) {
            for (i = 0; i < node.childNodes.length; i += 1) {
                if (node.childNodes[i].tagName === tagName) {
                    count += 1;
                }
            }
        }
        return count;
    }

    function createElement(type, value) {
        var element = document.createElement(type);
        if (value) {
            if (value.text) {
                element.innerText = value.text;
                element.textContent = value.text;
            }
            if (value.src) {
                element.src = value.src;
            }
            if (value.height) {
                element.height = value.height;
            }
            if (value.width) {
                element.width = value.width;
            }
            if (value.id) {
                element.id = value.id;
            }
            if (value.tooltip) {
                element.title = value.tooltip;
            }
            if (value.className) {
                element.className = value.className;
            }
            if (value.onclick) {
                element.onclick = value.onclick;
            }
        }
        return element;
    }

    function makeCountsText(more, tweets) {
        var text;
        if (more || tweets) {
            text = '';
            if (more) {
                if (text.length) {
                    text += ' ';
                }
                text += 'More: ' + more;
            }
            if (tweets) {
                if (text.length) {
                    text += ' ';
                }
                text += 'Tweets: ' + tweets;
            }
        }
        return text;
    }

    function getCounts(node, counts) {
        var next = findFirstChildWithClass(node, 'dbptb'),
            child,
            type,
            re = /^\s*(.+?)\s*:\s*$/,
            match,
            i;

        if (node && node.hasChildNodes && node.hasChildNodes()) {
            for (i = 0; i < node.childNodes.length; i += 1) {
                child = node.childNodes[i];
                if (child.nodeType === 1) {
                    if (child.className === 'drhed') {
                        type = undefined;
                        match = re.exec(child.innerText || child.textContent);
                        if (match && (match.length > 1)) {
                            type = match[1].toLowerCase();
                        }
                    } else if (child.className === 'bls') {
                        if (type) {
                            counts = counts || { };
                            counts[type] = countChildrenWithTag(child, 'A');
                        }
                        type = undefined;
                    } else {
                        type = undefined;
                    }
                }
            }
        }
        if (next) {
            getCounts(next, counts);
        }
        return counts;
    }

    function isNodeShown(node) {
        return node && node.style && node.style.display === 'block';
    }

    function fixupHeight(node, xNode) {
        // Fixup 'more' vertical button height
        if (node && xNode && xNode.style) {
            xNode.style.height = node.offsetHeight + 'px';
        }
    }

    function showHide(detail, mode) {
        if (typeof mode === 'undefined') {
            // Mode is not specified, so determine the mode from the current state of shown nodes
            if (isNodeShown(detail.dNode)) {
                mode = 2;
            } else if (isNodeShown(detail.pNode)) {
                mode = 0;
            } else {
                mode = 1;
            }
        }
        if (mode === 2) {
            hideNode(detail.dNode);
            showNode(detail.pNode);
            fixupHeight(detail.pNode, detail.pxNode);
        } else if (mode === 0) {
            hideNode(detail.dNode);
            hideNode(detail.pNode);
        } else {
            showNode(detail.dNode);
            hideNode(detail.pNode);
            fixupHeight(detail.dNode, detail.dxNode);
        }
    }

    function createOnclick(detail) {
        return function () {
            showHide(detail);
        };
    }

    function addCountsToItem(cluster, item) {
        var iNode = getElement(cluster, item, 'i'),
            iiNode = findFirstChildWithClass(iNode, 'ii'),
            dNode = getElement(cluster, item, 'd'),
            pNode = getElement(cluster, item, 'p'),
            dxNode = getElement(cluster, item, 'dx'),
            pxNode = getElement(cluster, item, 'px'),
            doNodes = findChildrenWithClass(dNode, 'dbpt'),
            poNodes = findChildrenWithClass(pNode, 'dbpt'),
            countsNode,
            counts,
            recover = 1,
            detail;

        if (iiNode) {
            // Ensure the summary and verbose information are both hidden
            hideNode(dNode);
            hideNode(pNode);

            if (doNodes && (doNodes.length > 0)) {
                counts = getCounts(doNodes[0]);
                if (counts) {
                    if (counts.more || counts.tweets) {
                        detail = { dNode: dNode, pNode: pNode, dxNode: dxNode, pxNode: pxNode };
                        countsNode = createElement('span', { text: makeCountsText(counts.more, counts.tweets),
                                                             className: 'techmemeless',
                                                             tooltip: "Show/hide 'More' and/or 'Tweets' information",
                                                             onclick: createOnclick(detail)
                                                           });
                        iiNode.appendChild(countsNode);
                    }
                    recover = 0;
                }
            }
        }

        // Fixup the damage done by our CSS munging via techmeme-less.css
        showNode(doNodes);
        showNode(poNodes);

        if (recover) {
            showNode(dNode);
            hideNode(pNode);
        }

        return detail;
    }

    function addCounts() {
        var cluster = 0,
            item,
            detail,
            details = [ ];

        while (true) {

            item = 1;

            while (true) {

                detail = addCountsToItem(cluster, item);
                if (!detail) {
                    break;
                }

                details.push(detail);
                item += 1;
            }

            if (item === 1) {
                break;
            }

            cluster += 1;
        }

        return details;
    }

    function createButtonOnclick(details, mode) {
        return function () {
            var i;
            if (details && details instanceof Array) {
                for (i = 0; i < details.length; i += 1) {
                    showHide(details[i], mode);
                }
            }
        };
    }

    function addButton(node, text, tooltip, details, mode) {
        var button;
        if (node && text) {
            button = createElement('span', { text: text,
                                             tooltip: tooltip,
                                             className: 'techmemeless-button',
                                             height: '12',
                                             width: '12',
                                             onclick: createButtonOnclick(details, mode)
                                           });
            node.appendChild(button);
        }
    }

    function addButtons(details) {
        var pagecont = findFirstChildWithClass(document.body, 'pagecont'),
            navbar = findFirstChildWithClass(pagecont, 'navbar'),
            navtabs = findFirstChildWithClass(navbar, 'navtabs');

        if (navtabs) {
            try {
                // Unicode 25c7 - White diamond
                // Unicode 25c8 - White diamond containing small black diamond
                // Unicode 25c6 - Black diamond
                // Reference: http://en.wikipedia.org/wiki/List_of_Unicode_characters#Block_Elements (expand to show '68 Block Elements')
                addButton(navtabs, '\u25c7', "Hide 'More' and 'Tweets' information", details, 0);
                addButton(navtabs, '\u25c8', "Show 'More' and 'Tweets' summary information", details, 1);
                addButton(navtabs, '\u25c6', "Show 'More' and 'Tweets' verbose information", details, 2);
            } catch (e) {
            }
        }
    }

    var details = addCounts();
    if (details && (details instanceof Array) && details.length) {
        addButtons(details);
    }
}());