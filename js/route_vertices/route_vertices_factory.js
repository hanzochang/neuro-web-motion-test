// Generate Points for MotionLines
//
// constructor
//   @param [THREE.Vector3] pivot
//   @param [float] gridBase
//   @param [float] rootVerticesNum
//   @param [rangeUnit] integer
//
function routeVerticesFactory(pivot, gridBase, rootVerticesNum, rangeUnit = 4){
  this.pivot = pivot;
  this.gridBase = gridBase;
  this.rootVerticesNum = rootVerticesNum;
  this.rootVertices = new Array;
  this.rangeUnit = rangeUnit;

  this.maxExpandableAbsoluteValue = gridBase * rangeUnit;

  // public

  // create root vertices params
  //
  // @return [Array<THREE.Vector3>]
  this.create = function(){
    this.createRootVertices(pivot);
    return this.rootVertices;
  }

  this.createUpper = function(){
    this.createRootVerticesUpper(pivot);
    return this.rootVertices;
  }

  // private
  this.createRootVertices = function(startPoint){
    // console.log(startPoint);
    this.rootVertices.push(startPoint);
    if (this.rootVerticesNum < 0) { return; }

    var rand = Math.random();
    var nextStartPoint;
    if (rand < 0.25) {
      nextStartPoint = new THREE.Vector3(this.expandValuePositively(startPoint.x),
                                         this.expandValuePositively(startPoint.y),
                                         startPoint.z);
    } else if (rand < 0.50) {
      nextStartPoint = new THREE.Vector3(this.expandValueNegatively(startPoint.x),
                                         this.expandValuePositively(startPoint.y),
                                         startPoint.z);
    } else if (rand < 0.75) {
      nextStartPoint = new THREE.Vector3(this.expandValuePositively(startPoint.x),
                                         this.expandValueNegatively(startPoint.y),
                                         startPoint.z);
    } else {
      nextStartPoint = new THREE.Vector3(this.expandValueNegatively(startPoint.x),
                                         this.expandValueNegatively(startPoint.y),
                                         startPoint.z);
    }

    // if (nextStartPoint == this.pivot) {
      // this.rootVerticesNum -= 1;
      // this.createRootVertices(StartPoint);
    // } else {
      // this.rootVerticesNum -= 1;
      // this.createRootVertices(nextStartPoint);
    // }

    this.rootVerticesNum -= 1;
    this.createRootVertices(nextStartPoint);
  }

  this.createRootVerticesUpper = function(startPoint){
    // console.log(startPoint);
    this.rootVertices.push(startPoint);
    if (this.rootVerticesNum < 0) { return; }

    // イテレータにする
    var rand = Math.random();
    var nextStartPoint;
    if (rand < 0.2) {
      nextStartPoint = new THREE.Vector3(this.expandValuePositively(startPoint.x),
                                         this.expandValuePositively(startPoint.y),
                                         startPoint.z);
    } else if (rand < 0.4) {
      nextStartPoint = new THREE.Vector3(startPoint.x,
                                         startPoint.y,
                                         this.expandValuePositively(startPoint.z));
    } else if (rand < 0.6) {
      nextStartPoint = new THREE.Vector3(this.expandValueNegatively(startPoint.x),
                                         this.expandValuePositively(startPoint.y),
                                         startPoint.z);
    } else if (rand < 0.8) {
      nextStartPoint = new THREE.Vector3(this.expandValuePositively(startPoint.x),
                                         this.expandValueNegatively(startPoint.y),
                                         startPoint.z);
    } else {
      nextStartPoint = new THREE.Vector3(this.expandValueNegatively(startPoint.x),
                                         this.expandValueNegatively(startPoint.y),
                                         startPoint.z);
    }

    // if (nextStartPoint == this.pivot) {
      // this.rootVerticesNum -= 1;
      // this.createRootVerticesUpper(StartPoint);
    // } else {
      // this.rootVerticesNum -= 1;
      // this.createRootVerticesUpper(nextStartPoint);
    // }

    this.rootVerticesNum -= 1;
    this.createRootVerticesUpper(nextStartPoint);
  }

  this.expandValuePositively = function (value) {
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
