from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from seleniumx.widgets import *
from pages.stock_elements import StockElements


class WaitClass(StockElements):
    def __init__(self, driver):
        self.driver = driver

    def wait_for_el_to_be_visible_by_id(self, el_id):
        WebDriverWait(self.driver, 60).until(
            EC.visibility_of_element_located((By.ID, el_id))
        )

    def wait_for_el_to_be_visible_by_xpath(self, el_xpath):
        WebDriverWait(self.driver, 60).until(
            EC.visibility_of_element_located((By.XPATH, el_xpath))
        )

    def wait_presence_all_elements_located_by_id(self, el_id):
        WebDriverWait(self.driver, 60).until(
                EC.presence_of_all_elements_located((By.ID,  el_id))
            )

    def wait_for_el_to_be_visible(self, el):
        WebDriverWait(self.driver, 60).until(
            EC.visibility_of_element_located((el))
        )
        
    def wait_for_el_to_be_invisible(self, el):
        WebDriverWait(self.driver, 60).until(
            EC.invisibility_of_element((el))
        )

    def wait_for_returned_row(self, el_xpath):
        WebDriverWait(self.driver, timeout=60).until(
            lambda x: len(self.driver.find_elements_by_xpath(el_xpath)) > 1
        )
    
    def wait_for_el_to_be_visible_by_text(self, el_text):
        WebDriverWait(self.driver, 60).until(
            EC.visibility_of_element_located((By.LINK_TEXT, el_text))
        )

    def wait_presence_all_elements_located_by_xpath(self, el_xpath):
        WebDriverWait(self.driver, 60).until(
                EC.presence_of_all_elements_located((By.XPATH,  el_xpath))
            )

    def wait_visibility_of_element(self, element):
        WebDriverWait(self.driver, 60).until(
                EC.visibility_of((element))
            )
        
    def wait_visibility_of_element_by_xpath(self, el_xpath):
        WebDriverWait(self.driver, 60).until(
                EC.visibility_of((By.XPATH, el_xpath))
            )

    def wait_visibility_all_elements_located_by_xpath(self, el_xpath):
        WebDriverWait(self.driver, 60).until(
                EC.visibility_of_all_elements_located((By.XPATH, el_xpath))
            )

    def wait_for_el_to_be_visible_by_tag(self, tag):
        WebDriverWait(self.driver, 60).until(
            EC.visibility_of_element_located((By.TAG_NAME, tag))
        )

    def wait_presence_all_elements_located_by_tag(self, tag):
        WebDriverWait(self.driver, 60).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, tag))
        )
