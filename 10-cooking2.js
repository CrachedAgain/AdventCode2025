window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

    let r = await fetch("datafile-cooking.txt");
//    let r = await fetch("testfile-cooking.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).map( e=>e.trim() ).filter( e=>e!=="" );
    elemData.innerText = arrData.join("\r\n");
    let arrResults = [];
    let numTotals = 0;

    let arrFreshIngredientRanges=[];

    let doneRanges = false;
    let reRange = /^([0-9]+)-([0-9]+)$/;

    for (let i of arrData) {
        if ( !doneRanges ){
            let regResult = reRange.exec(i);
            if ( regResult){
                let start = parseInt(regResult[1]);
                let end = parseInt(regResult[2]);
                arrResults.push("Range: "+i);
                arrFreshIngredientRanges.push([start, end]);
            } else {
                doneRanges=true;
            }
        }
    }

    arrFreshIngredientRanges.sort( (a,b)=> {
        if (a[0]===b[0]){
            return a[1]-b[1];
        } else {
            return a[0]-b[0];
        }
    }); 
    arrResults.push("Ranges sorted");
    maximum=arrFreshIngredientRanges[0][0]-1;
    for ( let range of arrFreshIngredientRanges ){
        let numNewIDs = 0;
        arrResults.push("Checking range "+range[0].toString()+"-"+range[1].toString());
        if ( range[0]>maximum){
            numNewIDs += range[1]-range[0];
            if ( range[1]===range[0] ){
                numNewIDs++;
            }
            maximum=range[1];
        } else if ( range[1]>maximum){
            numNewIDs += range[1]-maximum;
            maximum=range[1];
        }
        arrResults.push("New IDs: "+numNewIDs.toString());
        numTotals += numNewIDs;
    }


    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
