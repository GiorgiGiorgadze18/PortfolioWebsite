// Real planes attached to the selected showroom display. No renderer or rAF owned here.
import {createTimeline} from './timeline.mjs';
export async function loadWebGLLayers({THREE,device,camera,layer,baseURL}){
 const [manifest,config]=await Promise.all(['manifest.json','presentation.json'].map(name=>fetch(new URL(name,baseURL)).then(r=>{if(!r.ok)throw Error('Case data unavailable');return r.json();})));
 if(!manifest.validated)throw Error('Unvalidated case assets');
 const root=new THREE.Group();root.layers.set(layer);const geometry=new THREE.PlaneGeometry(device.screenDimensions.w,device.screenDimensions.h),planes=[],textures=[];
 const loader=new THREE.TextureLoader();
 try{
  for(const item of manifest.layers){const texture=await loader.loadAsync(new URL(item.src,baseURL).href);textures.push(texture);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
   const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geometry,material);mesh.layers.set(layer);mesh.renderOrder=20+planes.length;root.add(mesh);planes.push(mesh);}
 }catch(error){textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());geometry.dispose();throw error;}
 const supports=[];device.group.traverse(o=>{if(o.userData.caseStudySupport){supports.push([o,o.visible]);o.visible=false;}});
 device.group.add(root);const timeline=createTimeline(config.keyframes),axis=new THREE.Vector3(-config.rotationAxis[0],config.rotationAxis[1],-config.rotationAxis[2]).normalize();
 const originalScreenVisible=device.screen.visible;let current=null,dirty=true;
 function draw(p,rect){
  current={p,rect};dirty=true;const state=timeline.stateAt(p),width=innerWidth,height=innerHeight;
  camera.setViewOffset(width,height,width/2-(rect.x+rect.width/2),height/2-(rect.y+rect.height/2),width,height);camera.updateProjectionMatrix();
  const unit=device.screenDimensions.w/350;
  const tilt=new THREE.Quaternion().setFromAxisAngle(axis,state.tilt*Math.PI/180);device.group.quaternion.copy(camera.quaternion).multiply(tilt);
  const center=new THREE.Vector3(0,0,device.project.camera.focusZ),depth=-camera.worldToLocal(center.clone()).z;
  const unitsPerPixel=2*Math.tan(camera.fov*Math.PI/360)*depth/(height*camera.zoom);
  const scale=Math.min(rect.width*.6*unitsPerPixel/device.bodyDimensions.w,rect.height*.65*unitsPerPixel/device.bodyDimensions.h,1.5);
  device.group.scale.setScalar(scale);
  const z=center.project(camera).z;device.group.position.set((rect.x+rect.width/2)/width*2-1,1-(rect.y+rect.height/2)/height*2,z).unproject(camera);
  planes.forEach((mesh,i)=>{const [x,y,z]=config.offsets[i];mesh.position.set(x*unit*state.spread,-y*unit*state.spread,.126+z*unit*state.spread+i*.0001);mesh.material.opacity=1-state.original;});
  device.screen.visible=state.original>.001;
 }
 return {draw,get dirty(){return dirty;},refresh(){if(current)draw(current.p,current.rect);dirty=false;},anchors(){return planes.map((mesh,i)=>{const b=manifest.layers[i].bbox;const point=new THREE.Vector3(((b[0]+b[2])/2/manifest.canvas[0]-.5)*device.screenDimensions.w,(.5-(b[1]+b[3])/2/manifest.canvas[1])*device.screenDimensions.h,0);mesh.localToWorld(point);point.project(camera);return {x:(point.x*.5+.5)*innerWidth,y:(-.5*point.y+.5)*innerHeight};});},inspect(){return {planes:planes.length,supportsHidden:supports.every(([object])=>!object.visible),progress:current?.p,depths:planes.map(m=>m.position.z)};},dispose(){root.removeFromParent();textures.forEach(t=>t.dispose());planes.forEach(p=>p.material.dispose());geometry.dispose();device.screen.visible=originalScreenVisible;supports.forEach(([object,visible])=>object.visible=visible);}};
}
