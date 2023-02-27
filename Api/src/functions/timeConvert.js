const timeConvert = (horas) => {
    let H=0;
    let M=0

    while (horas - (H*60) >= 60 ){
        H += 1 ;
        M = horas - H*60
    }
    return `${H}:${M}`
}

module.exports = timeConvert