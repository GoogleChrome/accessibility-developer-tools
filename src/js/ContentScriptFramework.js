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
    if (typeof e.data != 'object')
        return;
    if ('request' in e.data) {
        if (e.data['request'] == 'getUri') {
            var origin = '*';
            if ('returnOrigin' in e.data)
                origin = e.data['returnOrigin'];
            e.source.postMessage({'request': 'postUri',
                                  'uri': document.documentURI},
                                 origin);
        } else if (e.data['request'] == 'postUri') {
            if (window.parent != window) {
                window.parent.postMessage(e.data, '*')
            } else {
                var uri = e.data['uri'];
                if (uri.indexOf('#') >= 0)
                    axs.content.frameURIs[uri.split('#', 1)[0]] = true;
                else
                    axs.content.frameURIs[uri] = true;
            }
        }
    }
}, false);

(function() {
function getOrigin(url) {
    var urlParts = url.split('://', 2);
    urlParts[1] = urlParts[1].split('/')[0];
    return urlParts.join('://');
}

var iframes = document.querySelectorAll('iframe');
for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    var frameOrigin = '*';
    var src = iframe.src;
    if (src && src.length > 0)
        frameOrigin = getOrigin(src);
    var docOrigin = getOrigin(document.documentURI);
    try {
        iframe.contentWindow.postMessage({'request': 'getUri' ,
                                          'returnOrigin': docOrigin}, frameOrigin);
    } catch (e) {
        console.warn('got exception when trying to postMessage from ' +
                     docOrigin + ' to ' + frameOrigin, e);
    }
}
})();
