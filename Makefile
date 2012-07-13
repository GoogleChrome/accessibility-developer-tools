AUDIT_RULES = $(shell find ./src/audits -name "*.js")
JS_FILES = ./src/js/{_Constants.js,AccessibilityUtils.js,AuditRule.js,AuditRules.js,ContentScriptFramework.js,Properties.js}
EXTERNS = ./src/js/externs.js

BIG_FAT_JS_FILE = ./extension/generated_accessibility.js
TEMPLATES_LIB_FILE = ./extension/Handlebar.js
TEST_DEPENDENCIES_FILE = ./test/generated_dependencies.js

CLOSURE_JAR = ~/src/closure/compiler.jar
CLOSURE_COMMAND = java -jar $(CLOSURE_JAR) \
--js $(JS_FILES) $(AUDIT_RULES) \
--formatting PRETTY_PRINT --summary_detail_level 3 --compilation_level SIMPLE_OPTIMIZATIONS \
--warning_level VERBOSE --externs $(EXTERNS)

.PHONY: clean js

js: clean
	@echo "\nStand back! I'm rebuilding!\n---------------------------"
	@/bin/echo -n "* Rebuilding '$(BIG_FAT_JS_FILE)': "
	@$(CLOSURE_COMMAND) >> $(BIG_FAT_JS_FILE) && \
    echo "SUCCESS"
	@/bin/echo -n "* Copying Handlebar.js to $(TEMPLATES_LIB_FILE): "
	@/bin/cp ./lib/templates/js/HandlebarBrowser.js $(TEMPLATES_LIB_FILE) && \
    echo "SUCCESS"
	@/bin/echo -n "* Rebuilding test dependencies: "
	@echo "var _dependencies = [" > $(TEST_DEPENDENCIES_FILE) && \
	for f in $(JS_FILES); do \
	  echo "  '.$$f'," >> $(TEST_DEPENDENCIES_FILE); \
	done && \
	for f in $(AUDIT_RULES); do \
	  echo "  '.$$f'," >> $(TEST_DEPENDENCIES_FILE); \
	done && \
	echo "];" >> $(TEST_DEPENDENCIES_FILE) && \
  echo "SUCCESS"

	@echo;

clean:
	@rm -rf $(BIG_FAT_JS_FILE) $(TEMPLATES_LIB_FILE)
