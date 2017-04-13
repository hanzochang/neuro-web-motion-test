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
