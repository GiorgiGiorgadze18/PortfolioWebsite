// Renderer-agnostic lifecycle; adapters must restore their own exact surface snapshot.
export class Disposer {
 #tasks=[];
 add(cleanup) {this.#tasks.push(cleanup);return cleanup;}
 dispose() {const errors=[];for(const task of this.#tasks.splice(0).reverse())try{task();}catch(error){errors.push(error);}if(errors.length)throw new AggregateError(errors,'Cleanup failed');}
}
export class DisplaySurface {
 constructor(adapter) {for(const key of ['snapshot','restore','present','dispose'])if(typeof adapter[key]!=='function')throw new TypeError(`Surface missing ${key}`);this.adapter=adapter;}
 snapshot(){return this.adapter.snapshot();}
 restore(snapshot){return this.adapter.restore(snapshot);}
 present(state){return this.adapter.present(state);}
 dispose(){return this.adapter.dispose();}
}
export class CaseStudyEngine {
 #session;#request=0;
 constructor({load,onState=()=>{}}) {this.load=load;this.onState=onState;this.status='idle';}
 #set(status){this.status=status;this.onState(status);}
 async open(slug) {
  this.close();const request=++this.#request;this.#set('entering');
  let session;
  try {
   session=await this.load(slug);
   if(request!==this.#request){session.dispose();return false;}
   if(!session.validated)throw new Error('Unvalidated assets cannot enter presentation');
   const snapshot=session.surface.snapshot();
   this.#session={...session,snapshot,progress:0};
   this.seek(0);this.#set('active');return true;
  } catch(error) {
   if(this.#session)this.close();else session?.dispose();
   if(request===this.#request)this.#set('idle');
   throw error;
  }
 }
 seek(progress) {
  if(!this.#session)return;
  const session=this.#session,state=session.timeline.stateAt(progress);
  session.surface.present(state);session.progress=Math.min(1,Math.max(0,progress));
 }
 replay(){this.seek(0);}
 goToChapter(id){const chapter=this.#session?.chapters.find(chapter=>chapter.id===id);if(!chapter)throw new RangeError('Unknown chapter');this.seek(chapter.progress);}
 close(){
  ++this.#request;
  const session=this.#session;this.#session=undefined;
  if(!session){this.#set('idle');return;}
  this.#set('exiting');
  try{session.surface.restore(session.snapshot);}finally{try{session.dispose();}finally{this.#set('disposed');}}
 }
}
