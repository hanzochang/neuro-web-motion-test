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
    // console.log(this.motionLineUnitNum);
    // console.log(((this.counter * this.speed) / (this.gridBase * this.motionLineUnitNum)));
    if (((this.counter * this.speed) / (this.gridBase * this.motionLineUnitNum)) >= 1) {
      this.motionLineUnits[0].reduce();
      // 消しきったかを確認
    } else {
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

  // public
  this.expand = function() {
    this.currentEndPoint.add(this.addablePoint());
    if (this.isExceedEndPointX()) { this.currentEndPoint.x = this.endPoint.x; }
    if (this.isExceedEndPointY()) { this.currentEndPoint.y = this.endPoint.y; }
    if (this.isExceedEndPointZ()) { this.currentEndPoint.z = this.endPoint.z; }
    this.line.geometry.verticesNeedUpdate = true;
  }

  this.reduce = function() {
    this.currentStartPoint.add(this.addablePoint());
    this.line.geometry.verticesNeedUpdate = true;
  }


  // private

  this.isExceedEndPointX = function() {
    if(this.directionPositivenessX()){
      return this.currentEndPoint.x > this.endPoint.x;
    } else {
      return this.currentEndPoint.x < this.endPoint.x;
    }
  }

  this.isExceedEndPointY = function() {
    if(this.directionPositivenessY()){
      return this.currentEndPoint.y > this.endPoint.y;
    } else {
      return this.currentEndPoint.y < this.endPoint.y;
    }
  }

  this.isExceedEndPointZ = function() {
    if(this.directionPositivenessZ()){
      return this.currentEndPoint.z > this.endPoint.z;
    } else {
      return this.currentEndPoint.z < this.endPoint.z;
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
