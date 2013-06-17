// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('axs.content');

if (!axs.content.auditResultNodes) {
    /**
     * @type {Object.<string, Node>}
     */
    axs.content.auditResultNodes = {};
}

if (!axs.content.lastNodeId) {
    /** @type {number} */
    axs.content.lastNodeId = 0;
}

/**
 * @param {Node} node
 * @return {string} the ID of the node for lookup
 */
axs.content.convertNodeToResult = function(node) {
    var nodeId = '' + axs.content.lastNodeId++;
    axs.content.auditResultNodes[nodeId] = node;
    return nodeId;
};

/**
 * @param {string} nodeId
 * @return {?Node}
 */
axs.content.getResultNode = function(nodeId) {
    var resultNode = axs.content.auditResultNodes[nodeId];
    delete axs.content.auditResultNodes[nodeId];
    return resultNode;
};

axs.content.frameURIs = {};
axs.content.frameURIs[document.documentURI] = true;

window.addEventListener('message',  function(e) {
    var obj = JSON.parse(e.data);
    if ('request' in obj) {
        if (obj['request'] == 'getUrl') {
            var origin = '*';
            if ('returnOrigin' in obj)
                origin = obj['returnOrigin'];
            e.source.postMessage(JSON.stringify({'request': 'postUrl',
                                                 'uri': document.documentURI}),
                                 origin);
        } else if (obj['request'] == 'postUrl') {
            if (window.parent != window) {
                window.parent.postMessage(e.data, '*')
            } else {
                axs.content.frameURIs[obj['uri']] = true;
            }
        }
    }
}, false);

(function() {
function getOrigin(url) {
    var urlParts = url.split('://');
    urlParts[1] = urlParts[1].split('/')[0];
    return urlParts.join('://');
}

var iframes = document.querySelectorAll('iframe');
for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    var src = iframe.src;
    var frameOrigin = getOrigin(src);
    var docOrigin = getOrigin(document.documentURI);

    try {
        iframe.contentWindow.postMessage(JSON.stringify({'request': 'getUrl' ,
                                                         'returnOrigin': docOrigin}), frameOrigin);
    } catch (e) {
        console.warn('got exception', e);
    }
}
})();
