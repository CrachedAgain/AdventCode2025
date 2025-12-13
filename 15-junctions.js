window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-junctions.txt");
    let r = await fetch("testfile-junctions.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).filter( e=>e.trim()!=="" ).map( (e)=> {
        let p1 =  {
            point: e.split(",").map(e => parseInt(e,10)),
            conn: [],
            circuit: [],
        };
        p1.circuit.push(p1);
        return p1;
    });
    elemData.innerText = arrData.map( e => e.point.join(",")).join("\r\n");

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
            let p1 = arrData[numP1Row];
            for ( let numP2Row = numP1Row+1; numP2Row < arrData.length; numP2Row++){
                let p2 = arrData[numP2Row];
                if ( !p1.conn.includes(p2) &&
                    (!minDistance || 
                    getDistance(p1.point,p2.point)<minDistance)){
                    minDistance = getDistance(p1.point,p2.point);
                    start = numP1Row;
                    end = numP2Row;
                }
            }
        }
        arrResults.push("Connected: "+ arrData[start].point.join(",")+" with "+arrData[end].point+" Distance: "+ minDistance.toString());
        arrData[start].conn.push( arrData[end] );
        for ( let p of arrData[end].circuit){
            if ( !arrData[start].circuit.includes(p)){
                arrData[start].circuit.push(p);
                p.circuit=arrData[start].circuit;
            }
        }
    }
    let circuits = [];
    for ( let point of arrData){
        if (! circuits.includes(point.circuit)){
            circuits.push(point.circuit);
        }
    }
    circuits.sort( (a,b)=> b.length-a.length );
    for (let  circuit of circuits){
        arrResults.push( circuit.map( p => p.point.join(",") ).join(" , "));
    }
    numTotals = circuits[0].length*circuits[1].length*circuits[2].length;

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
