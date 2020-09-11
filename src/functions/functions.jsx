export function countDaysWithoutWeekend(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if(!((dayOfWeek === 6) || (dayOfWeek === 0)))
            count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}

export function generateColor(){
    let simbolos, color;
	simbolos = "0123456789ABCDEF";
	color = "#";
    for(var i = 0; i < 6; i++){
		color = color + simbolos[Math.floor(Math.random() * 16)];
    }
    return color
}