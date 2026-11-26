from pathlib import Path
import json,base64,re,sys
root=Path.cwd();project=root/'case-studies/projects/jbl-artwork'
def data(p,mime):return 'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
manifest=json.loads((project/'manifest.json').read_text())
for l in manifest['layers']:l['src']=data(project/l['src'],'image/webp')
files={name:json.loads((project/name).read_text()) for name in ['chapters.json','presentation.json']};files['manifest.json']=manifest;files['config.json']=json.loads((root/'case-studies/config.json').read_text())
preface='const previewFiles='+json.dumps(files)+';const originalFetch=window.fetch;window.fetch=async(input,options)=>{const key=new URL(String(input),location.href).pathname.split("/").pop();return Object.hasOwn(previewFiles,key)?new Response(JSON.stringify(previewFiles[key]),{headers:{"content-type":"application/json"}}):originalFetch(input,options);};\n'
s=(root/'case-studies/jbl-preview.html').read_text();s=s.replace('<link rel="stylesheet" href="../css/fonts.css">','');s=s.replace('<link rel="stylesheet" href="shared/reference.css">','<style>'+(root/'case-studies/shared/reference.css').read_text()+'</style>');s=s.replace('<script type="module" src="shared/reference.mjs"></script>','<script type="module">'+preface+Path('/tmp/jbl-reference-bundle.mjs').read_text()+'</script>');s=s.replace('../assets/project-jbl.png',data(root/'assets/project-jbl.png','image/png'));s=s.replace('../projects.html#project/jbl-artwork','https://giorgigiorgadze18.github.io/PortfolioWebsite/projects.html#project/jbl-artwork')
fonts=''
for weight in [400,600,700]:fonts+="@font-face{font-family:Inter;font-weight:"+str(weight)+";src:url('"+data(root/f'assets/fonts/inter-{weight}.woff2','font/woff2')+"')}"
s=s.replace('</head>','<style>'+fonts+'</style></head>');Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/JBL-case-study-preview.html').write_text(s);print('Standalone bytes',len(s.encode()))
