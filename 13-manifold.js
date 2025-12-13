window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

    let r = await fetch("datafile-manifold.txt");
//    let r = await fetch("testfile-manifold.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).filter( e=>e.trim()!=="" ).map( e=> e.split(""));
    elemData.innerText = arrData.map( e => e.join("")).join("\r\n");

    let arrResults = [];
    let numTotals = 0;

    let arrBeams = new Array( arrData[0].length ).fill(0);
    for (let row of arrData ){
        let newArrBeams = new Array( arrData[0].length ).fill(0);
        let numSplits = 0;
        for (let colIndex = 0 ; colIndex < arrBeams.length ; colIndex++){
            switch ( row[colIndex]){
                case ".":
                    if ( arrBeams[colIndex] ){
                        newArrBeams[colIndex] = 1;
                        row[colIndex]="|";
                    }
                break;

                case "S":
                    newArrBeams[colIndex]=1;
                break;

                case "^":
                    if ( arrBeams[colIndex]){
                        numSplits++;
                        newArrBeams[colIndex]=0;
                        if ( colIndex > 0 && row[colIndex-1]==="."){
                            newArrBeams[colIndex-1]=1;
                            row[colIndex-1]="|";
                        }
                        if ( colIndex < arrBeams.length-1 && row[colIndex+1]==="."){
                            newArrBeams[colIndex+1]=1;
                            row[colIndex+1]="|";
                        }
                    }
                break;
            }
        }    
        arrResults.push("Tree: "+ row.join("")+" Splits = "+numSplits.toString());
        numTotals += numSplits;
        arrBeams = newArrBeams;
    }

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
