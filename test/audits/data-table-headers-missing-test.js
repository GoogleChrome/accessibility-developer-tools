module('DataTableHeadersMissing');

function buildRow(cells) {
    var row = document.createElement('tr');

    cells.forEach(function (cell) {
        row.appendChild(document.createElement(cell));
    });

    return row;
}

function buildTable(rows) {
    var table = document.createElement('table');

    rows.forEach(function (row) {
        table.appendChild(buildRow(row));
    });

    return table;
}

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

test('Table with a header row', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTable(
        [
            ['th', 'th', 'th'],
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with an incomplete header row', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTable(
        [
            ['th', 'th', 'td'],
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table with a header column', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTable(
        [
            ['th', 'td', 'td'],
            ['th', 'td', 'td'],
            ['th', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with an incomplete header column', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTable(
        [
            ['th', 'td', 'td'],
            ['th', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table uses a grid layout', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTable(
        [
            ['td', 'th', 'th'],
            ['th', 'td', 'td'],
            ['th', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with no headers at all', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTable(
        [
            ['td', 'td', 'td'],
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table with thead and tbody that has a header row', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTableWithThead(
        ['th', 'th', 'th'],
        [
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with thead and tbody with an incomplete header row', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTableWithThead(
        ['th', 'th', 'td'],
        [
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table with thead and tbody that has a header column', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTableWithThead(
        ['th', 'td', 'td'],
        [
            ['th', 'td', 'td'],
            ['th', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with thead and tbody with an incomplete header column', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTableWithThead(
        ['th', 'td', 'td'],
        [
            ['th', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table with thead and tbody using a grid layout', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    fixture.appendChild(buildTableWithThead(
        ['td', 'th', 'th'],
        [
            ['th', 'td', 'td'],
            ['th', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table with thead and tbody with no headers at all', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = fixture.appendChild(buildTableWithThead(
        ['td', 'td', 'td'],
        [
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    ));

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});

test('Table used for layout with no headers at all', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = buildTable([
            ['td', 'td', 'td'],
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    );

    table.setAttribute('role', 'presentation');

    fixture.appendChild(table);

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.PASS);
    deepEqual(actual.elements, []);
});

test('Table used for layout with headers', function () {
    var rule = axs.AuditRules.getRule('dataTableHeadersMissing');
    var fixture = document.getElementById('qunit-fixture');

    var table = buildTable([
            ['th', 'th', 'th'],
            ['td', 'td', 'td'],
            ['td', 'td', 'td']
        ]
    );

    table.setAttribute('role', 'presentation');

    fixture.appendChild(table);

    var actual = rule.run({scope: fixture});
    equal(actual.result, axs.constants.AuditResult.FAIL);
    deepEqual(actual.elements, [table]);
});
