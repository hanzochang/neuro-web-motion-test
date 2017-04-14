addObjects();
function addObjects(){

  material = new THREE.LineBasicMaterial({
    color: 0x666666,
    linewidth: 2
  });
  //material =  new THREE.LineDashedMaterial( { color: 0xffffff, dashSize: 10, gapSize: 0.9 } );

  centerPoints = createGrid(depth, gridBase, 20);
  createDiamondRect(centerPoints, gridBase, -4);
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

    createPoints(x+gridBase, y ,overrideDepth ? overrideDepth+0.1 : z+0.1);
  }
}

function createPoints(x, y, z){
  var starsGeometry = new THREE.Geometry();
  var star = new THREE.Vector3();
  star.x = x;
  star.y = y;
  star.z = z;

  starsGeometry.vertices.push( star )
  var starsMaterial = new THREE.PointsMaterial( { color: 0xcccccc, size: 0.05 } )
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
