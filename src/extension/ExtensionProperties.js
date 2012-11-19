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

goog.require('axs.properties');

goog.provide('axs.extensionProperties');

/**
 * @param {Node} node
 * @return {Object.<string, Object>}
 */
axs.extensionProperties.getAllProperties = function(node) {
    var allProperties = axs.properties.getAllProperties(node);
    /**
     * @param {Object} tree
     * @return {Object}
     */
    function convertNodes(tree) {
        for (var key in tree) {
            var value = tree[key];
            if (typeof value == "object") {
                if (value instanceof Node)
                    tree[key] = axs.content.convertNodeToResult(value);
                else
                    tree[key] = convertNodes(tree[key]);
            }
        }
        return tree;
    }
    return convertNodes(allProperties);
};

