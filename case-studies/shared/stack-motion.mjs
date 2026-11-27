const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function stackLayer(config,state,p,index,mobile=false,out={}){
 if(!config.stackOrder)return null;
 const rank=config.stackOrder[index],fade=1-smooth((p-.82)/.12),start=.24+(rank-1)*.15;
 const rise=rank===0?0:smooth((p-start)/.10)*fade;
 // Unraised sheets still overlap the base: dim them too, or they repaint it brightly.
 const active=Math.min(3,1+Math.floor((p-.24)/.15));
 const later=p>.24&&rank!==active?fade:0;
 out.z=rank*(mobile?48:75)*rise;out.brightness=1-.80*later;return out;
}
