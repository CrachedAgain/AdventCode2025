window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

//    let r = await fetch("datafile-batt.txt");
    let r = await fetch("testfile-batt.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).map( e=>e.trim() ).filter( e=>e!=="" );
    elemData.innerText = arrData.join("\r\n");
    let arrResults = [];
    let numTotals = 0;

    function findLargestBatteries(pack, len){
        let search = pack.slice(0,pack.length-len+1);
        for ( let i of ["9","8","7","6","5","4","3","2","1","0"]){
            let found = search.indexOf(i);
            if ( found !== -1){
                let rest = "";
                if (len > 1){
                    rest = findLargestBatteries(pack.slice(found+1),len-1);
                }
                return search[found] + rest;
            }
        }
    }

    for (let i of arrData) {
        if ( /^[0-9]{12,}$/.test(i)){
            arrResults.push("Testing pack: "+i);
            let jolts = findLargestBatteries(i,12);
            arrResults.push("Jolts: "+jolts);
            numTotals += parseInt(jolts);
        } else {
                arrResults.push("Bad line: "+i)
        }
    }
    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numTotals.toString();
});