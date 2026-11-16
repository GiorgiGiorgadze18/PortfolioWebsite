"""Wait for this portfolio's Pages build and compare deployed source checksums."""
from pathlib import Path
import argparse, concurrent.futures, hashlib, json, subprocess, time, urllib.parse, urllib.request

parser=argparse.ArgumentParser()
parser.add_argument('commit',help='Expected full GitHub Pages commit SHA')
parser.add_argument('--base-url',default='https://giorgigiorgadze18.github.io/PortfolioWebsite/')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
base=args.base_url.rstrip('/')+'/'
for attempt in range(24):
    build=json.loads(subprocess.check_output(['gh','api','repos/GiorgiGiorgadze18/PortfolioWebsite/pages/builds/latest']))
    if build['commit']==args.commit and build['status']=='built': break
    if build['commit']==args.commit and build['status']=='errored': raise RuntimeError(build)
    if attempt==23: raise RuntimeError('Expected Pages build has not completed: '+build['status'])
    time.sleep(10)
print('Pages build completed at the expected commit',flush=True)
manifest=json.loads((root/'tests/artifacts/source-sha256.json').read_text())
def check(item):
    path,expected=item
    with urllib.request.urlopen(base+urllib.parse.quote(path)+'?release='+args.commit[:12],timeout=40) as response:
        data=response.read()
    actual=hashlib.sha256(data).hexdigest()
    assert actual==expected,(path,actual,expected)
    return path
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
    verified=list(pool.map(check,manifest.items()))
report={'production_url':base+'projects.html','deployed_commit':args.commit,'pages_status':build['status'],'all_deployed_source_files_match':True,'verified_files':verified}
(root/'tests/artifacts/production-deployment.json').write_text(json.dumps(report,indent=2)+'\n')
print('Production files match the tested source:',len(verified),flush=True)
