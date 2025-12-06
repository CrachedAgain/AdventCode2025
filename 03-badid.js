window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListIDs");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSumBadID");

    let r = await fetch("datafile-ID.txt");
//    let r = await fetch("testfile-ID.txt");
    let data = await r.text();
    let arrData = data.split(",");
    elemData.innerText = arrData.join("\r\n");
    let arrResults = [];
    let numSumBadIDs = 0;

    for (let i of arrData) {
        let r = i.trim().split("-");
        if (    r.length===2 && 
                !isNaN(parseInt(r[0], 10)) && 
                !isNaN(parseInt(r[1], 10)) ){
            let start = parseInt(r[0]);
            let end = parseInt(r[1]);
            arrResults.push("Testing range: "+i);
            for ( let num=start;num <=end;num++){
                let test = num.toString(10);
                if ( test.length % 2 === 0 &&
                    test.slice(0,test.length/2) === test.slice(test.length/2)){
                        numSumBadIDs += num;
                        arrResults.push("Bad ID: "+test);
                    }
            }
        } else {
            if ( i !== ""){
                arrResults.push("Bad line: "+i)
            }
        }
    }
    elemResults.innerText = arrResults.join("\r\n");
    elemSumIDs.innerText = numSumBadIDs.toString();
});