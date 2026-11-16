from pathlib import Path
import hashlib, json
root = Path(__file__).resolve().parent
m = json.loads((root / "manifest.json").read_text())
for name, item in m["archives"].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == item["sha256"], name
for item in m["live_files"]:
    assert hashlib.sha256((root / "live-site" / item["path"]).read_bytes()).hexdigest() == item["sha256"], item["path"]
print("Backup checksums verified:", m["tracked_files"], "site files and", len(m["archives"]), "archives")
