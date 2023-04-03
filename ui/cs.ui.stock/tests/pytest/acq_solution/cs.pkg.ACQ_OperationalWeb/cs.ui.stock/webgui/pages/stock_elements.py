from seleniumx.widgets import ComponentBase, Element, FieldTextbox, ActionButton, DropDownNative, By, DataGrid

class StockElements(Element):
    class Component(ComponentBase):
        TERMINAL_GRID   = Element(By.XPATH, "//div[@id='app']//table[1]//tbody")
        LOADING_BAR     = Element(By.XPATH, "//span[@role='progressbar']")
        ALL_TERMINALS   = ActionButton(By.XPATH, '//button[text()="All terminals"]')
        NEW             = ActionButton(By.XPATH, '//button[text()="New"]')
        NEW_FROM_FILE   = ActionButton(By.XPATH, '//button[text()="New from file"]')
        EDIT            = ActionButton(By.XPATH, '//button[text()="Edit"]')
        CHANGE_STATE    = ActionButton(By.XPATH, '//button[text()="Change state"]')
        FETCHED_ROWS    = Element(By.XPATH, '//div[@id="app"]//div//div//div//div//div//p')
        MEDIA_TYPE      = Element(By.XPATH, "//div[label[text()='Media type']]//input")
       
        #new terminal
        SERIAL_NUMBER   = Element(By.XPATH, "//input[@name='tlms_serial_no']")
        NAME            = Element(By.XPATH, "//input[@name='tlms_name']")
        MODEL           = Element(By.XPATH, "//div[label[text()='Model']]//input")
        INVENTORY       = Element(By.XPATH, "//input[@name='tlms_inventory_no']")
        VENDOR          = Element(By.XPATH, "//input[@name='vendor']")
        CASH_REGISTER   = Element(By.XPATH, "//input[@name='tlms_cash_register']")
        SOFTWARE        = Element(By.XPATH, "//div[label[text()='Software']]//input")
        HARDWARE        = Element(By.XPATH, "//div[label[text()='Hardware type']]//input")
        OWNER           = Element(By.XPATH, "//div[label[text()='Owner']]//input")
        IP_ADDRESS      = Element(By.XPATH, "//input[@name='tlms_ip_address']")
        CURRENCY        = Element(By.XPATH, "//div[label[text()='Currency']]//input")
        NOTE            = Element(By.XPATH, "//input[@name='tlms_note']")              
        SAVE            = ActionButton(By.XPATH, '//button[text()="Save"]')
        
        TABLE_ROW       = DataGrid(By.TAG_NAME, "table") 
        
        # Change terminal state window
        NOTE            = FieldTextbox(By.XPATH, "//div[label[text()='Note']]//input")
        CANCEL          = ActionButton(By.XPATH, "//button[text()='Cancel']")
        CHANGE          = ActionButton(By.XPATH, "//button[text()='Change']")
