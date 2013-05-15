AUDIT_RULES = $(shell find ./src/audits -name "*.js" | sed -e "s/^/--js /g")
NUM_AUDIT_RULES = $(shell echo `find ./src/audits -name "*.js" | wc -l`)
NUM_AUDIT_RULE_SOURCES = `expr $(NUM_AUDIT_RULES) + 2`
EXTERNS = ./src/js/externs.js

TEST_DIR = ./test
TEST_DEPENDENCIES_FILE = generated_dependencies.js
TEST_DEPENDENCIES_REL_DIR = generated

CLOSURE_JAR = ~/src/closure/compiler.jar
MODULES = axs constants utils content properties audits

LIBRARY_CLOSURE_COMMAND = java -jar $(CLOSURE_JAR) --language_in ECMASCRIPT5 \
--formatting PRETTY_PRINT --summary_detail_level 3 --compilation_level SIMPLE_OPTIMIZATIONS \
--warning_level VERBOSE --externs $(EXTERNS) \
  --js ./src/js/axs.js \
  --js ./src/js/Constants.js \
  --js ./src/js/AccessibilityUtils.js \
  --js ./src/js/Properties.js \
  --js ./src/js/AuditRule.js \
  --js ./src/js/AuditRules.js \
  --js ./src/js/AuditResults.js \
  --js ./src/js/Audit.js \
  $(AUDIT_RULES)

LIBRARY_OUTPUT_FILE = ./gen/axs_testing.js

.PHONY: clean js

js: clean
	@$(LIBRARY_CLOSURE_COMMAND) --js_output_file $(LIBRARY_OUTPUT_FILE)

test: clean js
	@$(LIBRARY_CLOSURE_COMMAND) --module_output_path_prefix $(TEST_DIR)/$(TEST_DEPENDENCIES_REL_DIR)/ && \
	pushd $(TEST_DIR) && \
	echo "var _dependencies = [" > $(TEST_DEPENDENCIES_FILE) && \
	for m in $(MODULES); do \
	  echo "  '$(TEST_DEPENDENCIES_REL_DIR)/$$m.js'," >> $(TEST_DEPENDENCIES_FILE); \
	done && \
	echo "];" >> $(TEST_DEPENDENCIES_FILE) && \
	popd && \
  echo "SUCCESS"

clean:
	@rm -rf $(LIBRARY_OUTPUT_FILE) $(TEST_DIR)/$(TEST_DEPENDENCIES_REL_DIR)

