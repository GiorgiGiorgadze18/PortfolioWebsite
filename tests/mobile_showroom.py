"""Compatibility entry point for the current phone regression."""
from tablet_mobile import check_phone,main

def check_phones(browser,base,out,engine='chromium',smoke=False):
 return [check_phone(browser,base,out,engine)]

if __name__=='__main__':
 import sys
 sys.argv=[v for v in sys.argv if v!='--smoke']
 if '--phone-only' not in sys.argv:sys.argv.append('--phone-only')
 main()
