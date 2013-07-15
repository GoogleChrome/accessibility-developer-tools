goog.provide('axs.browserUtils');

axs.browserUtils.matchSelector = function(node, selector) {
  if(node.webkitMatchesSelector){
    return node.webkitMatchesSelector(selector);
  } else {
    return node.mozMatchesSelector(selector);
  }
}
