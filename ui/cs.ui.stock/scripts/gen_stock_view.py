#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
from lcmobj import *
import installerapi
import argparse

parser = argparse.ArgumentParser(description='pytool gen_stock_view.py connectstring')
parser.add_argument('connectstr')
args = parser.parse_args()
connectstr = args.connectstr

connect(connectstr)

db = installerapi.get_ora_connect('cs.bc.lcm/database')
dbc = db.cursor()

def attrIDs():
    attrs = {}
    dbc.execute("SELECT attr_id, attr_name FROM lcm_attrs")
    for row in dbc.fetchall():
        attrs[row[1]] = row[0]
    return attrs

def make_stock_view(name, klass, fields):
    attrs = attrIDs()

    if not isinstance(klass, list):
        klass = [klass]

    if isinstance(fields, list):
        fields = dict(list(zip(fields, fields)))

    fieldnames = {}
    for fieldid, fieldname in fields.items():
        try: fieldnames[fieldname].append(fieldid)
        except: fieldnames[fieldname] = [fieldid]

    
    cols = []
    for fieldname, fieldids in fieldnames.items():
        decodes = ['%s, ma.attr_value' % attrs[x] for x in fieldids]
        cols.append('MIN(DECODE(ma.attr_id, %s)) AS %s' % (', '.join(decodes), fieldname))
    
    sql = '''CREATE OR REPLACE VIEW %s AS
    SELECT mt.typeclass, mt.media_type_group AS type_group, m.media_id AS id, m.state, mt.media_type AS type, mt.institution, %s
      FROM medias m, media_attrs ma, media_types mt
     WHERE m.media_type_id = mt.media_type_id
       AND m.media_id = ma.media_id (+)
       AND mt.typeclass IN (%s)
       GROUP BY mt.typeclass, mt.media_type_group, mt.institution, m.media_id, m.state, mt.media_type
           ''' % (name, ', '.join(cols), ', '.join(['\'%s\'' % x for x in klass]))
           
    dbc.execute(sql)


make_stock_view('r_stock_terminals', ['POS','ATM'], [
        'TLMS_STATUS',
        'TLMS_INVENTORY_NO',
        'TLMS_TERMINAL_MODEL',
        'TLMS_LOCATION',
        'TLMS_TERMINAL_ID',
        'TLMS_ACCEPTOR_ID',
        'TLMS_NAME',
        'TLMS_POINT_CODE',
        'TLMS_SERIAL_NO',
        'TLMS_PURCHASE_DATE',
        'TLMS_ADD_INFO'
    ])
