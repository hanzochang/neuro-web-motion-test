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
