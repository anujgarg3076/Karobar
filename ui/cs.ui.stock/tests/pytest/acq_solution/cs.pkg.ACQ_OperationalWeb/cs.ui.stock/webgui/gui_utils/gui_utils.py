from selenium.webdriver.support import expected_conditions as EC
from seleniumx.widgets import *
from selenium.webdriver.common.keys import Keys
import allure
from zapi.izapi import IZapi

class UtilsClass():
    def __init__(self, driver):
        self.driver = driver

    def clear_input(self, element):
        with IZapi.check("Clear input"):
            while not element.get_attribute("value") == "":
                element.send_keys(Keys.BACK_SPACE)

    def fill_values(self, element, attribute, value, invalid_values=False):
        input = element.find_element_by_tag_name('input')

        with IZapi.step(f"Fill input field with value: '{value}'"):
            input.send_keys(value)
        
            if not invalid_values:
                row_value = self.driver.find_element_by_xpath(f"//tbody//td[text()='{value}']").text
                with IZapi.check(f"Terminal by attribute: '{attribute}', value: '{value}' is found"):
                    assert str(value) == row_value,\
                    f"FAILED: Terminal is not found, displayed value: '{row_value}', entered value: '{value}'"
            else:

                output = self.driver.find_element_by_xpath("//tbody//p[text() = 'No results found']").text
                with IZapi.check(f"Zero terminals are returned"):
                    assert output == "No results found",\
                    f"FAILED: Some terminals returned '{output}'"

        return input
