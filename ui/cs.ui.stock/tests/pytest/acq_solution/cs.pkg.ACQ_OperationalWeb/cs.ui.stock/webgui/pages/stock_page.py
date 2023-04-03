from seleniumx.sites import CardSuiteSite
from . import stock_elements as SE
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import allure
from gui_utils.waits import WaitClass
from gui_utils.gui_utils import UtilsClass
from zapi.izapi import IZapi
from time import sleep

class StockPage(CardSuiteSite):
    STOCK_PAGE = SE.StockElements(By.ID, "app")

    def __init__(self, driver, url=None, credentials=None, webapp=None, allure_attach=False):
        super().__init__(driver, url, credentials, webapp, allure_attach)
        self.driver.maximize_window()
        self.wait = WaitClass(driver)
        self.gui_utils = UtilsClass(driver)
    
    def attach_screenshot(self, attach_note="screenshot"):
        self.driver.maximize_window()
        allure.attach(
            name=attach_note,
            body=self.driver.get_screenshot_as_png(),
            attachment_type=allure.attachment_type.PNG
        )

    def filter_by_attribute(self, attributes, value, invalid_values=False, clear=False):
        for attribute in attributes:
            with IZapi.step(f"Filter terminal by attribute: '{attribute};"):
                column = self.driver.find_element_by_xpath(f"//thead//th[div//@title = '{attribute}']")
                column.find_element_by_tag_name('button').click()
                self.wait.wait_for_el_to_be_visible_by_xpath('//ul[@role="menu"]')
                self.driver.find_element_by_xpath("//li[div[contains(text(),'Filter')]]").click()

                if not invalid_values:
                    if attribute == 'Media Id':
                        input = self.gui_utils.fill_values(column, attribute, value['id'])
                    elif attribute == 'Type':
                        input = self.gui_utils.fill_values(column, attribute, value['mediaType'])
                    elif attribute == 'State':
                        input = self.gui_utils.fill_values(column, attribute, value['state'])
                    elif attribute == 'Serial No':
                        input = self.gui_utils.fill_values(column, attribute, value['serialNumber'])
                else:
                    input = self.gui_utils.fill_values(column, attribute, value, invalid_values=True)
    
                if clear == True:  #clearing filter input if needed
                    self.wait.wait_for_el_to_be_invisible(self.STOCK_PAGE.LOADING_BAR)
                    self.gui_utils.clear_input(input)
                    self.wait.wait_for_el_to_be_invisible(self.STOCK_PAGE.LOADING_BAR)
                
    def create_new_terminal(self, newterminal):
        #self.STOCK_PAGE.ALL_TERMINALS.click()
        
        #mandatory
        self.STOCK_PAGE.NEW.click()
        self.STOCK_PAGE.MEDIA_TYPE.send_keys(f"{newterminal['mediaType']}{Keys.RETURN}")
        self.STOCK_PAGE.SERIAL_NUMBER.send_keys(newterminal['serialNumber'])
        
        #Non mandatory
        self.STOCK_PAGE.NAME.send_keys(newterminal['name'])
        #self.STOCK_PAGE.MODEL.send_keys(f"{newterminal['model']}{Keys.RETURN}")        not supported
        self.STOCK_PAGE.INVENTORY.send_keys(newterminal['inventoryNumber'])
        #self.STOCK_PAGE.VENDOR.send_keys(newterminal['vendor'])                        not supported
        self.gui_utils.clear_input(self.STOCK_PAGE.CASH_REGISTER)
        self.STOCK_PAGE.CASH_REGISTER.send_keys(newterminal['cashRegister'])
        #self.STOCK_PAGE.SOFTWARE.send_keys(f"{newterminal['software']}{Keys.RETURN}")  not supported
        self.STOCK_PAGE.HARDWARE.send_keys(f"{newterminal['hardwareType']}{Keys.RETURN}")
        self.STOCK_PAGE.OWNER.send_keys(f"{newterminal['owner']}{Keys.RETURN}")
        self.STOCK_PAGE.IP_ADDRESS.send_keys(newterminal['ip'])
        self.STOCK_PAGE.CURRENCY.send_keys(f"{newterminal['ccy']}{Keys.RETURN}")
        #self.STOCK_PAGE.INFO.send_keys(newterminal['info'])                            not supported
            
        self.STOCK_PAGE.SAVE.click()
        
    def read_terminal_info(self):
        # Get Titles of the columns and values of the terminal
        text_key = []
        text_value = []
        titles = self.driver.find_elements(By.XPATH, "//thead//th[not(descendant::input[@type='checkbox'])]//div[@title]")
        sleep(2) # Time sleep needed to wait untill data will be updated. It's hard to catch loading bar.
        terminal_value = self.driver.find_elements(By.XPATH, "//tbody//tr[1]/td[not(descendant::input[@type='checkbox'])]")
        for cell_title, cell_value in zip(titles, terminal_value):
            text_key.append(cell_title.text)
            text_value.append(cell_value.text)
        key_value_dict = dict(zip(text_key, text_value))
        return key_value_dict

    def change_terminal_state(self, value, to_state_action, to_state, to_status):
        with IZapi.step(f"Change terminal state for terminal with Media id: '{value['id']}'"):
            with IZapi.step(f"Select terminal with Media id '{value['id']}'"):
                terminal = self.driver.find_element_by_xpath(f"//tbody/tr[td[text()='{str(value['id'])}']]")
                check_box = terminal.find_element_by_tag_name("input")
                check_box.click()
                if self.STOCK_PAGE.CHANGE_STATE.get_attribute('disabled') is None:
                    with IZapi.step("Open Change terminal state window"):
                        self.STOCK_PAGE.CHANGE_STATE.click()

                        with IZapi.step(f"Select action: '{to_state_action}'"):
                            self.driver.find_element_by_xpath(f"//div[h2[text()='State change']]//label[span[text()='{to_state_action}']]").click()
                            if self.STOCK_PAGE.CHANGE.get_attribute('disabled') is None:
                                with IZapi.step("Click on the 'Change' button"):
                                    self.STOCK_PAGE.CHANGE.click()
                                    # Time sleep needed to wait untill data will be updated. It's hard to catch loading bar.
                                    sleep(2)

                key_value_dict = self.read_terminal_info()
                with IZapi.check(f"State is changed to '{to_state}'"):
                    assert key_value_dict["STATE"] == to_state,\
                    f"FAILED: State changed to {key_value_dict['STATE']}"
                with IZapi.check(f"Status is changed to '{to_status}'"):
                    assert key_value_dict["STATUS"] == to_status,\
                    f"FAILED: State changed to {key_value_dict['STATUS']}"
