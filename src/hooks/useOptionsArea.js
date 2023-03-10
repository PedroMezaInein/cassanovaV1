import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiGet } from '../functions/api'
import { SaveOptionsAreas, SaveOptionsPresupuestos } from '../redux/actions/actions'

const useOptionsArea = () => {
    const [opciones, setOpciones] = useState(false)
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const user = useSelector(state => state.authUser)
    const opcionesState = useSelector(state => state.opciones);
    useEffect(() => {
        if (opcionesState.areas.length === 0) { 
            apiGet('areas', user.access_token)
                .then((response) => {
                    setOpciones(response.data)
                })
                .catch((error) => {
                })    
        }
        
    }, [])

    useEffect(() => {
        if (opcionesState.areas.length === 0) { 
            if (opciones) {
                proccessData()
            }    
        }
        
    }, [opciones])

    const proccessData = () => {
        let e = opciones
        let aux = []
        for(let key in e.area){
            for(let area in e.area[key]){
                let auxPartidas = []
                    for(let idpartida in e.area[key][area]){
                        for(let partida in e.area[key][area][idpartida]){
                            // Imprime el nombre de cada partida
                            let auxSubpartida = []
                            e.area[key][area][idpartida][partida].forEach(elemento =>{
                                auxSubpartida.push({
                                    id: elemento.id,
                                    nombre: elemento.nombre,
                                })
                            })

                            auxSubpartida.sort((a, b) => {
                                if (a.nombre < b.nombre) {
                                    return -1;
                                }
                                if (a.nombre > b.nombre) {
                                    return 1;
                                }
                                return 0;
                            })
                            auxPartidas.push({
                                id:idpartida,
                                nombre:partida,
                                subpartidas:auxSubpartida
                            })
                            auxPartidas.sort((a, b) => {
                                if (a.nombre < b.nombre) {
                                    return -1;
                                }
                                if (a.nombre > b.nombre) {
                                    return 1;
                                }
                                return 0;
                            })
                        }
                    }
                let areas = {
                    nombreArea: area,
                    id_area: key,
                    partidas:auxPartidas,
                }
                aux.push(areas)
            }
            aux.sort((a, b) => {
                if (a.nombreArea < b.nombreArea) {
                    return -1;
                }
                if (a.nombreArea > b.nombreArea) {
                    return 1;
                }
                return 0;
            })
        }
        dispatch(SaveOptionsAreas(aux))
        dispatch(SaveOptionsPresupuestos(e.presupuesto))
    }
    
}

export default useOptionsArea;
