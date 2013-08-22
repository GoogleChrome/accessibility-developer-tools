AUDIT_RULES = $(shell find ./src/audits -name "*.js" | sed -e "s/^/--js /g")
EXTERNS = ./src/js/externs/externs.js

CLOSURE_JAR = ~/src/closure/compiler.jar

LIBRARY_CLOSURE_COMMAND = java -jar $(CLOSURE_JAR) --language_in ECMASCRIPT5 \
--formatting PRETTY_PRINT --summary_detail_level 3 --compilation_level SIMPLE_OPTIMIZATIONS \
--warning_level VERBOSE --externs $(EXTERNS) \
  --js ./lib/closure-library/closure/goog/base.js \
  --js ./src/js/axs.js \
  --js ./src/js/BrowserUtils.js \
  --js ./src/js/Constants.js \
  --js ./src/js/AccessibilityUtils.js \
  --js ./src/js/Properties.js \
  --js ./src/js/AuditRule.js \
  --js ./src/js/AuditRules.js \
  --js ./src/js/AuditResults.js \
  --js ./src/js/Audit.js \
  $(AUDIT_RULES)

LIBRARY_OUTPUT_FILE = ./gen/axs_testing.js

.PHONY: test clean js

js: clean
	@$(LIBRARY_CLOSURE_COMMAND) --js_output_file $(LIBRARY_OUTPUT_FILE)

test: clean js
	@open ./test/index.html

clean:
	@rm -f $(LIBRARY_OUTPUT_FILE)

