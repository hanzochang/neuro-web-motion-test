var scene, camera, renderer;
var controls, effect, manager, cube;


var testObject;

init();

function init() {
  // scene, camera, rendererの設定
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000 );
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

  material = new THREE.LineBasicMaterial({
    color: 0xaaaaaa,
    linewidth: 100
  });
  //material =  new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 10, gapSize: 0.9 } );

  var j = 5;
  var base = 0.5;
  //var z = 0.5;
  // geometry = new THREE.Geometry();
  // geometry.vertices.push(
    // new THREE.Vector3( base, 0, -j+1 ),
    // new THREE.Vector3( 0, base, -j+1 ),
    // new THREE.Vector3( -base, 0, -j+1 ),
    // new THREE.Vector3( 0, -base, -j+1 ),
    // new THREE.Vector3( base, 0, -j+1 )
  // );
  // line = new THREE.Line( geometry, material );
  // scene.add( line );
  //
  var rectCenters = new Array;
  for(var phase = 1; phase < 4 ; phase ++){

  }

  var mets = [ [base*2, 0, -j], [base*2, base*2, -j], [0, base*2, -j],
               [-base*2, base*2, -j], [-base*2, 0, -j], [-base*2, -base*2, -j],
               [0, -base*2, -j], [base*2, -base*2, -j]];

  for (var i = 0; i < mets.length; i++){
    geometry = new THREE.Geometry();
    var x = mets[i][0];
    var y = mets[i][1];
    var z = mets[i][2];

    geometry.vertices.push(
      new THREE.Vector3( x+base, y, z),
      new THREE.Vector3( x, y+base, z),
      new THREE.Vector3( x-base, y, z),
      new THREE.Vector3( x, y-base, z),
      new THREE.Vector3( x+base, y, z)
    );

    line = new THREE.Line( geometry, material );
    scene.add( line );
  }

  // for (var i=0 ; i < 1 ; i ++) {
    // geometry = new THREE.Geometry();
    // geometry.vertices.push(
      // new THREE.Vector3( z, 0, -j+1 ),
      // new THREE.Vector3( 0, z, -j+1 ),
      // new THREE.Vector3( -z, 0, -j+1 ),
      // new THREE.Vector3( 0, -z, -j+1 ),
      // new THREE.Vector3( z, 0, -j+1 )
    // );
  // }


  // 正解データ
  // for (var i=0 ; i < 1 ; i ++) {
    // var j = 10
    // var z = 0.5;
    // geometry = new THREE.Geometry();
    // geometry.vertices.push(
      // new THREE.Vector3( z, 0, -j+1 ),
      // new THREE.Vector3( 0, z, -j+1 ),
      // new THREE.Vector3( -z, 0, -j+1 ),
      // new THREE.Vector3( 0, -z, -j+1 ),
      // new THREE.Vector3( z, 0, -j+1 )
    // );
    // line = new THREE.Line( geometry, material );
    // scene.add( line );
  // }


  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(
    // new THREE.Vector3( -10, 0, 0 ),
    // new THREE.Vector3( 0, 10, 0 ),
    // new THREE.Vector3( 10, 0, 0 )
  // );

  // testObject = new THREE.Line( geometry, new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 1, gapSize: 0.5 } ) );
  // scene.add( testObject );
  // 初期ジオメトリ作成
  // for (var i=0 ; i < 100 ; i ++){
    // geometry = new THREE.BoxGeometry(1, 1, 1);
    // material = new THREE.LineDashedMaterial( {
      // color: 0xffffff,
      // linewidth: 1,
      // scale: 1,
      // dashSize: 3,
      // gapSize: 1,
    // } );
    // cube = new THREE.Mesh( geometry, material );
    // cube.position.set(0, 0, -i*2);
    // scene.add( cube );
  // }
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
