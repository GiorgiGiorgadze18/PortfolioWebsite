# Updated coverage for the owner-approved bottom-to-top choreography.
import os,runpy
os.environ['CASE_STACK_SLUGS']='tomford'
runpy.run_path('tests/case-study/stack_browser.py',run_name='__main__')
