window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-junctions.txt");
    let r = await fetch("testfile-junctions.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).filter( e=>e.trim()!=="" ).map( e=> [e.split(",").map(e => parseInt(e,10))]);
    elemData.innerText = arrData.map( e => e[0].join(",")).join("\r\n");

    let arrResults = [];
    let numTotals = 0;

    function getDistance(p1, p2){
        return Math.sqrt( (p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 + (p1[2]-p2[2])**2)
    }

    const maxConnections = 10;
    for (let connections = 0 ; connections < maxConnections ; connections++){
        let minDistance = undefined;
        let start = undefined;
        let end = undefined;
        for ( let numP1Row = 0; numP1Row < arrData.length; numP1Row++){
            for ( let numP1Elem = 0; numP1Elem < arrData[numP1Row].length; numP1Elem++){
                let p1 = arrData[numP1Row][numP1Elem];
                for ( let numP2Row = numP1Row+1; numP2Row < arrData.length; numP2Row++){
                    for ( let numP2Elem = 0; numP2Elem < arrData[numP2Row].length; numP2Elem++){
                        let p2 = arrData[numP2Row][numP2Elem];
                        if ( !minDistance || getDistance(p1,p2)<minDistance){
                            minDistance = getDistance(p1,p2);
                            start = [numP1Row,numP1Elem];
                            end = [numP2Row,numP2Elem];
                        }
                    }
                }
            }
        }
        arrResults.push("Connected: "+ arrData[start[0]][start[1]].join(",")+" with "+arrData[end[0]][end[1]]+" Distance: "+ minDistance.toString());
        arrData[start[0]] = arrData[start[0]].concat( arrData[end[0]] );
        arrData = arrData.slice(0,end).concat( arrData.slice(end+1,arrData.length));
    }
    arrData.sort( (a,b)=> b.length-a.length );
    for (let  circuit of arrData){
        arrResults.push( circuit.map( p => p.join(",") ).join(" , "));
    }
    numTotals = arrData[0].length*arrData[1].length*arrData[2].length;

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
