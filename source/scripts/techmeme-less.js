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

    function hideNode(value) {
        var i;
        if (value instanceof Array) {
            for (i = 0; i < value.length; i += 1) {
                displayNode(value[i], 'none');
            }
        } else {
            displayNode(value, 'none');
        }
    }

    function showNode(value) {
        var i;
        if (value instanceof Array) {
            for (i = 0; i < value.length; i += 1) {
                displayNode(value[i], 'block');
            }
        } else {
            displayNode(value, 'block');
        }
    }

    function makeId(cluster, item, tag) {
        return cluster + tag + item;
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

    // function countChildrenWithClass(node, className) {
        // var count = 0,
            // i;
        // if (node && typeof node !== 'object') {
            // node = document.getElementById(node);
        // }
        // if (node && node.hasChildNodes && node.hasChildNodes()) {
            // for (i = 0; i < node.childNodes.length; i += 1) {
                // if (node.childNodes[i].className === className) {
                    // count += 1;
                // }
            // }
        // }
        // return count;
    // }

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

    // function logTree(node, indent) {
        // var padding,
            // i;
        // if (node) {
            // indent = indent || 0;
            // padding = '';
            // for (i = 0; i < indent; i += 1) {
                // padding += ' ';
            // }
            // console.log(padding + 'Tag: ' + node.tagName + ' Type: ' + node.nodeType + ' Class: ' + node.className + ' Id: ' + node.id + ' Text: ' + node.innerText);
            // if (node.hasChildNodes && node.hasChildNodes()) {
                // for (i = 0; i < node.childNodes.length; i += 1) {
                    // logTree(node.childNodes[i], indent + 2);
                // }
            // }
        // }
    // }

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
                        match = re.exec(child.innerText);
                        if (match && (match.length > 1)) {
                            type = match[1].toLowerCase();
                        }
                    } else if (child.className === 'bls') {
                        if (type) {
                            counts = counts || { };
                            counts[type] = countChildrenWithTag(child, 'A');
                        }
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

    // function isNodeShown(node) {
        // return node && node.style && node.style.display === 'block';
    // }

    function createOnclick(dNode, pNode, dxNode, pxNode, doNodes, poNodes) {
        return (function () {
            var fixed = 0,
                state;
            return function () {
                if (!fixed) {
                    // Undo our mangling of the CSS to initially hide things
                    showNode(doNodes);
                    showNode(poNodes);
                    fixed = 1;
                }
                if (!state) {
                    showNode(dNode);
                    hideNode(pNode);
                    // Fixup 'more' vertical button height
                    if (dNode && dxNode && dxNode.style) {
                        dxNode.style.height = dNode.offsetHeight + 'px';
                        dxNode.style.display = 'block';
                    }
                    state = 1;
                } else if (state === 1) {
                    hideNode(dNode);
                    showNode(pNode);
                    // Fixup 'more' vertical button height
                    if (pNode && pxNode && pxNode.style) {
                        pxNode.style.height = pNode.offsetHeight + 'px';
                        pxNode.style.display = 'block';
                    }
                    state = 2;
                } else {
                    hideNode(dNode);
                    hideNode(pNode);
                    state = 0;
                }
            };
        }());
    }

    function addCountsToItem(cluster, item) {
        var iNode = document.getElementById(makeId(cluster, item, 'i')),
            captionNode = findFirstChildWithClass(iNode, 'ii'),
            dNode = document.getElementById(makeId(cluster, item, 'd')),
            pNode = document.getElementById(makeId(cluster, item, 'p')),
            dxNode = document.getElementById(makeId(cluster, item, 'dx')),
            pxNode = document.getElementById(makeId(cluster, item, 'px')),
            doNodes = findChildrenWithClass(dNode, 'dbpt'),
            poNodes = findChildrenWithClass(pNode, 'dbpt'),
            countsNode,
            counts,
            recover;

        if (captionNode) {
            if (doNodes && (doNodes.length > 0)) {
                counts = getCounts(doNodes[0]);
            }
            if (counts) {
                if (counts.more || counts.tweets) {
                    countsNode = createElement('span', { text: makeCountsText(counts.more, counts.tweets),
                                                         className: 'techmemeless',
                                                         tooltip: "Show/hide 'More' and/or 'Tweets' information",
                                                         onclick: createOnclick(dNode, pNode, dxNode, pxNode, doNodes, poNodes)});
                    captionNode.appendChild(countsNode);
                }
            } else {
                recover = 1;
            }
        } else {
            recover = 1;
        }

        if (recover) {
            if (dNode) {
                showNode(dNode);
            }
            if (pNode) {
                showNode(pNode);
            }
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