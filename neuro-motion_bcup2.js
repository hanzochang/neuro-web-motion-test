var scene, camera, dolly, renderer;
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

function addObjects(){

  material = new THREE.LineBasicMaterial({
    color: 0x666666,
    linewidth: 2
  });
  //material =  new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 10, gapSize: 0.9 } );

  // centerPoints = createGrid(depth, gridBase, 5);
  // createDiamondRect(centerPoints, gridBase, -4);
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

    // createPoints(x+gridBase, y ,overrideDepth ? overrideDepth+0.1 : z+0.1);
  }
}

function createPoints(x, y, z){
  var starsGeometry = new THREE.Geometry();
  var star = new THREE.Vector3();
  star.x = x;
  star.y = y;
  star.z = z;

  starsGeometry.vertices.push( star )
  var starsMaterial = new THREE.PointsMaterial( { color: 0xcccccc, size: 1 } )
  var starField = new THREE.Points( starsGeometry, starsMaterial );
  scene.add( starField );

  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(
    // new THREE.Vector3( star.x, star.y, star.z - (Math.random() * Math.random()*4)),
    // new THREE.Vector3( star.x, star.y, star.z + (Math.random() * Math.random()*4))
  // );
  // line = new THREE.Line( geometry, material );
  // scene.add( line );
  // lines.push(line);
}

function createGrid(depth, gridBase, gridGenPhase){
  var depth = -depth;
  var rectCenters = new Array;

  for(var phase = 1; phase <= gridGenPhase ; phase++){
    var maxX = phase * gridBase - gridBase;
    var maxY = phase * gridBase - gridBase;
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

function MotionLine(length, speed, routeVertices){
  this.length = length;
  this.speed = speed;
  this.routeVertices = routeVertices;
  this.currentRouteVerticesNum = 0;

  var motionLineMaterial = new THREE.LineBasicMaterial({
    color: 0x999999,
    linewidth: 1
  });

  var motionLineGeometry = new THREE.Geometry();
  var startVertice = this.routeVertices[0];
  motionLineGeometry.vertices.push(
    new THREE.Vector3(startVertice[0], startVertice[1], startVertice[2]),
    new THREE.Vector3(startVertice[0], startVertice[1], startVertice[2])
  );
  this.motionLine = new THREE.Line(motionLineGeometry, motionLineMaterial);
  scene.add( this.motionLine );

  this.move = function() {
    canNextVertices = true;
    motionLine = this.motionLine;
    if (this.currentRouteVerticesNum < routeVertices.length ) {
      currentEndVertice = routeVertices[this.currentRouteVerticesNum + 1];
      currentStartVertice = routeVertices[this.currentRouteVerticesNum];

      if (this.isReachEndVerticeX(currentStartVertice, currentEndVertice, motionLine.geometry.vertices[0])){
        motionLine.geometry.vertices[0].x += (currentEndVertice[0] - currentStartVertice[0]) * speed;
        canNextVertices = false;
      }

      if (this.isReachEndVerticeY(currentStartVertice, currentEndVertice, motionLine.geometry.vertices[0])){
        motionLine.geometry.vertices[0].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
        canNextVertices = false;
      }

      if (this.isReachEndVerticeX(currentStartVertice, currentEndVertice, motionLine.geometry.vertices[1])){
        motionLine.geometry.vertices[1].x += (currentEndVertice[0] - currentStartVertice[0]) * speed;
        canNextVertices = false;
      }

      if (this.isReachEndVerticeY(currentStartVertice, currentEndVertice, motionLine.geometry.vertices[1])){
        motionLine.geometry.vertices[1].y += (currentEndVertice[1] - currentStartVertice[1]) * speed;
        canNextVertices = false;
      }

      if (canNextVertices){
        this.currentRouteVerticesNum += 1;
        currentEndVertice = routeVertices[this.currentRouteVerticesNum + 1];
        currentStartVertice = routeVertices[this.currentRouteVerticesNum];

        motionLine.geometry.vertices[0].x = routeVertices[this.currentRouteVerticesNum][0];
        motionLine.geometry.vertices[0].y = routeVertices[this.currentRouteVerticesNum][1];

        var addLengthX = (currentEndVertice[0] - currentStartVertice[0] >= 0) ? length : -length;
        var addLengthY = (currentEndVertice[1] - currentStartVertice[1] >= 0) ? length : -length;
        motionLine.geometry.vertices[1].x = routeVertices[this.currentRouteVerticesNum][0] + addLengthX;
        motionLine.geometry.vertices[1].y = routeVertices[this.currentRouteVerticesNum][1] + addLengthY;
      }
      motionLine.geometry.verticesNeedUpdate = true;
    }
  }

  this.isReachEndVerticeX = function(startVertice, endVertice, currentVertice) {
    var comparePositiveness = ((endVertice[0] - startVertice[0]) >= 0);

    if (comparePositiveness) {
      if (currentVertice.x < currentEndVertice[0]){ return true; }
    } else {
      if (currentVertice.x > currentEndVertice[0]){ return true; }
    }

    return false;
  }

  this.isReachEndVerticeY = function(startVertice, endVertice, currentVertice) {
    var comparePositiveness = ((endVertice[1] - startVertice[1]) >= 0);

    if (comparePositiveness) {
      if (currentVertice.y < currentEndVertice[1]){ return true; }
    } else {
      if (currentVertice.y > currentEndVertice[1]){ return true; }
    }

    return false;
  }

}

function motionLineFactory(gridBase, speed, depth, rangeUnit = 4){
  this.gridBase = gridBase;
  this.speed = speed;
  this.depth = depth;
  this.rootVertices = new Array;
  this.rootVerticesNum = 500;
  this.rangeUnit = rangeUnit;
  this.maxExpandableAbsoluteValue = gridBase * rangeUnit;
  console.log(this.maxExpandableAbsoluteValue);

  this.create = function(){
    this.createRootVertices([0, 0, depth]);
  }

  this.createRootVertices = function(startPoint = [this.gridBase, this.gridBase, depth]){
    this.rootVertices.push(startPoint);
    if (this.rootVerticesNum < 0) { return; }

    var rand = Math.random();
    var nextStartPoint;
    if (rand < 0.25) {
      nextStartPoint = [this.expandValuePositively(startPoint[0]), this.expandValuePositively(startPoint[1]), startPoint[2]];
    } else if (rand < 0.50) {
      nextStartPoint = [this.expandValueNegatively(startPoint[0]), this.expandValuePositively(startPoint[1]), startPoint[2]];
    } else if (rand < 0.75) {
      nextStartPoint = [this.expandValuePositively(startPoint[0]), this.expandValueNegatively(startPoint[1]), startPoint[2]];
    } else {
      nextStartPoint = [this.expandValueNegatively(startPoint[0]), this.expandValueNegatively(startPoint[1]), startPoint[2]];
    }

    this.rootVerticesNum -= 1;
    this.createRootVertices(nextStartPoint);
  }

  this.expandValuePositively = function (value) {
    // console.log((value + this.gridBase) >= this.maxExpandableAbsoluteValue);
    if ((value + this.gridBase) > this.maxExpandableAbsoluteValue) {
      return value - (this.gridBase);
    } else {
      return value + (this.gridBase);
    }
  }

  this.expandValueNegatively = function (value) {
    if ((value - this.gridBase) <  -(this.maxExpandableAbsoluteValue)) {
      return value + (this.gridBase);
    } else {
      return value - (this.gridBase);
    }
  }

}

var motionLines = new Array;
for (var i = 0; i < 300; i++){
  mlf = new motionLineFactory(gridBase, 0.01, -8, 6);
  mlf.create();
  // console.log(mlf.rootVertices);
  rand1 = Math.random();
  rand2 = Math.random();
  var motionLineTest = new MotionLine(1.2, 0.01*rand2, mlf.rootVertices);
  motionLines.push(motionLineTest);
}

for (var i = 0; i < 100; i++){
  mlf = new motionLineFactory(gridBase*2, 0.01, -4, 4);
  mlf.create();
  rand1 = Math.random();
  rand2 = Math.random();
  var motionLineTest = new MotionLine(gridBase*1.5, 0.005*rand2, mlf.rootVertices);
  motionLines.push(motionLineTest);
}

// for (var j = 0; j < 10; j++){
  // for (var i = 0; i < 10; i++){
    // mlf = new motionLineFactory(gridBase, 0.01, 5-j, 4);
    // mlf.create();
    // rand1 = Math.random();
    // rand2 = Math.random();
    // var motionLineTest = new MotionLine(1.0, 0.01*rand2, mlf.rootVertices);
    // motionLines.push(motionLineTest);
  // }
// }


function render() {
  for(var i = 0; i < motionLines.length; i++){
    motionLines[i].move();
  }

  dolly.position.z -= 0.0025;
  requestAnimationFrame(render);

  // VR対応は下記をやる
  controls.update();
  // effect.render(scene, camera);
  manager.render(scene, camera);
}
render();

function onResize(e) {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

