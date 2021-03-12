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

export const percentBarReplaceAds =  {
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
                        let cadenaAux = value.label.toUpperCase()
                        cadenaAux = cadenaAux.replace('ADS', '')
                        cadenaAux = cadenaAux.replace('ORGÁNICO', '')
                        cadenaAux = cadenaAux.trim()
                        switch(cadenaAux){
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
                                arreglo = cadenaAux.split(' ')
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
                        let cadena = label.toUpperCase()
                        cadena = cadena.replace('ADS', '')
                        cadena = cadena.replace('ORGÁNICO', '')
                        return cadena.split(";"); 
                    }
                }
            }
        ]
    },
    plugins: {
        datalabels: {
            color: '#808080',
            font: { size: 20, weight: 'bold' },
            align: 'end',
            anchor: 'end'
        }
    },
    legend: { display: false }
}

export const monthGroupBarBreak =  {
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
                        let cadena = label.toUpperCase()
                        let arrayCadena = cadena.split(";")
                        if(arrayCadena.length)
                            arrayCadena =  arrayCadena[0];
                        let arrayAux = []
                        switch(arrayCadena){
                            case 'BOLSA DE TRABAJO':
                                arrayAux.push('BOLSA DE','TRABAJO')
                                break;
                            case 'QUIERO SER PROVEEDOR':
                                arrayAux.push('QUIERO SER','PROVEEDOR')
                                break;
                            case 'AÚN NO LO SE':
                                arrayAux.push('AÚN NO LO SE')
                                break;
                            default:
                                let arreglo = arrayCadena.split(' ')
                                for(let i = 0; i < arreglo.length; i++){
                                    if(i === 0)
                                        cadena = arreglo[i]
                                    else{
                                        if(i%2 === 0){
                                            arrayAux.push(cadena)
                                            cadena = arreglo[i]
                                        }else{ cadena = cadena + ' ' + arreglo[i] }
                                    }
                                    if(i === arreglo.length - 1)
                                        arrayAux.push(cadena)
                                }
                                break
                        }
                        return arrayAux
                    }
                }
            }
        ]
    },
    plugins: {
        datalabels: {
            color: '#808080',
            font: { size: 20, weight: 'bold' },
            align: 'end',
            anchor: 'end'
        }
    },
    legend: { display: false }
}

export const monthGroupBarBreak2 =  {
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
                        let cadena = label.toUpperCase()
                        let arrayCadena = cadena.split(";")
                        if(arrayCadena.length)
                            arrayCadena =  arrayCadena[0];
                        let arrayAux = []
                        switch(arrayCadena){
                            case 'BOLSA DE TRABAJO':
                                arrayAux.push('BOLSA DE','TRABAJO')
                                break;
                            case 'QUIERO SER PROVEEDOR':
                                arrayAux.push('QUIERO SER','PROVEEDOR')
                                break;
                            case 'AÚN NO LO SE':
                                arrayAux.push('AÚN NO LO SE')
                                break;
                            default:
                                let arreglo = arrayCadena.split(' ')
                                for(let i = 0; i < arreglo.length; i++){ arrayAux.push(arreglo[i]) }
                                break
                        }
                        return arrayAux
                    }
                }
            }
        ]
    },
    plugins: {
        datalabels: {
            color: '#808080',
            font: { size: 20, weight: 'bold' },
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

export const monthGroupBarServicios = (value) => ({
    layout: { padding: { top: 50 } },
    maintainAspectRatio: true,
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
                        let cadena = label.toUpperCase()
                        let arrayCadena = cadena.split(";")
                        if(arrayCadena.length)
                            arrayCadena =  arrayCadena[0];
                        let arrayAux = []
                        switch(arrayCadena){
                            case 'BOLSA DE TRABAJO':
                                arrayAux.push('BOLSA DE','TRABAJO')
                                break;
                            case 'QUIERO SER PROVEEDOR':
                                arrayAux.push('QUIERO SER','PROVEEDOR')
                                break;
                            case 'AÚN NO LO SE':
                                arrayAux.push('AÚN NO LO SE')
                                break;
                            default:
                                let arreglo = arrayCadena.split(' ')
                                for(let i = 0; i < arreglo.length; i++){
                                    if(i === 0)
                                        cadena = arreglo[i]
                                    else{
                                        if(i%2 === 0){
                                            arrayAux.push(cadena)
                                            cadena = arreglo[i]
                                        }else{ cadena = cadena + ' ' + arreglo[i] }
                                    }
                                    if(i === arreglo.length - 1)
                                        arrayAux.push(cadena)
                                }
                                break
                        }
                        return arrayAux
                    }
                }
            }
        ]
    },
    plugins: {
        datalabels: {
            /* color: '#808080', */
            /* font: { size: 20, weight: 'bold' }, */
            align: 'end',
            anchor: 'end',
            color: function(context){
                let dataIndex = ''
                let arrayLabel  = []
                let axisId = ''
                let label = ''
                let grises = ['AÚN NO LO SE', 'SERVICIO DE INTERÉS', 'SPAM', 'QUIERO SER PROVEEDOR', 'BOLSA DE TRABAJO', 'OTRO']
                if(context){
                    if(context.dataIndex)
                        dataIndex = context.dataIndex
                    else
                        dataIndex = 0
                    if(context.dataset)
                        if(context.dataset.xAxisID)
                            axisId = context.dataset.xAxisID
                    if(context.chart)
                        if(context.chart.scales)
                            if(context.chart.scales[axisId])
                                if(context.chart.scales[axisId].ticks)
                                    if(dataIndex !== '')
                                        if(context.chart.scales[axisId].ticks[dataIndex])
                                            arrayLabel = context.chart.scales[axisId].ticks[dataIndex]
                }
                arrayLabel.forEach(element => {
                    label = label + element + ' '
                });
                label = label.trim();
                return grises.includes(label) ? '#808080' : value
            },
            font: function(context) {
                var w = context.dataset.data.length;
                return {
                    size: w < 6 ? 25 : w < 13 ? 23 : 20,
                    weight: 'bold'
                };
            },
        }
    },
    legend: { display: true }
})