window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

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

    let arrResults = [];
    let numTotals = 0;

    function getSize(p1, p2){
        return Math.abs(p1[0]-p2[0]+1) + Math.abs(p1[1]-p2[1]+1);
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
                maxSize = getSize(p1.point,p2.point);
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
