"use strict";

/*jslint regexp: true*/
/*global document*/

(function () {

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
                        match = re.exec(child.innerText);
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

    function createOnclick(dNode, pNode, dxNode, pxNode) {
        return function () {
            if (isNodeShown(dNode)) {
                hideNode(dNode);
                showNode(pNode);
                fixupHeight(pNode, pxNode);
            } else if (isNodeShown(pNode)) {
                hideNode(dNode);
                hideNode(pNode);
            } else {
                showNode(dNode);
                hideNode(pNode);
                fixupHeight(dNode, dxNode);
            }
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
            recover = 1;

        if (iiNode) {
            // Ensure the summary and verbose information are both hidden
            hideNode(dNode);
            hideNode(pNode);
            showNode(doNodes);  // These were hidden by our CSS munge
            showNode(poNodes);  // These were hidden by our CSS munge

            if (doNodes && (doNodes.length > 0)) {
                counts = getCounts(doNodes[0]);
                if (counts) {
                    if (counts.more || counts.tweets) {
                        countsNode = createElement('span', { text: makeCountsText(counts.more, counts.tweets),
                                                             className: 'techmemeless',
                                                             tooltip: "Show/hide 'More' and/or 'Tweets' information",
                                                             onclick: createOnclick(dNode, pNode, dxNode, pxNode)});
                        iiNode.appendChild(countsNode);
                    }
                    recover = 0;
                }
            }
        }

        if (recover) {
            showNode(dNode);
            hideNode(pNode);
        }

        return iNode;
    }

    function addCounts() {
        var cluster = 0,
            item;

        while (true) {

            item = 1;

            while (true) {

                if (!addCountsToItem(cluster, item)) {
                    break;
                }

                item += 1;
            }

            if (item === 1) {
                break;
            }

            cluster += 1;
        }
    }

    addCounts();
}());