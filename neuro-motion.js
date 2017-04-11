var scene, camera, renderer;
var controls, effect, manager, cube;

init();

function init() {
  // scene, camera, rendererの設定
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Three.jsにVR関係の設定をAppend
  controls = new THREE.VRControls(camera);
  controls.standing = true;
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  manager = new WebVRManager(renderer, effect);

  // Resize用のハンドラ設定
  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);

  // 初期ジオメトリ作成
  geometry = new THREE.BoxGeometry(1, 1, 1);
  material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh( geometry, material );
  cube.position.set(0, 0, -5);
  scene.add( cube );
}


function render() {
  //cube.rotation.x += 0.1;
  //cube.rotation.y += 0.1;
  requestAnimationFrame(render);
  controls.update();
// renderer.render(scene, camera);
  manager.render(scene, camera);
}
render();

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
