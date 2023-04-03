import allure
from input.input import new_terminal

@allure.feature("Terminal Stock")
@allure.testcase("https://support.irpc.tietoevry.com/browse/CSDEV-22998") 
class TestNewterminal():
    """
    1. Test to verify that new terminal creation is working
    """
    
    @allure.story("Create new terminal with input data")
    def test_new_terminal(self, page_function, soap):
        with allure.step("1. Create new terminal"):
            newterminal = new_terminal()
            page_function.create_new_terminal(newterminal)
            
        with allure.step("2. Search for the created terminal and check its serial number"):
            page_function.filter_by_attribute(['Serial No'], value=newterminal)
            result = page_function.read_terminal_info()
            assert newterminal['serialNumber'] == result['SERIAL NO'], "Found terminal data not equal"
            
        with allure.step("3. Read terminal data with WS"):
            get_terminal = dict(soap.getTerminal(**{'id': result['MEDIA ID']}).__values__)
            
        with allure.step("4. Assert full expected terminal data to WS data"):
            assert {k: newterminal[k] for k in newterminal.keys() & get_terminal.keys()} == {k: get_terminal[k] for k in newterminal.keys() & get_terminal.keys()}
