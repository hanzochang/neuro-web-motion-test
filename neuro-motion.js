var scene, camera, renderer;
var controls, effect, manager, cube;

var testObject;
var gridBase = 1.5;
var depth = 8;
var centerPoints = new Array;
var lines = new Array;

init();
addObjects();

function init() {
  // scene, camera, rendererの設定
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 100 );
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

}

function addObjects(){

  material = new THREE.LineBasicMaterial({
    color: 0x666666,
    linewidth: 2
  });
  //material =  new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 10, gapSize: 0.9 } );

  centerPoints = createGrid(depth, gridBase, 40);

  createDiamondRect(centerPoints, gridBase);
}

function createDiamondRect(centerPoints, gridBase, overrideDepth = null){
  for (var i = 0; i < centerPoints.length; i++){
    var geometry = new THREE.Geometry();
    var x = centerPoints[i][0];
    var y = centerPoints[i][1];
    var z = centerPoints[i][2];

    rand = Math.random();

    geometry.vertices.push(
      new THREE.Vector3( x+gridBase, y, overrideDepth ? overrideDepth : z),
      new THREE.Vector3( x, y+gridBase, overrideDepth ? overrideDepth : z),
      new THREE.Vector3( x-gridBase, y, overrideDepth ? overrideDepth : z),
      new THREE.Vector3( x, y-gridBase, overrideDepth ? overrideDepth : z),
      new THREE.Vector3( x+gridBase, y, overrideDepth ? overrideDepth : z)
    );

    // console.log(geometry);

    line = new THREE.Line( geometry, material );
    scene.add( line );
    lines.push(line);

    createPoints(x+gridBase, y ,z+0.1);
  }
}

function createPoints(x, y, z){
  var starsGeometry = new THREE.Geometry();
  var star = new THREE.Vector3();
  star.x = x;
  star.y = y;
  star.z = z;

  starsGeometry.vertices.push( star )
  var starsMaterial = new THREE.PointsMaterial( { color: 0xcccccc, size: 0.04 } )
  var starField = new THREE.Points( starsGeometry, starsMaterial );
  scene.add( starField );
}

function createGrid(depth, gridBase, gridGenPhase){
  var depth = -depth;
  var rectCenters = new Array;

  for(var phase = 1; phase <= gridGenPhase ; phase++){
    var maxX = phase * gridBase;
    var maxY = phase * gridBase;
    for(var i = 0; i < phase; i++){
      var x = maxX;
      var y = maxY - i*gridBase*2;
      rectCenters.push([x, y, depth]);
    }
    for(var i = 0; i < phase; i++){
      var x = maxX - i*gridBase*2;
      var y = -maxY;
      rectCenters.push([x, y, depth]);
    }
    for(var i = 0; i < phase; i++){
      var x = -maxX;
      var y = -maxY + i*gridBase*2;
      rectCenters.push([x, y, depth]);
    }
    for(var i = 0; i < phase; i++){
      var x = -maxX + i*gridBase*2;
      var y = maxY;
      rectCenters.push([x, y, depth]);
    }
  }

  return rectCenters;
}


// var motionLine;
// function initializeMotionLine(x, y, z, length){
  // var motionLineGeometry = new THREE.Geometry();
  // motionLineGeometry.vertices.push(
    // new THREE.Vector3(x, y, z),
    // new THREE.Vector3(x+length, y+length, z)
  // );

  // var motionLineMaterial = new THREE.LineBasicMaterial({
    // color: 0xffffff,
    // linewidth: 10
  // });

  // motionLine = new THREE.Line(motionLineGeometry, motionLineMaterial);
  // console.log(motionLine);
  // scene.add( motionLine );
// }
// initializeMotionLine(gridBase,0,-7.9,1);

function MotionLine(length, speed, routeVertices){
  this.length = length;
  this.speed = speed;
  this.routeVertices = routeVertices;
  this.currentRouteVerticesNum = 0;

  var motionLineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 10
  });

  var motionLineGeometry = new THREE.Geometry();
  startVertice = this.routeVertices[0];
  motionLineGeometry.vertices.push(
    new THREE.Vector3(startVertice[0], startVertice[1], startVertice[2]),
    new THREE.Vector3(startVertice[0] + length, startVertice[1] + length, startVertice[2])
  );

  this.motionLine = new THREE.Line(motionLineGeometry, motionLineMaterial);
  scene.add( this.motionLine );

  this.move = function() {
    canNextVertices = true;
    motionLine = this.motionLine;
    currentEndVertice = routeVertices[this.currentRouteVerticesNum + 1];
    currentStartVertice = routeVertices[this.currentRouteVerticesNum];

    if (motionLine.geometry.vertices[0].x < currentEndVertice[0]){
      motionLine.geometry.vertices[0].x += (currentEndVertice[0] - currentStartVertice[0]) * speed;
      canNextVertices = false;
    }

    if (motionLine.geometry.vertices[0].y < currentEndVertice[1]){
      motionLine.geometry.vertices[0].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
      canNextVertices = false;
    }

    if (motionLine.geometry.vertices[1].x < currentEndVertice[0]){
      motionLine.geometry.vertices[1].x += (currentEndVertice[0] - currentStartVertice[0]) * speed;
      canNextVertices = false;
    }

    if (motionLine.geometry.vertices[1].y < currentEndVertice[1]){
      motionLine.geometry.vertices[1].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
      canNextVertices = false;
    }

    // if (canNextVertices){
      // this.currentRouteVerticesNum += 1;
      // motionLine.geometry.vertices[0].x = routeVertices[this.currentRouteVerticesNum][0];
      // motionLine.geometry.vertices[0].y = routeVertices[this.currentRouteVerticesNum][1];
      // motionLine.geometry.vertices[1].x = routeVertices[this.currentRouteVerticesNum][0] + length;
      // motionLine.geometry.vertices[1].y = routeVertices[this.currentRouteVerticesNum][1] + length;
    // }
    // motionLine.geometry.vertices[0].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
    // motionLine.geometry.vertices[1].x += (currentEndVertice[0] - currentStartVertice[0]) * speed;
    // motionLine.geometry.vertices[1].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
    motionLine.geometry.verticesNeedUpdate = true;
  }

}

var motionLineTest = new MotionLine(0.5, 0.01, [[gridBase, 0 ,-depth+0.1], [gridBase*2, gridBase, -depth+0.1], [gridBase*4, gridBase*3,-depth+0.1], [gridBase*11, gridBase*10,-depth+0.1]]);
console.log(motionLineTest);


function render() {
  motionLineTest.move();
  // motionLine.geometry.vertices[0].x += 0.01;
  // motionLine.geometry.vertices[0].y += 0.01;
  // motionLine.geometry.vertices[1].x += 0.01;
  // motionLine.geometry.vertices[1].y += 0.01;
  // motionLine.geometry.verticesNeedUpdate = true;

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

  // for(var i = 0 ; i < lines.length; i++){
    // lines[i].geometry.vertices[0].x += 0.01;
    // lines[i].geometry.vertices[1].y += 0.01;
    // lines[i].geometry.vertices[2].z += 0.01;
    // lines[i].geometry.verticesNeedUpdate = true;

    // // lines[i].rotation.y += 0.0001;
    // // lines[i].rotation.x += 0.1;
    // //console.log(geometries[i].rotateZ);
  // }
