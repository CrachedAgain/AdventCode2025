window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-math.txt");
    let r = await fetch("testfile-math.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).map( e=>e.trim() ).filter( e=>e!=="" ).map( e=> e.split(/ +/));
    elemData.innerText = arrData.map( e => e.join(" ")).join("\r\n");
    let arrResults = [];
    let numTotals = 0;

    for (let numProblem=0; numProblem < arrData.length; numProblem++){
        let arrProblem = arrData.map( e => e[numProblem] );
        let operation = arrProblem[ arrProblem.length-1 ];
        let startValue = operation==="*" ? 1 : 0;
        arrProblem = arrProblem.slice(0, arrProblem.length-1);
        let numResult = arrProblem.reduce( (prev, cur)=> operation==="*" ? prev*cur : prev+cur, startValue)
        arrResults.push("Operation: "+ arrProblem.join(" "+operation+" ")+" = "+numResult.toString());
        numTotals += numResult;
    }

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
