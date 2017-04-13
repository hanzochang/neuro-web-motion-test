var scene, camera, dolly, renderer;
var controls, effect, manager, cube;

var testObject;
var gridBase = 1.5;
var depth = 8;
var centerPoints = new Array;
var lines = new Array;

init();

function init() {
  // scene, camera, rendererの設定
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // vr対応をする場合
  // Three.jsにVR関係の設定をAppend
  controls = new THREE.VRControls(camera);
  controls.standing = true;
  effect = new THREE.VREffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  manager = new WebVRManager(renderer, effect);

  dolly = new THREE.Group();
  dolly.position.set( 0, -1, 8 );
  dolly.rotateZ = 10;
  scene.add(dolly);
  dolly.add(camera);

  // vr対応しない場合
  //scene.add(camera);

  // Resize用のハンドラ設定
  window.addEventListener('resize', onResize, true);
  window.addEventListener('vrdisplaypresentchange', onResize, true);

}

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


