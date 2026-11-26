// Review-only entry. No public project is marked published by this module.
if(new URLSearchParams(location.search).get('caseStudyPreview')==='1'){
 const inspector=document.querySelector('#project-inspector'),title=document.querySelector('#inspector-title');
 const trigger=document.createElement('button');trigger.type='button';trigger.className='text-control';trigger.textContent='Explore case study · Preview';trigger.hidden=true;inspector.append(trigger);
 const update=()=>{trigger.hidden=title.textContent!=='JBL Premium Audio Campaign';};new MutationObserver(update).observe(title,{childList:true,subtree:true,characterData:true});update();
 let dialog,frame,oldOverflow;
 const close=()=>{if(!dialog?.open)return;dialog.close();frame.remove();document.documentElement.style.overflow=oldOverflow;document.documentElement.removeAttribute('data-case-study-active');trigger.focus({preventScroll:true});};
 trigger.onclick=()=>{if(!dialog){dialog=document.createElement('dialog');dialog.setAttribute('aria-label','JBL composition study');dialog.style.cssText='width:100vw;max-width:100vw;height:100svh;max-height:100svh;padding:0;border:0;background:#080d18';document.body.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});}
 frame=document.createElement('iframe');frame.title='JBL composition study';frame.src='case-studies/jbl-preview.html?embedded=1';frame.style.cssText='width:100%;height:100%;border:0';dialog.append(frame);oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';document.documentElement.dataset.caseStudyActive='true';dialog.showModal();};
 addEventListener('message',e=>{if(e.origin===location.origin&&e.source===frame?.contentWindow&&e.data?.type==='case-study:close')close();});
}
