"""Inspect owner source metadata and saved composite without rerendering effects."""
import sys,json,hashlib
from pathlib import Path
from psd_tools import PSDImage
source=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
psd=PSDImage.open(source)
layers=[dict(name=l.name,kind=l.kind,visible=l.visible,opacity=l.opacity,blend=str(l.blend_mode),bbox=list(l.bbox),effects=[str(effect) for effect in l.effects] if l.effects else []) for l in psd.descendants()]
(out/'psd-inspection.json').write_text(json.dumps(dict(bytes=source.stat().st_size,sha256=hashlib.sha256(source.read_bytes()).hexdigest(),size=list(psd.size),layers=layers),indent=2)+'\n')
psd.topil().save(out/'psd-merged.png')
