export const dataSimpleBar = {
    layout: { padding: { top: 50 } },
    plugins: {
        datalabels: {
            color: '#fff',
            font: { size: 22, weight: 'bold' }
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    fontSize: 16,
                }
            },
        ],
        xAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontSize: 20,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    lineWidth: 10,
                    padding: 10,
                    position: 'bottom',
                    autoSkip: false,
                    callback: function (value, index, values) {
                        let auxiliar = []
                        let arreglo = []
                        let cadena = ''
                        switch(value){
                            case 'Bolsa de trabajo':
                                auxiliar.push('BOLSA DE','TRABAJO')
                                break;
                            case 'Quiero ser proveedor':
                                auxiliar.push('QUIERO SER','PROVEEDOR')
                                break;
                            case 'Aún no lo se':
                                auxiliar.push('AÚN NO LO SE')
                                break;
                            default:
                                arreglo = value.split(' ')
                                for(let i = 0; i < arreglo.length; i++){
                                    if(i === 0)
                                        cadena = arreglo[i]
                                    else{
                                        if(i%2 === 0){
                                            auxiliar.push(cadena.toUpperCase())
                                            cadena = arreglo[i]
                                        }else{
                                            cadena = cadena + ' ' + arreglo[i]
                                        }
                                    }
                                    if(i === arreglo.length - 1)
                                        auxiliar.push(cadena.toUpperCase())
                                }
                                break;
                        }
                        return auxiliar
                    }
                }
            },
        ],
    },
    legend: {
        display: false,
        fullWidth: true,
        labels: {
            boxWidth: 20,
            padding: 5,
            fontSize: 20,
            fontColor: '#808080'
        }
    },
}

export const percentBar =  {
    layout: { padding: { top: 50 } },
    plugins: {
        datalabels: {
            color: '#808080',
            font: function(context) {
                var w = context.dataset.data.length;
                return {
                    size: w < 6 ? 25 : w < 13 ? 23 : 20,
                    weight: 'bold',
                };
            },
            align: 'end',
            anchor: 'end',
            formatter: function(value, context) {
                if(context.dataset.percent){
                    if(context['dataset']['percent'][context['dataIndex']] > 1)
                        return context['dataset']['percent'][context['dataIndex']] + '%'
                    else return value
                }
                else{
                    return value
                }
            }
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    fontSize: 16,
                }
            },
        ],
        xAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontSize: 16,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    lineWidth: 10,
                    padding: 10,
                    position: 'bottom',
                    autoSkip: false,
                    callback: function (value, index, values) {
                        value.label = value.label.toUpperCase()
                        let auxiliar = []
                        let arreglo = []
                        let cadena = ''
                        switch(value.label.toUpperCase()){
                            case 'BOLSA DE TRABAJO':
                                auxiliar.push('BOLSA DE','TRABAJO')
                                break;
                            case 'QUIERO SER PROVEEDOR':
                                auxiliar.push('QUIERO SER','PROVEEDOR')
                                break;
                            case 'AÚN NO LO SE':
                                auxiliar.push('AÚN NO LO SE')
                                break;
                            default:
                                arreglo = value.label.split(' ')
                                for(let i = 0; i < arreglo.length; i++){
                                    if(i === 0)
                                        cadena = arreglo[i]
                                    else{
                                        if(i%2 === 0){
                                            auxiliar.push(cadena)
                                            cadena = arreglo[i]
                                        }else{
                                            cadena = cadena + ' ' + arreglo[i]
                                        }
                                    }
                                    if(i === arreglo.length - 1)
                                        auxiliar.push(cadena)
                                }
                                break;
                        }
                        
                        auxiliar.push(value.value)
                        return auxiliar
                    }
                }
            },
        ],
    },
    legend: {
        display: false,
        fullWidth: true,
        labels: {
            boxWidth: 20,
            padding: 5,
            fontSize: 12,
            fontColor: '#808080'
        },    
    }
}

export const monthGroupBar =  {
    layout: { padding: { top: 50 } },
    maintainAspectRatio: true,
    scales: {
        yAxes: [
            {
                ticks: {
                    /* max: maximo, */
                    beginAtZero: true,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    fontSize: 16,
                }
            },
        ],
        xAxes: [
            {
                id: 'xAxis1',
                type: 'category',
                ticks: {
                    labelOffset:0,
                    beginAtZero: true,
                    fontSize: 15,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    padding: 5,
                    position: 'bottom',
                    maxRotation: 90,
                    minRotation: 90,
                    callback:function(label){ 
                        return label.split(";"); 
                    }
                }
            }
        ]
    },
    plugins: {
        datalabels: {
            color: '#808080',
            font: { size: 13, weight: 'bold' },
            align: 'end',
            anchor: 'end'
        }
    },
    legend: { display: false }
}

export const singleBar = {
    plugins: {
        datalabels: {
            color: '#fff',
            font: {
                size: 22,
                weight: 'bold'
            }
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    fontSize: 16,
                }
            },
        ],
        xAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontSize: 16,
                    fontColor: '#808080',
                    fontStyle: "bold",
                    lineWidth: 10,
                    padding: 10,
                    position: 'bottom',
                    autoSkip: false,
                    callback: function (value, index, values) {
                        let aux = value.split(' ')
                        return aux
                    }
                }
            },
        ],
    },
    legend: {
        display: false,
        fullWidth: true,
        labels: {
            boxWidth: 20,
            padding: 5,
            fontSize: 12,
            fontColor: '#808080'
        }
    },
}

/* const setCapitalizeText = string => {
    return string
    return string.toUpperCase()
    return string.trim().replace(/^\w/, (c) => c.toUpperCase());
} */