goog.require('axs.AuditRules');
goog.require('axs.browserUtils');
goog.require('axs.constants.Severity');

(function() {
  function tableDoesNotHaveHeaderRow(rows) {
    var headerRow = rows[0];

    var headerCells = headerRow.children;

    for (var i = 0; i < headerCells.length; i++) {
      if (headerCells[i].tagName != 'TH') {
        return true;
      }
    }
    return false;
  }

  function tableDoesNotHaveHeaderColumn(rows) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].children[0].tagName != 'TH') {
        return true;
      }
    }
    return false;
  }

  function tableDoesNotHaveGridLayout(rows) {
    var headerCells = rows[0].children;

    for (var i = 1; i < headerCells.length; i++) {
      if (headerCells[i].tagName != 'TH') {
        return true;
      }
    }

    for (var i = 1; i < rows.length; i++) {
      if (rows[i].children[0].tagName != 'TH') {
        return true;
      }
    }
    return false;
  }

  axs.AuditRules.addRule({
    name: 'dataTableHeadersMissing',
    heading: 'Data tables should have appropriate headers',
    url: 'https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_table_01',
    severity: axs.constants.Severity.SEVERE,
    relevantElementMatcher: function(element) {
      return axs.browserUtils.matchSelector(element, 'table');
    },
    test: function(element) {

      if (element.getAttribute('role') == 'presentation') {
        return element.querySelectorAll('th').length != 0
      } else {
        var rows = element.querySelectorAll('tr');

        return tableDoesNotHaveHeaderRow(rows) &&
          tableDoesNotHaveHeaderColumn(rows) &&
          tableDoesNotHaveGridLayout(rows);
      }
    },
    code: 'AX_TABLE_01',
  });
})();
