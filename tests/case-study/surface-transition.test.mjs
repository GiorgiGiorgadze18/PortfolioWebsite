import assert from 'node:assert/strict';
import {createSurfaceTransition} from '../../case-studies/shared/surface-transition.mjs';
let now=0,pose={position:[1,2,3],rotation:[.1,.2,.3],scale:[1,1,1],camera:[0,1,10],cameraRotation:[0,0,0],zoom:1};const original=structuredClone(pose);
const rig=createSurfaceTransition({capture:()=>structuredClone(pose),apply:p=>pose=p,clock:()=>now});
let entry=rig.enter();now=300;rig.tick(now);assert.notDeepEqual(pose,original);const midpoint=structuredClone(pose);
let exit=rig.exit();assert.deepEqual(pose,midpoint);assert.equal(await entry,false);now=900;rig.tick(now);assert.equal(await exit,true);assert.deepEqual(pose,original);
for(let i=0;i<10;i++){entry=rig.enter();now+=600;rig.tick(now);assert.equal(await entry,true);assert.equal(rig.status,'active');exit=rig.exit();now+=600;rig.tick(now);await exit;assert.deepEqual(pose,original);}
entry=rig.enter();rig.dispose();assert.equal(await entry,false);assert.deepEqual(pose,original);
const reduced=createSurfaceTransition({capture:()=>pose,apply:p=>pose=p,reduced:()=>true});await reduced.enter();await reduced.exit();assert.deepEqual(pose,original);
console.log('PASS exact pose restore, 10 cycles, interrupted enter, dispose and reduced motion');
const held=createSurfaceTransition({capture:()=>structuredClone(pose),apply:p=>pose=p,clock:()=>now});
assert.equal(await held.enter({holdPose:true}),true);
assert.deepEqual(pose,original);
assert.equal(held.status,'active');
held.dispose();
assert.deepEqual(pose,original);
console.log('PASS About holds the selected pose until chapter navigation');
