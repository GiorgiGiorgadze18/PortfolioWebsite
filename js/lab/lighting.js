import '../../showroom/vendor/three.js';

export function mount(api) {
  const THREE = window.SHOWROOM_THREE;
  const canvas = api.canvas('A machined torus under a movable studio light casting a shadow on the floor');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, powerPreference: 'low-power'});
  api.cleanup(() => { renderer.forceContextLoss(); renderer.dispose(); });
  api.listen(canvas, 'webglcontextlost', event => {
    event.preventDefault();
    api.fail(new Error('Graphics context lost'));
  });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#101b2a');
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const camera = new THREE.PerspectiveCamera(36, 1, .1, 50);
  camera.position.set(3.7, 2.6, 5);
  camera.lookAt(0, .65, 0);
  function mesh(geometry, options) {
    const material = new THREE.MeshStandardMaterial(options);
    api.cleanup(() => { material.dispose(); geometry.dispose(); });
    const object = new THREE.Mesh(geometry, material);
    scene.add(object);
    return object;
  }
  const subject = mesh(new THREE.TorusKnotGeometry(.65, .23, 120, 20), {
    color: '#8bb4c5', roughness: .28, metalness: .5
  });
  subject.position.y = 1.12;
  subject.rotation.set(.4, -.27, .2);
  subject.castShadow = subject.receiveShadow = true;

  const floor = mesh(new THREE.PlaneGeometry(200, 200), {color: '#253746', roughness: .78});
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  const key = new THREE.PointLight('#fff2dc', 34, 16);
  key.castShadow = true;
  const shadowSize = api.size().width < 550 ? 512 : 1024;
  key.shadow.mapSize.set(shadowSize, shadowSize);
  key.shadow.bias = -.0003;
  key.shadow.normalBias = .015;
  scene.add(key);
  api.cleanup(() => key.shadow.dispose());

  const fill = new THREE.HemisphereLight('#abddff', '#4b3b4e', .7);
  const rim = new THREE.DirectionalLight('#76c4ff', 1.3);
  rim.position.set(-2, 2, -3);
  scene.add(fill, rim);
  return {
    resize({width, height, dpr}) {
      camera.aspect = width / height;
      camera.fov = camera.aspect < 1.15 ? 48 : 36;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
    },
    draw() {
      const {angle, power, roughness, ambient} = api.settings;
      const radians = THREE.MathUtils.degToRad(angle);
      key.position.set(Math.sin(radians) * 3, 3.5, Math.cos(radians) * 3);
      key.intensity = power;
      fill.intensity = ambient;
      subject.material.roughness = roughness;
      renderer.render(scene, camera);
      return false;
    }
  };
}
