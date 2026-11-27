import assert from 'node:assert/strict';
import {resolveFrame,frameContrast} from '../../case-studies/shared/frame-style.mjs';
for(const color of ['#0078d8','#b98a46','#AD94D9']){const frame=resolveFrame({frame:{color,gridCells:28,glow:.52}});assert.equal(frame.color,color);assert.ok(frameContrast(color)>=3);assert.equal(frame.gridCells,28);}
assert.equal(resolveFrame({frame:{color:'#0078d8',gridCells:100,glow:-2}}).gridCells,64);assert.equal(resolveFrame({frame:{color:'#0078d8',glow:0}}).glow,0);
console.log('PASS configured project colors, contrast, density bounds and zero glow');
