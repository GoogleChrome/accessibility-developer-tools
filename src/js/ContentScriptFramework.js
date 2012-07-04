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
