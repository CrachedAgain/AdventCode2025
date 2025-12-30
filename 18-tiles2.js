// @ts-check
"use strict";
window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

    if ( !elemData ||
        !elemResults ||
        !elemSumIDs
    ){
        throw "OOPS";
    }

    /** 
     * @typedef {number} xAxis 
     * @typedef {number} yAxis
    */
    class Point{
        /**
         * @param {xAxis} x
         * @param {yAxis} y
         */
        constructor(x,y){
            /** @type {xAxis} */
            this.x = x;
            /** @type {yAxis} */
            this.y = y;
        }
        /** @returns {string} */
        get stringValue(){
            return this.x.toString()+","+this.y.toString();
        }
    }
    const UP=0, DOWN=1, LEFT=2, RIGHT=3;
    class HLine {
        /**
         * @param {xAxis} x1
         * @param {xAxis} x2
         * @param {yAxis} y
         * @param {(UP|DOWN)} inside
         * 
         */
        constructor(x1,x2,y,inside){
            /** @type {xAxis} */
            this.xLeft = Math.min(x1,x2);
            /** @type {xAxis} */
            this.xRight = Math.max(x1,x2);
            /** @type {yAxis} */
            this.y = y;
            /** @type {(UP|DOWN)} */
            this.inside = inside;
        }

        isTopLine() {
            return this.inside === DOWN;
        }
        /** 
         * @param {Point} p1
         * @param {Point} p2
         */
        overlaps(p1, p2 ){
            if ( p1.x !== p2.x && p1.y !== p2.y){
                throw "Non vertical/horizontal line";
            }
            if ( p1.x === p2.x ){
                return (
                    p1.x > this.xLeft &&
                    p1.x < this.xRight &&
                    Math.min( p1.y, p2.y) < this.y &&
                    Math.max( p1.y, p2.y) > this.y
                )
            }
            if ( Math.abs(this.y - p1.y) < 2 &&
                 Math.min(p1.x, p2.x) < this.xRight &&
                 Math.max(p1.x, p2.x) > this.xLeft){
                    return true;
            }
        }

        /**
         * @retuns {Point}
         */
        get p1(){
            return new Point(this.xLeft,this.y);
        }

        /**
         * @retuns {Point}
         */
        get p2(){
            return new Point(this.xRight,this.y);
        }
    }
    class VLine{
        /**
         * @param {xAxis} x
         * @param {yAxis} y1
         * @param {yAxis} y2
         * @param {(LEFT|RIGHT)} inside
         * 
         */
        constructor(x,y1,y2,inside){
            /** @type {xAxis} */
            this.x = x;
            /** @type {yAxis} */
            this.yBottom = Math.min(y1,y2);
            /** @type {yAxis} */
            this.yTop = Math.max(y1,y2);
            /** @type {(LEFT|RIGHT)} */
            this.inside = inside;
        }

        isRightLine() {
            return this.inside === LEFT;
        }
        /** 
         * @param {Point} p1
         * @param {Point} p2
         */
        overlaps(p1, p2 ){
            if ( p1.x !== p2.x && p1.y !== p2.y){
                throw "Non vertical/horizontal line";
            }
            if ( p1.y === p2.y ){
                return (
                    p1.y > this.yBottom &&
                    p1.y < this.yTop &&
                    Math.min( p1.x, p2.x) < this.x &&
                    Math.max( p1.x, p2.x) > this.x
                )
            }
            if ( Math.abs(this.x - p1.x) < 2 &&
                 Math.min(p1.y, p2.y) < this.yTop &&
                 Math.max(p1.y, p2.y) > this.yBottom){
                    return true;
            }
        }

        /**
         * @retuns {Point}
         */
        get p1(){
            return new Point(this.x,this.yBottom);
        }

        /**
         * @retuns {Point}
         */
        get p2(){
            return new Point(this.x,this.yTop);
        }

    }

    /**
     * @var {boolean} testing
     * @var {(Response|undefined)} r
     */

    let testing=true;
    let r;
    if (testing){
        r = await fetch("testfile-tiles.txt");
    } else {
        r = await fetch("datafile-tiles.txt");
    }
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).filter( e=>e.trim()!=="" ).map( (e)=> {
        let p =e.split(","); 
        return new Point( parseInt(p[0],10), parseInt(p[1],10));
    });
    elemData.innerText = arrData.map( e => e.stringValue).join("\r\n");

    let numTotals = 0;
    /** @type {string[]} */
    let arrResults = [];

    /** @type {HLine[]} */
    let arrTop = [];
    /** @type {HLine[]} */
    let arrBottom = [];
    /** @type {VLine[]} */
    let arrLeft = [];
    /** @type {VLine[]} */
    let arrRight = [];

    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     * @returns 
     */
    function getSize(p1, p2){
        return Math.abs(p1.x-p2.x+1) * Math.abs(p1.y-p2.y+1);
    }

    let topIndex = 0;
    arrData.forEach( (element,index)=>{
        if ( element.y > arrData[topIndex].y){
            topIndex = index;
        }
    });
    arrData = arrData.slice(topIndex).concat( arrData.slice(0,topIndex) );

    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2
     * @returns {(UP|DOWN|LEFT|RIGHT)}
     */
    function getDirection( p1, p2){
        if ( p1.x === p2.x && p1.y === p2.y){
            throw "OOPS, single point"
        }
        if ( p1.x === p2.x){
            if ( p1.y < p2.y){
                return UP;
            } else {
                return DOWN;
            }
        }
        if ( p1.y === p2.y){
            if ( p1.x < p2.x){
                return RIGHT;
            } else {
                return LEFT;
            }
        }
        throw "Non horizontal/vertical line."
    }

    /**
     * 
     * @param {(UP|DOWN|LEFT|RIGHT)} oldInside 
     * @param {(UP|DOWN|LEFT|RIGHT)} oldDirection 
     * @param {(UP|DOWN|LEFT|RIGHT)} newDirection 
     * @returns {(UP|DOWN|LEFT|RIGHT)}
     */
    function getNewInside( oldInside, oldDirection, newDirection){
        switch (newDirection){
            case UP:
                if ( (oldDirection === RIGHT && oldInside === UP)||
                     (oldDirection === LEFT && oldInside === DOWN)){
                    return LEFT;
                }
                if ( (oldDirection === LEFT && oldInside === UP) ||
                     (oldDirection === RIGHT && oldInside === DOWN)){
                    return RIGHT;
                }
                throw "Bad old direction/inside";
            case DOWN:
                if ( (oldDirection === RIGHT && oldInside === UP)||
                     (oldDirection === LEFT && oldInside === DOWN)){
                    return RIGHT;
                }
                if ( (oldDirection === LEFT && oldInside === UP) ||
                     (oldDirection === RIGHT && oldInside === DOWN)){
                    return LEFT;
                }
                throw "Bad old direction/inside";
            case LEFT:
                if ( (oldDirection === UP && oldInside === LEFT) ||
                     (oldDirection === DOWN && oldInside === RIGHT)){
                    return DOWN;
                }
                if ( (oldDirection === UP && oldInside === RIGHT) ||
                     (oldDirection === DOWN && oldInside === LEFT)){
                    return UP;
                }
                throw "Bad old direction/inside";
            case RIGHT:
                if ( (oldDirection === UP && oldInside === LEFT) ||
                     (oldDirection === DOWN && oldInside === RIGHT)){
                    return UP;
                }
                if ( (oldDirection === UP && oldInside === RIGHT) ||
                     (oldDirection === DOWN && oldInside === LEFT)){
                    return DOWN;
                }
                throw "Bad old direction/inside";
            default:
                throw "Bad direction";
        }
    }
    // now first two points are horizontal, with inside down
    /** @type {(UP|DOWN|LEFT|RIGHT)} */
    let oldInside;
    /** @type {(UP|DOWN|LEFT|RIGHT)} */
    let oldDirection=UP;
    let arrTempData = [];
    for ( let loop = 0; loop < arrData.length; loop++){
        let p1 = arrData[loop];
        let p2 = arrData[(loop + 1) % arrData.length];
        let line;
        if ( oldInside === undefined){
            oldInside = p2.x > p1.x? RIGHT : LEFT;
        }
        /** @type {(UP|DOWN|LEFT|RIGHT)} */
        let newDirection = getDirection(p1,p2);
        /** @type {(UP|DOWN|LEFT|RIGHT)} */
        let newInside = getNewInside(oldInside, oldDirection, newDirection );
        if ( p1.x === p2.x) {
            if ( newInside === UP || newInside === DOWN){
                throw "Bad inside value";
            }
            line = new VLine(p1.x, p1.y, p2.y, newInside);
            if ( newInside == LEFT){
                arrRight.push(line);
            } else {
                arrLeft.push(line);
            }
        }
        if ( p1.y === p2.y){
            if ( newInside === LEFT || newInside === RIGHT){
                throw "Bad inside value.";
            }
            line = new HLine(p1.x, p2.x, p1.y, newInside);
            if ( newInside === UP){
                arrBottom.push(line);
            } else {
                arrTop.push(line);
            }
        }
        if ( line === undefined){
            throw "Bad line data";
        }
        arrTempData.push(line);
    }
    arrResults.push("No values yet");
//    numTotals = maxSize;

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
