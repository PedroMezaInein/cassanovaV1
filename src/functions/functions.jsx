import moment from 'moment'

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

export const diffCommentDate = ( value ) => {
    var now = new Date();
    var then = new Date(value.created_at);

    var diff = moment.duration(moment(now).diff(moment(then)));
    var months = parseInt(moment(now).diff(moment(then), 'month'))

    var days = parseInt(diff.asDays());
    var hours = parseInt(diff.asHours());
    var minutes = parseInt(diff.asMinutes());

    if (months) {
        if (months === 1)
            return 'Hace un mes'
        else
            return `Hace ${months} meses`
    }
    if (days) {
        if (days === 1)
            return 'Hace un día'
        else
            return `Hace ${days} días`
    }
    if (hours) {
        if (hours === 1)
            return 'Hace una hora'
        else
            return `Hace ${hours} horas`
    }
    if (minutes) {
        if (minutes === 1)
            return 'Hace un minuto'
        else
            return `Hace ${minutes} minutos`
    }
    return 'Hace un momento'
};

export function replaceAll( text, busca, reemplaza ){
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca,reemplaza);
    return text;
}