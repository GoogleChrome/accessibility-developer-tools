AUDIT_RULES = $(shell find ./src/audits -name "*.js")
JS_FILES = $(shell find ./src/js -name "*.js")

BIG_FAT_JS_FILE = ./extension/generated_accessibility.js

.PHONY: clean js

js: clean
	@echo "\nStand back! I'm rebuilding!\n---------------------------"
	@/bin/echo -n "* Rebuilding '$(BIG_FAT_JS_FILE)': "
	@cat $(JS_FILES) > $(BIG_FAT_JS_FILE) && \
	  cat $(AUDIT_RULES) >> $(BIG_FAT_JS_FILE) && \
    echo "SUCCESS\n"

clean:
	@rm -rf $(BIG_FAT_JS_FILE)

