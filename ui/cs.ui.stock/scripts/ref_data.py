def add_media_ref_data(type, code, name):
    print("""
        MERGE INTO media_ref_data t
        USING ( 
            SELECT '%s' AS type, '%s' AS code, '%s' AS name FROM DUAL               
            ) s
        ON ( t.type = s.type AND t.code = s.code )
        WHEN NOT MATCHED THEN 
            INSERT (type, code, name)
            VALUES (s.type, s.code, s.name);
    """ % (type, code, name))

def add_terminal_table_fields():    
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'ID', 'Media Id')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TYPE', 'Type')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'STATE', 'State')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_INVENTORY_NO', 'Inventory No')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_TERMINAL_ID', 'Terminal Id')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_ACCEPTOR_ID', 'Acceptor Id')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_SERIAL_NO', 'Serial No')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_LOCATION', 'Location')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_PURCHASE_DATE', 'Created On')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_TERMINAL_MODEL', 'Model')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_POINT_CODE', 'Point Code')
    add_media_ref_data('TLMS_STOCK_ATTRIBUTE', 'TLMS_NAME', 'Name')
    
def add_stock_locations():    
    add_media_ref_data('TLMS_STOCK_LOCATION', 'STOCK', 'Stock')
    
add_terminal_table_fields()
add_stock_locations()
