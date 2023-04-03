include ../../Makefile.ver
include $(DEVELOPDIR)/Makefile.win
include $(DEVELOPDIR)/Makefile.python

PLATFORM_MASK=java tomcat

define classpath
$(call_module)
endef

project_version.mk: pom.xml Makefile
	VERSION=`$(MVN) help:evaluate -Dexpression=project.version --non-recursive -q -DforceStdout` || exit $$? && echo "PROJECT_VERSION=$$VERSION" > $@

include project_version.mk

INTERFACE_NAME=cs.ui.stock
INTERFACE_VERSION=$(subst .SNAPSHOT,-SNAPSHOT,$(word 2,$(subst -, ,$(filter $(INTERFACE_NAME)-%,$(INTERFACES)))))
ifneq ($(filter %-SNAPSHOT,$(INTERFACE_VERSION)), )
IS_SNAPSHOT=true
else
IS_SNAPSHOT=false
endif
RELEASE_ON_BRANCHES=master release/%

CORE_PATH=$(call item_home,cs.ui.cs)

ANT_COMMAND= CORE_PATH=$(CORE_PATH) \
	     TOMCAT_CLASSPATH=$(call classpath,cs.ext.tomcat) \
	     DISTDIR=$(DISTDIR) \
	     DIST_VER=$(ITEM_VERSION) \
	     IF_VER=$(INTERFACE_VERSION) \
	     "$(ANT)"

STOCK_UI_JAR_ARTIFACT_VERSION=$(INTERFACE_VERSION)
STOCK_UI_JAR_ARTIFACT=com.tieto.ui:tieto-stock:$(STOCK_UI_JAR_ARTIFACT_VERSION)

test:
	
check::

issuedir:

scripts/ref_data.sql: scripts/ref_data.py
	$(PYTOOL) scripts/ref_data.py > $@

distdir:$(if $(BUILD_TESTS),$(DISTDIR)/tests.tar) scripts/ref_data.sql
	if [ $(IS_SNAPSHOT) != true ] && $(MVN) dependency:get -Dartifact=$(STOCK_UI_JAR_ARTIFACT) ; then \
		echo "$(RED_RAW)$(BOLD_RAW)Deploying maven package $(STOCK_UI_JAR_ARTIFACT) from repository$(END_RAW)"; \
		$(MVN) -f stock/pom.xml process-resources; \
	else \
		echo "$(RED_RAW)$(BOLD_RAW)Building $(STOCK_UI_JAR_ARTIFACT) from source$(END_RAW)"; \
		$(MAKE) webapp/apps/stock/bundle.js; \
	fi
	$(MVN) package
	cp -rf stock/prod/. webapp/apps/stock
	$(ANT_COMMAND) distdir
	cp -f scripts/*.sql $(DISTDIR)/scripts/
	cp -f scripts/gen_stock_view.py $(DISTDIR)/scripts/

# generate GUI files in production mode
STOCK_UI_FILES=$(filter-out stock/package-lock.json, $(shell git ls-files stock/*))
webapp/apps/stock/bundle.js:$(STOCK_UI_FILES)
	cd stock; CYPRESS_INSTALL_BINARY=0 $(NPM) --loglevel info install
	cd stock; $(NPM) --loglevel info run build
	cd stock; $(NPM) test
	cd stock/prod; rm -rf *.html

# Create and deploy jar containing GUI files
stock/target/tieto-stock-$(STOCK_UI_JAR_ARTIFACT_VERSION).jar:
	echo "$(YELLOW_RAW)$(BOLD_RAW)Building STOCK UI bundle JAR$(END_RAW)"
	$(MVN) versions:set -DnewVersion=$(STOCK_UI_JAR_ARTIFACT_VERSION) -f stock/pom.xml
	$(MVN) deploy -Dmdep.skip=true -f stock/pom.xml || exit $?

install compile javadoc compile-react:
	$(ANT_COMMAND) $@

clean::
	CORE_PATH=$(CORE_PATH) "$(ANT)" $@

# Test script preparation for installation package

TESTFILES:=$(shell find tests/pytest -name "*.py")
$(DISTDIR)/tests.tar: $(TESTFILES) |$(DISTDIR)
	$(TAR) vfc $@ tests/pytest/

deploy_mvn:
ifeq ($(filter $(RELEASE_ON_BRANCHES), $(BRANCH_NAME)), )
	echo "$(YELLOW_RAW)$(BOLD_RAW)Not on a release branch, nothing to do.$(END_RAW)"
else ifneq ($(PROJECT_VERSION), $(INTERFACE_VERSION))
	echo "$(YELLOW_RAW)$(BOLD_RAW)Different interface and pom versions, create version $(INTERFACE_VERSION)$(END_RAW)"
	$(MVN) versions:set -DnewVersion=$(INTERFACE_VERSION) -DprocessAllModules || exit $?; \
	$(MVN) versions:commit || exit $?; \
	$(MVN) versions:set -DnewVersion=$(INTERFACE_VERSION) -DprocessAllModules -f stock/pom.xml || exit $?; \
	$(MVN) versions:commit -f stock/pom.xml || exit $?; \
	$(MAKE) stock/target/tieto-stock-$(STOCK_UI_JAR_ARTIFACT_VERSION).jar || exit $?; \
	echo "Push version changes to git"
	git add pom.xml || exit $?; \
	git add stock/pom.xml || exit $?; \
	git commit -m "Bump version $(INTERFACE_NAME)-$(INTERFACE_VERSION) #noissue" || exit $?; \
	if [ $(IS_SNAPSHOT) != true ] ; then \
		git tag -a "$(INTERFACE_NAME)-$(INTERFACE_VERSION)" -m "Release $(INTERFACE_NAME)-$(INTERFACE_VERSION)" || exit $?; \
	fi; \
	git push --follow-tags || exit $?; \
	echo "Changes pushed to git"
else ifeq ($(IS_SNAPSHOT), true)
	echo "$(YELLOW_RAW)$(BOLD_RAW)Snapshot detected, build snapshot and publish$(END_RAW)"
	$(MVN) clean deploy -Dmdep.skip=true -f stock/pom.xml || exit $?;
else
	echo "$(YELLOW_RAW)$(BOLD_RAW)Version $(INTERFACE_VERSION) should be already published, nothing to do.$(END_RAW)"
endif
