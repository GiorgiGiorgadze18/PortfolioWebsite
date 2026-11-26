import assert from 'node:assert/strict';
import {createTimeline,advanceSpring} from '../../case-studies/shared/timeline.mjs';
const input=[{p:0,state:{camera:[0,0,3],layers:{hero:{z:0}},screen:'home'}},{p:1,state:{camera:[1,2,4],layers:{hero:{z:2}},screen:'detail'}}];
const t=createTimeline(input);
const middle=t.stateAt(.5);
assert.equal(middle.layers.hero.z,1);
t.stateAt(1);assert.deepEqual(t.stateAt(.5),middle); // reverse seek has no history
middle.camera[0]=999;assert.equal(t.stateAt(.5).camera[0],.5);
input[0].state.layers.hero.z=999;assert.equal(t.stateAt(0).layers.hero.z,0);
assert.equal(t.stateAt(1).screen,'detail');
assert.throws(()=>t.stateAt(NaN));
assert.throws(()=>createTimeline([{p:0,state:{}},{p:0,state:{}}]));
let a={position:0,velocity:0};for(let i=0;i<60;i++)a=advanceSpring(a.position,a.velocity,1,1/60);
const b=advanceSpring(0,0,1,1);assert.ok(Math.abs(a.position-b.position)<1e-12);
assert.ok(a.position>.999 && a.position<=1);
console.log('PASS: pure reverse/direct seek, snapshot isolation, validation, refresh-independent spring');
