// MotionLines Object
//
// constructor
//   @param [float] gridBase
//   @param [float] lenth
//   @param [float] speed
//   @param [Array<THREE.Vector3>] routeVertices
//   @param [String] moveType
//
function MotionLines(gridBase, length, speed, routeVertices, moveType = 'chain'){
  // constructor
  this.gridBase = gridBase;
  this.length = length;
  this.speed = speed;
  this.routeVertices = routeVertices;

  this.counter = 0;
  this.currentMotionLineUnitNum = 0;
  this.motionLineUnits = new Array;
  this.tailMotionLineNum = 0;
  this.motionLineUnitNum = Math.ceil(this.length / this.gridBase);

  this.tick = function() {
    currentNum = this.currentMotionLineUnitNum;

    // 生成処理
    if ((this.currentMotionLineUnitNum == 0) || (((this.counter * this.speed) / (this.gridBase * currentNum)) > 1)) {
      var motionLineUnit = new MotionLineUnit(routeVertices[currentNum], routeVertices[currentNum + 1], this.speed);

      this.motionLineUnits.push(motionLineUnit);
      this.currentMotionLineUnitNum += 1;
    }

    // reduce or expand
    if (((this.counter * this.speed) / (this.gridBase * (this.motionLineUnitNum + this.tailMotionLineNum + 1))) >= 1) {
      this.motionLineUnits[this.tailMotionLineNum].reduce();
      // console.log(this.motionLineUnits[this.tailMotionLineNum].isReducingEnd());
        // this.motionLineUnits[this.tailMotionLineNum].destruct();
        // this.motionLineUnits[this.tailMotionLineNum] = null;
        // this.tailMotionLineNum += 1;
      if ( this.motionLineUnits[this.tailMotionLineNum].isReducingEnd() ) {
        this.motionLineUnits[this.tailMotionLineNum].destruct();
        this.motionLineUnits[this.tailMotionLineNum] = null;
        this.tailMotionLineNum += 1;
      }
      this.motionLineUnits[this.motionLineUnits.length - 1].expand();
      // 消しきったかを確認
    } else {
      // console.log('expand!');
      // console.log(this.motionLineUnits.length);
      this.motionLineUnits[this.motionLineUnits.length - 1].expand();
    }
 
    this.counter += 1;
  }
}


// MotionLineUnit Object
//
// @param [THREE.Vector3] startPoint
// @param [THREE.Vector3] endPoint
// @param [float] speed
//
function MotionLineUnit(startPoint, endPoint, speed){
  // construction
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.speed = speed;
  this.currentStartPoint = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
  this.currentEndPoint = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);

  var geometry = new THREE.Geometry();
  geometry.vertices.push(this.currentStartPoint, this.currentEndPoint);
  var material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
  this.line = new THREE.Line(geometry, material);

  scene.add( this.line );

  this.destruct = function () {
    this.startPoint = null;
    this.endPoint = null;
    this.currentStartPoint = null;
    this.currentEndPoint = null;
    geometry = null;
    material = null;
    scene.remove( this.line );
    this.line.geometry.verticesNeedUpdate = true;
    this.line = null;
  }

  // public
  this.expand = function() {
    this.currentEndPoint.add(this.addablePoint());

    if (this.isExceedEndPointX(this.currentEndPoint)) {
      this.currentEndPoint.x = this.endPoint.x; 
    }

    if (this.isExceedEndPointY(this.currentEndPoint)) {
      this.currentEndPoint.y = this.endPoint.y;
    }

    if (this.isExceedEndPointZ(this.currentEndPoint)) {
      this.currentEndPoint.z = this.endPoint.z;
    }

    this.line.geometry.verticesNeedUpdate = true;
  }

  this.reduce = function() {
    this.currentStartPoint.add(this.addablePoint());

    if (this.isExceedEndPointX(this.currentStartPoint)) {
      this.currentStartPoint.x = this.endPoint.x; 
    }

    if (this.isExceedEndPointY(this.currentStartPoint)) {
      this.currentStartPoint.y = this.endPoint.y;
    }

    if (this.isExceedEndPointZ(this.currentStartPoint)) {
      this.currentStartPoint.z = this.endPoint.z;
    }

    this.line.geometry.verticesNeedUpdate = true;
  }

  this.isReducingEnd = function() {
    var xIsEnd = (this.currentStartPoint.x == this.endPoint.x);
    var yIsEnd = (this.currentStartPoint.y == this.endPoint.y);
    var zIsEnd = (this.currentStartPoint.z == this.endPoint.z);
    return xIsEnd && yIsEnd && zIsEnd;
  }

  // private

  this.isExceedEndPointX = function(currentPoint) {
    if(this.directionPositivenessX()){
      return currentPoint.x > this.endPoint.x;
    } else {
      return currentPoint.x < this.endPoint.x;
    }
  }

  this.isExceedEndPointY = function(currentPoint) {
    if(this.directionPositivenessY()){
      return currentPoint.y > this.endPoint.y;
    } else {
      return currentPoint.y < this.endPoint.y;
    }
  }

  this.isExceedEndPointZ = function(currentPoint) {
    if(this.directionPositivenessZ()){
      return currentPoint.z > this.endPoint.z;
    } else {
      return currentPoint.z < this.endPoint.z;
    }
  }

  this.directionPositivenessX = function(){
    return ((this.endPoint.x - this.startPoint.x) >= 0);
  }

  this.directionPositivenessY = function(){
    return ((this.endPoint.y - this.startPoint.y) >= 0);
  }

  this.directionPositivenessZ = function(){
    return ((this.endPoint.z - this.startPoint.z) >= 0);
  }

  this.addablePoint = function(){
    var addableX = this.directionPositivenessX() ? this.speed : -(this.speed);
    var addableY = this.directionPositivenessY() ? this.speed : -(this.speed);
    var addableZ = this.directionPositivenessZ() ? this.speed : -(this.speed);
    return new THREE.Vector3(addableX, addableY, addableZ);
  }
}
