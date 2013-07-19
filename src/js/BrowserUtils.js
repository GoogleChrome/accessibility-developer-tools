goog.provide('axs.browserUtils');

/**
 * Use Firefox matcher when Webkit is not supported.
 * @param {Node} node
 * @param {string} selector
 * @returns {Boolean}
 */
axs.browserUtils.matchSelector = function(node, selector) {
  if (node.webkitMatchesSelector) {
    return node.webkitMatchesSelector(selector);
  } else {
    return node.mozMatchesSelector(selector);
  }
}
