import React from "react";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";

import { apiGet, apiPostForm } from "../../functions/api";
import '../../styles/_reporteSatisfaccion.scss';

import AnyChart from "anychart-react";
import anychart from "anychart";
//import dataTemp from "./dataTemp";
import Calendar from '../../components/Lottie/Calendar'

import Swal from 'sweetalert2';

export default function ReporteSatisfaccion(fecha) {
    const userAuth = useSelector((state) => state.authUser.access_token);
    const [infoTablas, setInfoTablas] = useState([]);
    const [mes1, setMes1] = useState(false);
    const [mes2, setMes2] = useState(false);
    const [year, setYear] = useState(false);
    const [infoMes1, setInfoMes1] = useState(false);
    const [infoMes2, setInfoMes2] = useState(false);

    useEffect(() => {
        if (mes1 && year) {
            apiPostForm(`respuestas`, { year: year, month: mes1.id }, userAuth)
            .then((res) => {
                if (res.data.respuestas.length > 0) {
                    agruparRespuestas(res.data.respuestas, 1);
                } else {
                    Swal.fire({
                        title: 'Oops...',
                        text: `No hay datos para este mes`,
                    })
                    setInfoTablas([]);
                    setInfoMes1(false);
                    setMes1(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        
    }, [mes1, year]);

    useEffect(() => {
        if (mes1 && year) {
            apiPostForm(`respuestas`, { year: year, month: mes2.id }, userAuth)
                .then((res) => {
                    if (res.data.respuestas.length > 0) {
                        agruparRespuestas(res.data.respuestas, 2);
                    } else {
                        Swal.fire({
                            title: 'Oops...',
                            text: `No hay datos para este mes`,
                        })
                        setInfoTablas([]);
                        setInfoMes2(false);
                        setMes2(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, [mes2, year]);

    useEffect(() => { 
        if (infoMes1 && infoMes2) {
            Swal.fire({
                title: 'Generando gráfica...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                willOpen: () => {
                    Swal.showLoading()
                },
                timer: 2000,
            })
            crearSeries()
        } 
    }, [infoMes1, infoMes2]);

    const crearSeries = () => { 
        let data = []
        let data2 = []
        let data3 = []
        let data4 = []
        infoMes1.map((item, index) => { 
            infoMes2.map((item2, index2) => { 
                if (item2.pregunta == item.pregunta) { 
                    data.push({ 
                        name: item.pregunta,
                        data: [item.data, item2.data]
                    })
                }
            })
        })

        let auxData = []
        infoMes1[8].map((item, index) => { 
            
            auxData[item.value] ? auxData[item.value][0] += 1 : auxData[item.value] = [ 1, 0]

        })
        infoMes2[8].map((item, index) => {
            auxData[item.value] ? auxData[item.value][1] += 1 : auxData[item.value] = [ 0, 1]
        })
        data4.push({
            name: preguntas[3] + ' (PLANOS)',
            data: auxData
        })
        
        data.pop()
        let aux = []
        data.map((item, index) => { 
            item.data.map((item2, index2) => {
                item2.map((item3, index3) => {
                    if (aux[item3.x]) { 
                        aux[item3.x].push(item3.value)
                    } else if(item3.x !== undefined) {
                        
                        aux[item3.x] = []
                        if(index3 === 1) { 
                            aux[item3.x].push(0)
                            aux[item3.x].push(item3.value)
                        } else {
                            aux[item3.x].push(item3.value)
                        }
                    } 
                })
                
            })
            data2.push({
                name: item.name,
                data: aux
            })
            aux = []
        })
        data2.splice(3,0,data4[0])
        crearTabla(data2)
    }

    let preguntas = [
        "EN GENERAL, ¿CÓMO CALIFICARÍAS LA CALIDAD DE TU EXPERIENCIA CON INFRAESTRUCTURA MÉDICA?",
        "¿CÓMO EVALUARÍAS LA ATENCIÓN QUE LE DIMOS PARA RESOLVER TUS NECESIDADES Y DUDAS?",
        " EN GENERAL, ¿CÓMO CALIFICARÍAS EL TIEMPO ASIGNADO PARA ATENDER TU PROYECTO Y DUDAS?",
        "¿QUÉ TAN SATISFECH@ TE ENCUENTRAS CON LA CALIDAD EN LA REALIZACIÓN DE PLANOS Y RENDERS?",
        "¿QUÉ TAN POSIBLE ES QUE CONTRATES EL SERVICIO DE CONSTRUCCIÓN?",
        "¿CÓMO CALIFICARÍAS NUESTRO CONOCIMIENTO SOBRE EL SECTOR SALUD?",
        "¿EXISTE ALGÚN SERVICIO ADICIONAL QUE TE GUSTARÍA QUE BRINDARÁ INFRAESTRUCTURA MÉDICA?",
        "¿QUÉ TAN PROBABLE ES QUE RECOMIENDES A INFRAESTRUCTURA MÉDICA CON TUS AMIGOS, FAMILIARES O COLEGAS?"
    ];

    let opciones = {
        1: {
            excelente: "Excelente",
            positiva: "Positiva",
            neutral: "Neutral",
            negativa: "Negativa",
            pesima: "Pesima"
        },
        2: {
            excelente: "Excelente",
            muyBien: "Muy bien",
            bien: "Bien",
            noTanBien: "No tan bien",
            nadaBien: "Nada bien"
        },

        3: {
            menosTiempo: "Menos tiempo de lo esperado",
            tiempoPactado: "El tiempo que se pacto",
            tiempoEsperado: "El tiempo que esperaba",
            masPactado: "Un poco más tiempo de lo pactado",
            muchoMasPactado: "Mucho más tiempo de lo pactado",
        },
        4: {
            muySatisfecho: "Muy satisfech@",
            satisfecho: "Satisfech@",
            neutral: "Neutral",
            insatisfecho: "Insatisfech@",
            muyInsatisfecho: "Muy insatisfech@",
        },
        6: {
            muybueno: "Muy bueno",
            bueno: "Bueno",
            neutral: "Neutral",
            malo: "Malo",
            muymalo: "Muy malo"
        },
    };

    let auxTem = []

    let prop = {
        pathname: '/leads/reporte',
    }

    const agruparRespuestas = (data, num) => {
        let aux = [];
        let arr2 = [];
        let dataTables = [];
        let mes = new Date(data[0].created_at).getMonth() + 1;
        data.map((respuesta, index) => {
            let a = respuesta.nombre_pregunta.slice(0, 1);
            if (aux[a]) {
                aux[a].push(respuesta);
            } else {
                aux[a] = [respuesta];
            }
        });

        aux.map((respuesta, index) => {
            let arr1 = [];
            respuesta.map((item, index) => {
                if (arr1[item.respuesta]) {
                    arr1[item.respuesta] += 1;
                } else {
                    arr1[item.respuesta] = 1;
                }
            });
            arr2.push(arr1);
        });

        arr2.map((item, index) => {
            let dataTemp = [];
            for (let key in item) {
                switch (index) {
                    case 0:
                        dataTemp.push({
                            x: opciones[1][key],
                            value: item[key],
                        });
                        break;
                    case 1:
                        dataTemp.push({
                            x: opciones[2][key],
                            value: item[key],
                        });
                        break;
                    case 2:
                        dataTemp.push({
                            x: opciones[3][key],
                            value: item[key],
                        });
                        break;
                    case 3:
                        if (opciones[4][key] === undefined) {
                            auxTem.push({
                            x: opciones[4][key],
                            value: item[key],
                            });
                        } else {
                           dataTemp.push({
                            x: opciones[4][key],
                            value: item[key],
                           }); 
                        }
                        break;
                    case 5:
                        dataTemp.push({
                            x: opciones[6][key],
                            value: item[key],
                        });
                        break;
                    default:
                        dataTemp.push({
                            x: key,
                            value: item[key],
                        });
                        break;
                }
            }
            dataTables.push({
                pregunta: preguntas[index],
                data: dataTemp,
            });
            
        });

        dataTables.push(auxTem);

        if (num === 1) {
            setInfoMes1([
                ...dataTables
            ]);
        } else {
            setInfoMes2([
                ...dataTables
            ]);
        }
        
    };

    const crearTabla = (data) => {
        let aux = []
        let chart = []
        data.map((item, index) => {
            let serieAux = []
            let series = []
            for (let key in item.data) { 
                //console.log(`["${key}", ${item.data[key]}]`)
                serieAux.push([key, ...item.data[key]])
            }

            serieAux.map((item, index) => { 
                if (item.length === 4) {
                    item.splice(1, 1)
                } else if (item.length === 2) {
                    item.push(0)
                }

                series.push(item)
            })
        
            let chartData = {
                title: `${item.name} ${mes1.nombre} vs ${mes2.nombre}`,
                header: ['#', `${mes1.nombre}`, `${mes2.nombre}`],
                rows: [
                    ...series
                ]
            }

            chart = anychart.column()
            chart.data(chartData);
            chart.animation(true);
            chart.yAxis().labels().format('{%Value}{groupsSeparator: }');
            chart.yAxis().title('Clientes');
            chart
                .labels()
                .enabled(true)
                .position('center-top')
                .anchor('center-bottom')
                .format('{%Value}{groupsSeparator: }');
            chart.hovered().labels(false);
            chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);
            chart
                .tooltip()
                .positionMode('point')
                .position('center-top')
                .anchor('center-bottom')
                .offsetX(0)
                .offsetY(5)
                .titleFormat('{%X}')
                .format('{%SeriesName} : {%Value}{groupsSeparator: }');
            
            aux.push(chart)
        })
        
        setInfoTablas( aux)
    }

    const mesesSelect = [
        { id: "01", nombre: "Enero" },
        { id: "02", nombre: "Febrero" },
        { id: "03", nombre: "Marzo" },
        { id: "04", nombre: "Abril" },
        { id: "05", nombre: "Mayo" },
        { id: "06", nombre: "Junio" },
        { id: "07", nombre: "Julio" },
        { id: "08", nombre: "Agosto" },
        { id: "09", nombre: "Septiembre" },
        { id: "10", nombre: "Octubre" },
        { id: "11", nombre: "Noviembre" },
        { id: "12", nombre: "Diciembre" },
    ];

    const handleChangeMeses = (e) => {
        e.preventDefault();
        if (e.target.name === 'mes1') {
            setMes1({
                id: e.target.value,
                nombre: mesesSelect.find((item) => item.id === e.target.value).nombre,
            })
        } else {
            setMes2({
                id: e.target.value,
                nombre: mesesSelect.find((item) => item.id === e.target.value).nombre,
            })
        }
    };

    return (
        <Layout authUser={userAuth} location={prop} history={{location: prop}} active='leads'>
            <div className = 'satisfaccion'>
                <div className='satisfaccion_tittle'>Reportes De SatisfacciÓn</div>
                <div className="SelectFiltrosContainer">
                    <span>año</span>
                    <select name="año" id="año" onChange={(e) => setYear(e.target.value)}>
                        <option value="" hidden>Selecciona un año</option>
                        <option value="2022">2022</option>
                    </select>
                    <span>Comparar</span>
                    <div className='satisfaccion_select'>
                        <select disabled={year? null: true} name="mes1" id="mes" value={mes1.id} onChange={(e) => handleChangeMeses(e)}>
                            <option value="" hidden>Seleccione un mes</option>
                            {mesesSelect.map((mes, index) => {
                                return <option key={index} value={mes.id}>{mes.nombre}</option>
                            })}
                        </select>
                        <span>&nbsp; VS &nbsp;</span>
                        <select disabled={year ? null : true} name="mes2" id="mes" value={mes2.id} onChange={(e) => handleChangeMeses(e)}>
                            <option value="" hidden>Seleccione un mes</option>
                            {mesesSelect.map((mes, index) => (
                                <option key={index} value={mes.id}>{mes.nombre}</option>
                            ))}
                        </select>
                    </div>   
                </div>
                {mes1 && mes2 && 
                    <div className='satisfaccion_container'>
                        <div>
                            {infoTablas.length > 0 &&
                                infoTablas.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <AnyChart
                                                instance={infoTablas[index]}
                                                width="50%"
                                                height="500px"
                                                download={true}
                                                palette={["#CBBA8E", "#8BA2C5"]}
                                                
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </Layout>
    );
}
