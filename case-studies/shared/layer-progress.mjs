export function layerProgress(windows,state,p,index){
 const range=windows?.[index];if(!range)return state.spread;
 const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
 return smooth((p-range[0])/(range[1]-range[0]))*(1-smooth((p-.82)/.12));
}
