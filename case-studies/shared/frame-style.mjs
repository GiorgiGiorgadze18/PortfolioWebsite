export const frameContrast=hex=>{const rgb=hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return (.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]+.05)/(.0031+.05);};
export function resolveFrame(manifest,sources=[]){
 let color=manifest.frame?.color;
 if(!color){const bins=Array.from({length:36},()=>({n:0,s:0,r:0,g:0,b:0}));const cv=document.createElement('canvas');cv.width=cv.height=96;const c=cv.getContext('2d',{willReadFrequently:true});
  for(const image of sources){c.clearRect(0,0,96,96);c.drawImage(image,0,0,96,96);const d=c.getImageData(0,0,96,96).data;for(let i=0;i<d.length;i+=4){const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min,s=max?delta/max:0;if(d[i+3]<128||s<.25||max<.1||max>.98)continue;let h=max===r?((g-b)/delta+6)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;const v=bins[Math.floor(h*6)];v.n++;v.s+=s;v.r+=d[i];v.g+=d[i+1];v.b+=d[i+2];}}
  const total=bins.reduce((n,b)=>n+b.n,0),eligible=bins.filter(b=>b.n>=total*.015&&b.n>0);eligible.sort((a,b)=>b.s/b.n-a.s/a.n);const v=eligible[0];color=v?'#'+[v.r,v.g,v.b].map(n=>Math.round(n/v.n).toString(16).padStart(2,'0')).join(''):'#b8b8b8';
  while(frameContrast(color)<3){color='#'+color.match(/[\da-f]{2}/gi).map(v=>Math.min(255,Math.round(parseInt(v,16)*.95+255*.05)).toString(16).padStart(2,'0')).join('');}
 }
 return {color,color2:manifest.frame?.color2||color,gridCells:Math.max(8,Math.min(64,Number(manifest.frame?.gridCells)||28)),glow:Math.max(0,Math.min(1,Number(manifest.frame?.glow??.52))),edge:.055};
}
export function createDOMSheet(plane,image,style){
 const canvas=document.createElement('canvas');canvas.className='holo-sheet';canvas.setAttribute('aria-hidden','true');plane.append(canvas);const c=canvas.getContext('2d');
 function resize(w,h){if(w<=0||h<=0)return;const mobile=matchMedia('(max-width:700px)').matches,dpr=Math.min(devicePixelRatio||1,mobile?1.5:2),short=Math.min(w,h),cell=short/(style.gridCells*(mobile?.7:1));canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.strokeStyle=style.color;
  for(let axis=0;axis<2;axis++)for(let n=0,pos=0;pos<=(axis?h:w);n++,pos=n*cell){c.globalAlpha=n%4===0?.16:.075;c.lineWidth=.65;c.shadowColor=style.color;c.shadowBlur=2;c.beginPath();c.moveTo(axis?0:pos,axis?pos:0);c.lineTo(axis?w:pos,axis?pos:h);c.stroke();}
  c.shadowBlur=0;c.globalAlpha=.07;c.fillStyle=style.color;c.fillRect(0,0,w,h);c.globalCompositeOperation='destination-out';c.globalAlpha=.7;c.drawImage(image,0,0,w,h);c.globalCompositeOperation='source-over';c.globalAlpha=1;
  const glow=short*style.edge;for(let side=0;side<4;side++){const g=c.createLinearGradient(side===1?w:0,side===3?h:0,side===1?w-glow:side===0?glow:0,side===3?h-glow:side===2?glow:0);for(let i=0;i<=16;i++){const t=i/16,alpha=Math.pow(1-t*t*(3-2*t),1.6)*style.glow;g.addColorStop(t,(side===2?style.color2:style.color)+Math.round(alpha*255).toString(16).padStart(2,'0'));}c.fillStyle=g;c.fillRect(side===1?w-glow:0,side===3?h-glow:0,side<2?glow:w,side<2?h:glow);}
  c.strokeStyle=style.color;c.globalAlpha=.85;c.lineWidth=1;c.strokeRect(.5,.5,w-1,h-1);c.globalAlpha=1;plane.style.setProperty('--frame-color',style.color);
 }
 return {resize};
}
