AUDIT_RULES = $(shell find ./src/audits -name "*.js")
NUM_AUDIT_RULES = $(shell echo `find ./src/audits -name "*.js" | wc -l`)
NUM_AUDIT_RULE_SOURCES = `expr $(NUM_AUDIT_RULES) + 2`
EXTERNS = ./src/js/externs.js

GENERATED_JS_FILES_DIR = ./extension/generated
TEMPLATES_LIB_FILE = ./extension/Handlebar.js
TEST_DIR = ./test
TEST_DEPENDENCIES_FILE = generated_dependencies.js
TEST_DEPENDENCIES_REL_DIR = generated

CLOSURE_JAR = ~/src/closure/compiler.jar
CLOSURE_COMMAND = java -jar $(CLOSURE_JAR) \
--formatting PRETTY_PRINT --summary_detail_level 3 --compilation_level SIMPLE_OPTIMIZATIONS \
--warning_level VERBOSE --externs $(EXTERNS) \
--module axs:1 \
  --js ./src/js/axs.js \
--module constants:1:axs \
  --js ./src/js/Constants.js \
--module utils:1:constants \
  --js ./src/js/AccessibilityUtils.js \
--module content:1:axs \
  --js ./src/js/ContentScriptFramework.js \
--module properties:1:utils,constants,content \
  --js ./src/js/Properties.js \
--module audits:$(NUM_AUDIT_RULE_SOURCES):content,constants,utils \
  --js ./src/js/AuditRule.js \
  --js ./src/js/AuditRules.js \
  --js $(AUDIT_RULES) 

MODULES = axs constants utils content properties audits

.PHONY: clean js

js: clean
	@echo "\nStand back! I'm rebuilding!\n---------------------------"
	@/bin/echo -n "* Rebuilding generated JS modules: "
	@/bin/echo -n $(CLOSURE_COMMAND)
	@/bin/echo
	@$(CLOSURE_COMMAND) --module_output_path_prefix $(GENERATED_JS_FILES_DIR)/ && \
    echo "SUCCESS"
	@/bin/echo -n "* Copying Handlebar.js to $(TEMPLATES_LIB_FILE): "
	@/bin/cp ./lib/templates/js/HandlebarBrowser.js $(TEMPLATES_LIB_FILE) && \
    echo "SUCCESS"
	@/bin/echo -n "* Rebuilding test dependencies: "
	@$(CLOSURE_COMMAND) --module_output_path_prefix $(TEST_DIR)/$(TEST_DEPENDENCIES_REL_DIR)/ && \
	pushd $(TEST_DIR) && \
	echo "var _dependencies = [" > $(TEST_DEPENDENCIES_FILE) && \
	for m in $(MODULES); do \
	  echo "  '$(TEST_DEPENDENCIES_REL_DIR)/$$m.js'," >> $(TEST_DEPENDENCIES_FILE); \
	done && \
	echo "];" >> $(TEST_DEPENDENCIES_FILE) && \
	popd && \
  echo "SUCCESS"

clean:
	@rm -rf $(GENERATED_JS_FILES_DIR) $(TEMPLATES_LIB_FILE) $(TEST_DIR)/$(TEST_DEPENDENCIES_REL_DIR)
