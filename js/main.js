// var mL = new Array;
// for (var i = 0; i < 10; i++){
  // mlf = new motionLineFactory(gridBase, 0.01, -7, 10);
  // mlf.create();
  // // console.log(mlf.rootVertices);
  // rand1 = Math.random();
  // rand2 = Math.random();
  // var motionLineTest = new MotionLine(1.2, 0.05*rand2, mlf.rootVertices);
  // mL.push(motionLineTest);
// }

// for (var i = 0; i < 100; i++){
  // mlf = new motionLineFactory(gridBase*2, 0.01, -4, 20);
  // mlf.create();
  // rand1 = Math.random();
  // rand2 = Math.random();
  // var motionLineTest = new MotionLine(gridBase*1.5, 0.005*rand2, mlf.rootVertices);
  // mL.push(motionLineTest);
// }

// for (var j = 0; j < 10; j++){
  // for (var i = 0; i < 10; i++){
    // mlf = new motionLineFactory(gridBase, 0.01, 5-j, 20);
    // mlf.create();
    // rand1 = Math.random();
    // rand2 = Math.random();
    // var motionLineTest = new MotionLine(1.0, 0.01*rand2, mlf.rootVertices);
    // mL.push(motionLineTest);
  // }
// }


var test = new Array;
for(var i=0; i < 10 ; i++) {
  var rand = Math.random();
  var pivot = new THREE.Vector3(0, 0, -8);
  var routeVertices = new routeVerticesFactory(pivot, gridBase/2, 1000, 100).create();
  var motionLines = new MotionLines(gridBase, gridBase*20, 0.01, routeVertices);
  test.push(motionLines);
}

for(var i=0; i < 10 ; i++) {
  var rand = Math.random();
  var pivot = new THREE.Vector3(0, 0, -8+(4*i));
  var routeVertices = new routeVerticesFactory(pivot, gridBase, 1000, 2).create();
  var motionLines = new MotionLines(gridBase, gridBase*10, 0.5, routeVertices);
  test.push(motionLines);
}

// for(var i=0; i < 10 ; i++) {
  // var rand = Math.random();
  // var pivot = new THREE.Vector3(1, 1, i);
  // var routeVertices = new routeVerticesFactory(pivot, gridBase, 1000, 2).createUpper();
  // var motionLines = new MotionLines(gridBase, gridBase*1, 0.5*rand, routeVertices);
  // test.push(motionLines);
// }

// for(var i=0; i < 100 ; i++) {
  // var rand = Math.random();
  // var pivot = new THREE.Vector3(1, 0, -30+(i));
  // var routeVertices = new routeVerticesFactory(pivot, gridBase*rand, 1000, 10).createUpper();
  // var motionLines = new MotionLines(gridBase, gridBase*10, 0.05*rand, routeVertices);
  // test.push(motionLines);
// }

// for(var i=0; i < 8 ; i++) {
  // var rand = Math.random();
  // var pivot = new THREE.Vector3(-1, 0, -8+(i));
  // var routeVertices = new routeVerticesFactory(pivot, gridBase, 1000, 10).createUpper();
  // var motionLines = new MotionLines(gridBase, gridBase*20, 0.25*rand, routeVertices);
  // test.push(motionLines);
// }

for(var i=0; i < 8 ; i++) {
  var rand = Math.random();
  var pivot = new THREE.Vector3(0, 0, -8+(i));
  var routeVertices = new routeVerticesFactory(pivot, gridBase, 1000, 10).createUpper();
  var motionLines = new MotionLines(gridBase, gridBase*30, 0.25*rand, routeVertices);
  test.push(motionLines);
}

function render() {
  for(var i = 0; i < test.length; i++){
    test[i].tick();
  }
  // for(var i = 0; i < mL.length; i++){
    // mL[i].move();
  // }

  dolly.position.z -= 0.0025;
  requestAnimationFrame(render);

  // VR対応は下記をやる
  controls.update();
  // effect.render(scene, camera);
  manager.render(scene, camera);
}
render();
