import assert from 'node:assert/strict';
import {CaseStudyEngine,DisplaySurface,Disposer} from '../../case-studies/shared/engine.mjs';
import {createTimeline} from '../../case-studies/shared/timeline.mjs';
let surfaceState={side:'graphics',camera:[1,2,3],selection:'jbl-artwork'},disposed=0;
const before=structuredClone(surfaceState);
function session(validated=true){return {validated,chapters:[{id:'end',progress:1}],surface:new DisplaySurface({snapshot:()=>structuredClone(surfaceState),restore:s=>surfaceState=s,present:s=>surfaceState=s,dispose:()=>{}}),timeline:createTimeline([{p:0,state:{x:0}},{p:1,state:{x:10}}]),dispose:()=>disposed++};}
const engine=new CaseStudyEngine({load:async()=>session()});
for(let i=0;i<10;i++){assert.equal(await engine.open('jbl-artwork'),true);engine.goToChapter('end');assert.deepEqual(surfaceState,{x:10});engine.replay();assert.deepEqual(surfaceState,{x:0});engine.close();assert.deepEqual(surfaceState,before);}
assert.equal(disposed,10);
const invalid=new CaseStudyEngine({load:async()=>session(false)});await assert.rejects(invalid.open('invalid'),/Unvalidated/);assert.deepEqual(surfaceState,before);
let resolve;const interrupted=new CaseStudyEngine({load:()=>new Promise(r=>resolve=r)});const pending=interrupted.open('slow');interrupted.close();resolve(session());assert.equal(await pending,false);assert.deepEqual(surfaceState,before);
const d=new Disposer();let count=0;d.add(()=>count++);d.dispose();d.dispose();assert.equal(count,1);
console.log('PASS: lifecycle restore, 10 cycles, invalid assets, interrupted load cleanup, idempotent disposal');
