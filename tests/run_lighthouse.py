"""Run an installed Lighthouse CLI without adding it to the deployed project."""
from pathlib import Path
import argparse, json, os, subprocess, tempfile

parser=argparse.ArgumentParser()
parser.add_argument('cli',help='Path to lighthouse/cli/index.js')
parser.add_argument('--base',default='http://127.0.0.1:8054/')
parser.add_argument('--home-only',action='store_true')
args=parser.parse_args()
out=Path(__file__).resolve().parents[1]/'docs/phase08'
rows=[]
cases = [('index',3)] if args.home_only else [('index',1),('index',2),('projects',1),('projects',2),('about',1),('contact',1),('lab',1)]
for name,run in cases:
    url=args.base+name+'.html'+('?view=grid' if name=='projects' else '')
    with tempfile.TemporaryDirectory(prefix='portfolio-lh-') as temp:
        target=Path(temp)/'report.json'
        command=['node',args.cli,url,'--quiet','--output=json','--output-path='+str(target),
          '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --ignore-certificate-errors',
          '--only-categories=performance,accessibility,best-practices,seo']
        result=subprocess.run(command,capture_output=True,text=True,timeout=180,env={**os.environ,'CHROME_PATH':'/usr/bin/chromium'})
        if result.returncode:
            row={'page':name,'run':run,'status':'BLOCKED','error':result.stderr[-1500:]}
        else:
            data=json.loads(target.read_text())
            row={'page':name,'run':run,'version':data['lighthouseVersion'],'status':'PASS' if not data.get('runtimeError') else 'FAIL',
              'scores':{k:v['score'] for k,v in data['categories'].items()},
              'metrics':{k:data['audits'][k].get('numericValue') for k in ['largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index']},
              'settings':{k:data['configSettings'][k] for k in ['formFactor','throttlingMethod','throttling','screenEmulation']},
              'diagnostics':{k:v.get('details') for k,v in data['audits'].items() if k in ['lcp-breakdown-insight','lcp-discovery-insight','cls-culprits-insight','layout-shifts','render-blocking-insight','mainthread-work-breakdown','bootup-time','long-tasks']},
              'warnings':data.get('runWarnings',[]),'runtimeError':data.get('runtimeError'),
              'failed_audits':[{ 'id':k,'title':v['title'],'score':v['score']} for k,v in data['audits'].items() if v.get('score') is not None and v['score']<1]}
        rows.append(row)
        (out/('lighthouse-home-extra.json' if args.home_only else 'lighthouse.json')).write_text(json.dumps(rows,indent=2)+'\n')
        print(name,run,row.get('scores',row.get('status')),flush=True)
