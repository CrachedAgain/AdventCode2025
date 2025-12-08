window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idListData");
    let elemResults = document.getElementById("idResults");
    let elemSumIDs = document.getElementById("idSum");

    let r = await fetch("datafile-paper.txt");
//    let r = await fetch("testfile-paper.txt");
    let data = await r.text();
    let arrData = data.split(/\r|\n|\r\n/).map( e=>e.trim() ).filter( e=>e!=="" );
    elemData.innerText = arrData.join("\r\n");
    let arrResults = [];
    let numTotals = 0;


    function countAtPos(arr,x,y){
        if ( x < 0 ||
             y < 0 ||
             x >= arr[0].length  ||
             y >= arr.length
        ) {
            return 0;
        } else {
            return (arr[y][x] === "@" || arr[y][x] === "x") ? 1 : 0;
        }
    }

    function countNeighbors(arr, x, y){
        return (
            countAtPos(arr, x-1 ,y-1) +
            countAtPos(arr, x   ,y-1) +
            countAtPos(arr, x+1 ,y-1) +

            countAtPos(arr, x-1 ,y) +
            countAtPos(arr, x+1 ,y) +

            countAtPos(arr, x-1 ,y+1) +
            countAtPos(arr, x   ,y+1) +
            countAtPos(arr, x+1 ,y+1)
        );
    }
//    debugger;
    while (true){
        let numRemoved = 0;
        arrData = arrData.map( str=>str.replace("x","."))
        for (let [y, line] of arrData.entries()) {
            if ( /^[@.]+$/.test(line) && line.length === arrData[0].length){
                let stack = "";
                for ( let [x, char] of line.split("").entries()){
                    if ( char === "@"){
                        if ( countNeighbors(arrData,x,y) < 4){
                            numTotals++;
                            numRemoved++;
                            stack+="x";
                            arrData[y] = arrData[y].slice(0,x)+"x"+arrData[y].slice(x+1);
                        }else{
                            stack+="@";
                        }
                    }else{
                        stack+="."
                    }
                }
                arrResults.push("Data: "+stack);
            } else {
                arrResults.push("Bad line: "+line);
            }
        }
        arrResults.push("Paper rolls removed: "+numRemoved);
        elemResults.innerText = arrResults.join("\r\n");
        if (numRemoved === 0){
            break;
        }
    }
    elemSumIDs.innerText = numTotals.toString();
});
