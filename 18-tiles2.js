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
        return e.split(",").map(e => parseInt(e,10));
    });
    elemData.innerText = arrData.map( e => e.join(",")).join("\r\n");

    class Point{
        /**
         * @param {number} x
         * @param {number} y
         */
        constructor(x,y){
            /**@type {number} */
            this.x = x;
            /**@type {number} */
            this.y = y;
        }
    }
    const UP=0, DOWN=1, LEFT=2, RIGHT=3;
    class HLine {
        /**
         * @param {number} x1
         * @param {number} x2
         * @param {number} y
         * @param {(UP|DOWN)} inside
         * 
         */
        constructor(x1,x2,y,inside){
            /** @type {number} */
            this.x1 = Math.min(x1,x2);
            /** @type {number} */
            this.x2 = Math.max(x1,x2);
            /** @type {number} */
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
                throw "Non aligned line";
            }
            if ( p1.x === p2.x ){
                return (
                    p1.x >
                    Math.min( p1.y, p2.y) < this.y &&
                    Math.max( p1.y, p2.y) > this.y
                )
            }

        }
    }
    let arrResults = [];
    let numTotals = 0;

    function getSize(p1, p2){
        return Math.abs(p1[0]-p2[0]+1) * Math.abs(p1[1]-p2[1]+1);
    }

    let maxSize = undefined;
    let start = undefined;
    let end = undefined;
    for ( let numP1Row = 0; numP1Row < arrData.length; numP1Row++){
        let p1 = arrData[numP1Row];
        for ( let numP2Row = numP1Row+1; numP2Row < arrData.length; numP2Row++){
            let p2 = arrData[numP2Row];
            if ( !maxSize || 
                getSize(p1,p2)>maxSize){
                maxSize = getSize(p1,p2);
                start = numP1Row;
                end = numP2Row;
            }
        }
    }
    arrResults.push("Largest square: "+ arrData[start].join(",")+" with "+arrData[end].join(",")+" Size: "+ maxSize.toString());
    numTotals = maxSize;

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
