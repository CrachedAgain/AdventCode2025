window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-ooking.txt");
    let r = await fetch("testfile-cooking.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).map( e=>e.trim() ).filter( e=>e!=="" );
    elemData.innerText = arrData.join("\r\n");
    let arrResults = [];
    let numTotals = 0;

    let arrFreshIngredientRanges=[];
    let arrIngredients=[];

    let doneRanges = false;
    let reRange = /^([0-9]+)-([0-9]+)$/;
    let reIngredient = /^([0-9]+)$/;
    for (let i of arrData) {
        if ( !doneRanges ){
            let regResult = reRange.exec(i);
            if ( regResult){
                arrFreshIngredientRanges.push([parseInt(regResult[1]), parseInt(regResult[2])]);
                arrResults.push("Range: "+i);
            } else {
                doneRanges=true;
            }
        }
        if (doneRanges){
            let regResult = reIngredient.exec(i);
            if ( regResult ){
                let numIngredient = parseInt(regResult[1]);
                arrIngredients.push( numIngredient);
                arrResults.push("Ingredient: "+i);
                for ( let j of arrFreshIngredientRanges){
                    if (    numIngredient >= j[0] &&
                            numIngredient <= j[1] ){
                        numTotals++;
                        arrResults.push("fresh");
                        break;
                    }
                }
            } else {
                arrResults.push("Bad line: "+i)
            }
        }
    }

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
