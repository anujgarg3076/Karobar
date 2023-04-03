import allure
import pytest
from zapi.izapi import IZapi
from input.input import attributes, from_state_to_state

ZEPHYR_URL="CSDEV-23411"
ZEPHYR_VERSION="3.21.1"
ZEPHYR_CYCLE="ACQ Functional testing"
ZEPHYR_FOLDER="ZAPI"
ZEPHYR_SUMMARY="TLMS Stock: Change terminal state"
ZEPHYR_DESCRIPTION=\
"""
h4. *Test purpose*
Is to test that Change terminal state functionality is working

h4. *Related documents*
http://cvs.konts.lv/mdhtml/cs.platform.WG/cs.pkg.ACQ_OperationalWeb/doc/internal/fs-cs.ui.tlms.stock.eng.md.html

h4. *Instructions how to perform test steps*

{{code:bash}}
python3 -m pytest -sv /app/csbo/tests/pytest/acq_solution/cs.pkg.ACQ_OperationalWeb/cs.ui.stock/webgui/tc/test_stock_change_state.py --seleniumx-browsers=chrome --alluredir=alluredir --zephyr_no_interact=False --zephyr_username=jira_username --zephyr_evidences="\\\\\\walker.konts.lv\\cvs_test\\lib_testresults\\ZAPI\\{url}"

allure generate /app/csbo/tests/pytest/acq_solution/cs.pkg.ACQ_OperationalWeb/cs.ui.stock/webgui/tc/alluredir/ -o /app/csbo/tests/pytest/acq_solution/cs.pkg.ACQ_OperationalWeb/cs.ui.stock/webgui/tc/allure-report --clean
allure open /app/csbo/tests/pytest/acq_solution/cs.pkg.ACQ_OperationalWeb/cs.ui.stock/webgui/tc/allure-report # copy this report to evidence directory on walker
{{code}}

h4. *Links to automated test*
Jenkins runs are located here: [Link to Jenkins job|http://jenkins.lv.int.tieto.com/view/DIST.ALL/job/DIST.ALL/job/cs.dist.eurobank/job/master/]
""".format(url=ZEPHYR_URL)


@IZapi.zephyr(
    url=ZEPHYR_URL,
    summary=ZEPHYR_SUMMARY,
    description=ZEPHYR_DESCRIPTION,
    version=ZEPHYR_VERSION,
    cycle=ZEPHYR_CYCLE,
    folder=ZEPHYR_FOLDER
)

class TestStockChangeState():

    @IZapi.description("Change terminal state")
    def test_terminal_stock_change_state(self, page_function, new_ws_terminal):
        page_function.filter_by_attribute([attributes()[0]], value=new_ws_terminal)
        page_function.change_terminal_state(
            value=new_ws_terminal, 
            to_state_action=list(from_state_to_state()['INSTALLED'].keys())[1],
            to_state=from_state_to_state()['INSTALLED']['INSTOCK']['state'],
            to_status=from_state_to_state()['INSTALLED']['INSTOCK']['status'])
