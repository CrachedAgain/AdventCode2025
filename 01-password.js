window.addEventListener("load", async ()=>{
    let elemData = document.getElementById("idTextFile");
    let elemResults = document.getElementById("idResults");
    let elemassword = document.getElementById("idPassword");

    let r = await fetch("datafile.txt");
    let data = await r.text();
    elemData.innerText = data;

    let arrData = data.split(/\r|\n|\r\n/);
    let posLock = 50;
    let reg = /^(L|R)([0-9]{1,})$/i;
    let arrResults = ["The lock starts at "+ posLock.toString()];
    let password = 0;

    for (let i of arrData) {
        let r = reg.exec(i);
        if (r){
            if ( r[1].toLowerCase()==="l"){
                posLock = (posLock + 100 -  parseInt( r[2]) % 100) % 100;
            } else {
                posLock = (posLock + parseInt( r[2])) % 100;
            }
            arrResults.push("Command "+r[1]+" moves the lock to " + posLock.toString() );
            if ( posLock === 0){
                password++;
                arrResults.push("New password valus: "+ password.toString())
            }
        } else {
            if ( i !== ""){
                arrResults.push("Bad line: "+i)
            }
        }
    }
    elemResults.innerText = arrResults.join("\r\n");
    elemassword.innerText = password.toString();
});