module('TableHasAppropriateHeaders');

(function() {
    var RULE_NAME = 'tableHasAppropriateHeaders';
    /**
     * Builds a tr with the given cell tags
     *
     * @param {string[]} cells Cell tags (tr|th)
     * @returns {Element} tr constructed from given tags
     */
    function buildRow(cells) {
        var row = document.createElement('tr');

        cells.forEach(function (cell) {
            row.appendChild(document.createElement(cell));
        });

        return row;
    }

    /**
     * Builds a table from the given cell tag matrix
     *
     * @param {string[][]} rows Matrix (array of arrays) of cell tags (tr|th)
     * @returns {Element} table constructed from given tags
     */
    function buildTable(rows) {
        var table = document.createElement('table');

        rows.forEach(function (row) {
            table.appendChild(buildRow(row));
        });

        return table;
    }

    /**
     * Builds a table where the first row is a thead and the body
     * is constructed from the given cell tag matrix
     *
     * @param {string[]} headCells Cell tags for the row contained by thead (tr|th)
     * @param {string[][]} bodyRows Matrix (array of arrays) of cell tags contained by tbody (tr|th)
     * @returns {Element} table constructed from given tags
     */
    function buildTableWithThead(headCells, bodyRows) {
        var table = document.createElement('table');

        var thead = document.createElement('thead');

        thead.appendChild(buildRow(headCells));

        table.appendChild(thead);

        var tbody = document.createElement('tbody');

        bodyRows.forEach(function (row) {
            tbody.appendChild(buildRow(row));
        });

        table.appendChild(tbody);

        return table;
    }

    test('Table with no child elements', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = document.createElement('table');

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            elements: [table]  // Yeah this is weird but that's how the test used to be
        };
        assert.runRule(config);
    });

    test('Table with only THEAD', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = document.createElement('table');

        var thead = document.createElement('thead');

        table.appendChild(thead);

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with only TFOOT', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = document.createElement('table');

        var tfoot = document.createElement('tfoot');

        table.appendChild(tfoot);

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with only TBODY', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = document.createElement('table');

        var tbody = document.createElement('tbody');

        table.appendChild(tbody);

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.NA,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with a header row', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTable(
          [
              ['th', 'th', 'th'],
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with an incomplete header row', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTable(
          [
              ['th', 'th', 'td'],
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with a header column', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTable(
          [
              ['th', 'td', 'td'],
              ['th', 'td', 'td'],
              ['th', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with an incomplete header column', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTable(
          [
              ['th', 'td', 'td'],
              ['th', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table uses a grid layout', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTable(
          [
              ['td', 'th', 'th'],
              ['th', 'td', 'td'],
              ['th', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with no headers at all', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTable(
          [
              ['td', 'td', 'td'],
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody that has a header row', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTableWithThead(
          ['th', 'th', 'th'],
          [
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody with an incomplete header row', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTableWithThead(
          ['th', 'th', 'td'],
          [
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody that has a header column', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTableWithThead(
          ['th', 'td', 'td'],
          [
              ['th', 'td', 'td'],
              ['th', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody with an incomplete header column', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTableWithThead(
          ['th', 'td', 'td'],
          [
              ['th', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody using a grid layout', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        fixture.appendChild(buildTableWithThead(
          ['td', 'th', 'th'],
          [
              ['th', 'td', 'td'],
              ['th', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table with thead and tbody with no headers at all', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = fixture.appendChild(buildTableWithThead(
          ['td', 'td', 'td'],
          [
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        ));

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });

    test('Table used for layout with no headers at all', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = buildTable([
              ['td', 'td', 'td'],
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        );

        table.setAttribute('role', 'presentation');

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.PASS,
            elements: []
        };
        assert.runRule(config);
    });

    test('Table used for layout with headers', function(assert) {
        var fixture = document.getElementById('qunit-fixture');

        var table = buildTable([
              ['th', 'th', 'th'],
              ['td', 'td', 'td'],
              ['td', 'td', 'td']
          ]
        );

        table.setAttribute('role', 'presentation');

        fixture.appendChild(table);

        var config = {
            ruleName: RULE_NAME,
            expected: axs.constants.AuditResult.FAIL,
            elements: [table]
        };
        assert.runRule(config);
    });
})();
