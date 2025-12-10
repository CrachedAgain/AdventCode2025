window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-math.txt");
    let r = await fetch("testfile-math.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).filter( e=>e.trim()!=="" ).map( e=> e.split(""));
    elemData.innerText = arrData.map( e => e.join(" ")).join("\r\n");

    let arrOperations = arrData[arrData.length-1].filter( e=> e.trim());
    let arrColNumbers = arrData.slice(0, arrData.length-1);
    let arrResults = [];
    let numTotals = 0;

    let arrNumbers=[];
    let arrAllNumbers=[];

    for (let index=0; index < arrColNumbers[0].length; index++){
        let number = arrColNumbers.map( e => e[index].trim() ).join("");
        if ( number !== ""){
            arrNumbers.push(number);
        }
        if ( number === "" || index==arrColNumbers[0].length-1){
            arrNumbers.reverse();
            arrAllNumbers.push(arrNumbers);
            arrNumbers = [];
        }
    }
    for (let index=0; index < arrAllNumbers.length; index++){
        let operation = arrOperations[ index ];
        let startValue = operation==="*" ? 1 : 0;
        let numResult = arrAllNumbers[index].reduce( (prev, cur)=> (operation==="*" ? prev*parseInt(cur) : prev+parseInt(cur)), startValue)
        arrResults.push("Operation: "+ arrAllNumbers[index].join(" "+operation+" ")+" = "+numResult.toString());
        numTotals += numResult;
    }

    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});
