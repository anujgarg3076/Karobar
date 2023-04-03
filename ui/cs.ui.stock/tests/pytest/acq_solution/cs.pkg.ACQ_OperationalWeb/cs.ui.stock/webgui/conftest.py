from seleniumx.sites import CardSuiteSite
from pages.stock_page import StockPage
import pytest
import os
from requests import Session
import zeep
import installerapi as iapi
from webservices.ws_fields import build_terminal, get_terminal_ws

# ====================================
# OPAA user for all tests
# ====================================
@pytest.fixture(scope="session", autouse=True)
def testuser():
    return CardSuiteSite.create_user("tieto", "tieto")

@pytest.fixture(scope="function")
def page_function(driver, testuser):
    return test_page(driver, testuser)

def test_page(driver, testuser):
    return StockPage(driver, credentials=testuser, webapp='stock')

@pytest.fixture(scope='function')
def new_ws_terminal(soap):
    return build_terminal(soap)

@pytest.fixture(scope='function')
def get_terminal(soap):
    return get_terminal_ws(soap)

@pytest.fixture(scope='session')
def soap(request):
    session = Session()
    session.verify = os.path.join(os.environ.get('CSHOME'), 'cfg/certificate/ACQ_MGMT/ACQ_MGMT.nioserver.cert')
    transport = zeep.Transport(session=session)
    settings = zeep.Settings(strict=False)
    if not os.path.exists('tmp'):
        os.mkdir('tmp')
    os.system('cp ' + os.path.join(os.environ.get('CSHOME'), 'cfg/xsd/AcqManagement.wsdl')+' tmp/AcqManagement.wsdl')
    copyFile(os.path.join(os.environ.get('CSHOME'), 'cfg/xsd/AcqManagementWSOTypes.xsd'))
    copyFile(os.path.join(os.environ.get('CSHOME'), 'cfg/xsd/AcqManagementTypes.xsd'))
    wsdl = 'tmp/AcqManagement.wsdl'
    client = zeep.Client(wsdl, transport = transport, settings = settings)
    client.set_ns_prefix('acq', 'http://tieto.lv/2017/03/01/AcqManagement')

    host = iapi.getProps('cs.bc.ws_acq_mgmt','Package')['ws_host'],
    port = iapi.getProps('cs.bc.ws_acq_mgmt','Package')['port']

    endpoint = f'https://{"tieto"}:{"tieto"}@{host[0]}:{port}'

    service = client.create_service(
        '{http://tieto.lv/2017/03/01/AcqManagement}AcqManagementBinding',
        endpoint
    )
    service.client = client # so that tests can access wsdl
    return service

def copyFile(source):
    destenatio = os.path.join('tmp', os.path.basename(source))
    with open(source, 'r') as srcFile, open(destenatio, 'w') as destFile:
        for line in srcFile:
            if line.find("elementFormDefault=\"qualified\"") != -1:
                line=line.replace("elementFormDefault=\"qualified\"","")
            if line.find("<xsd:any namespace=\"##other\"") == -1:
                destFile.write(line)
