export function createFrameMaterial(THREE,style,w,h){
 const short=Math.min(w,h),mobile=matchMedia('(max-width:700px)');
 const uniforms={uBottom:{value:0},uColor:{value:new THREE.Color(style.color)},uColor2:{value:new THREE.Color(style.color2)},uCells:{value:style.gridCells*(mobile.matches?.7:1)},uEdge:{value:style.edge},uGlow:{value:style.glow},uOpacity:{value:.18},uLayerAlphaMap:{value:null},uTime:{value:0},uScale:{value:new THREE.Vector2(w/short,h/short)},uPadding:{value:new THREE.Vector2((w+short*.14)/w,(h+short*.14)/h)},uBloom:{value:mobile.matches?0:1}};
 const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`
 varying vec2 vUv;uniform vec3 uColor,uColor2;uniform vec2 uScale,uPadding;uniform float uCells,uEdge,uGlow,uOpacity,uTime,uBloom,uBottom;uniform sampler2D uLayerAlphaMap;
 void main(){
 vec2 uv=(vUv-.5)*uPadding+.5;vec2 q=min(uv,1.-uv)*uScale;float d=min(q.x,q.y);float pixel=max(fwidth(d),.00001);
 vec2 st=uv*uScale*uCells;vec2 fw=max(fwidth(st),vec2(.00001));vec2 g=abs(fract(st-.5)-.5)/fw;vec2 gm=abs(fract(st/4.-.5)-.5)/(fw/4.);
 float dist=min(g.x,g.y),line=1.-min(dist,1.),major=1.-min(min(gm.x,gm.y),1.);float halo=(1.-smoothstep(0.,3.,dist))*.05;
 float layerAlpha=texture2D(uLayerAlphaMap,clamp(uv,0.,1.)).a;
 float grid=(line*.12+major*.12+halo)*(1.-.7*layerAlpha);float edge=pow(1.-smoothstep(0.,uEdge,max(d,0.)),1.6)*uGlow;
 float border=1.-smoothstep(0.,pixel,abs(d));float corner=(1.-step(.04,q.x))*(1.-step(.04,q.y));edge*=1.+.15*corner;
 float inside=step(0.,d);float bloom=(1.-inside)*exp(-abs(d)/.025)*.08*uBloom;
 float alpha=(inside*(grid+edge+.07*(1.-layerAlpha))+border*.85+bloom)*uOpacity;
 float shadow=(1.-inside)*exp(-abs(d)/.035)*.26*uBottom*uOpacity;
 vec3 col=mix(uColor,uColor2,clamp(uv.y,0.,1.)*.35);float total=clamp(alpha+shadow,0.,1.);gl_FragColor=vec4(col*alpha/max(alpha+shadow,.00001),total);
 #include <colorspace_fragment>
 }`});
 return {material,short,update(explode){uniforms.uOpacity.value=.18+.82*explode;uniforms.uCells.value=style.gridCells*(mobile.matches?.7:1);uniforms.uBloom.value=mobile.matches?0:1;}};
}
