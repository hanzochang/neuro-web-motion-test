function MotionLine(length, speed, routeVertices){
  this.length = length;
  this.speed = speed;
  this.routeVertices = routeVertices;
  this.currentRouteVerticesNum = 0;

  var motionLineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1
  });

  var motionLineGeometry = new THREE.Geometry();
  var startVertice = this.routeVertices[0];
  // ここてVerticeの数を特定
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
