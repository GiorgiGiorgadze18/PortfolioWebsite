import assert from 'node:assert/strict';import {stackLayer} from '../../case-studies/shared/stack-motion.mjs';
const config={stackOrder:[0,1,2,3]},state={};
for(const mobile of [false,true]){const gap=mobile?48:75;const first=[0,1,2,3].map(i=>stackLayer(config,state,.35,i,mobile));assert.equal(first[1].z,gap);assert.equal(first[2].z,0);const second=[0,1,2,3].map(i=>stackLayer(config,state,.5,i,mobile));assert.equal(second[2].z,2*gap);assert(second[1].brightness<.25);assert.equal(second[2].brightness,1);const all=[0,1,2,3].map(i=>stackLayer(config,state,.65,i,mobile));assert.deepEqual(all.map(x=>Math.round(x.z)),[0,gap,gap*2,gap*3]);assert(all[1].brightness<.25&&all[2].brightness<.25&&all[3].brightness===1);assert.equal(stackLayer(config,state,1,3,mobile).z,0);assert.equal(stackLayer(config,state,1,1,mobile).brightness,1)}
console.log('PASS ordered steps, equal gaps, cumulative dimming and reassembly');

// A passed sheet receives the final shade at the start of the next rise, never progressively per chapter.
for(const mobile of [false,true])for(const rank of [0,1,2]){
 const start=.24+rank*.15;
 for(const p of [start+.0001,start+.025,start+.075,.65,.78])assert(Math.abs(stackLayer(config,state,p,rank,mobile).brightness-.2)<1e-9);
}
console.log('PASS immediate final shade remains constant through subsequent chapters');

for(const p of [.35,.5,.65]){
 const active=Math.round((p-.35)/.15)+1;
 for(let i=0;i<4;i++)assert(Math.abs(stackLayer(config,state,p,i).brightness-(i===active?1:.2))<1e-9);
}
console.log('PASS future overlapping sheets cannot repaint the dimmed base brightly');
