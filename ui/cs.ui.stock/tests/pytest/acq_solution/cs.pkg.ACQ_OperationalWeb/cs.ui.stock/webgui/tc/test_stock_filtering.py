import allure
import pytest
from input.input import attributes, invalid_values

@allure.feature("Terminal Stock")
@allure.testcase("https://support.irpc.tietoevry.com/browse/CSDEV-21977") 
class TestTerminalStock():
    """
    1. Test to verify that application opens and page is loaded
    """

    @allure.story("Check if terminal filtering works")
    def test_terminal_stock_filtering(self, page_function, new_ws_terminal):
            with allure.step("1. Open Terminal Stock application"):
                with allure.step(f"2. Create new terminal with WS, terminal id '{new_ws_terminal['id']}'"):
                    page_function.filter_by_attribute(attributes(), value=new_ws_terminal, clear=True)

    @allure.story("Check if terminal filtering doesn't work with invalid values")
    @pytest.mark.parametrize("values", (invalid_values()),
     ids=["Blank values", "Special characters", "Non-keyboard characters"])
    def test_terminal_stock_filtering2(self, page_function, values):
        with allure.step("1. Open Terminal Stock application"):
            page_function.filter_by_attribute(attributes(), value=values, invalid_values=True, clear=True)
