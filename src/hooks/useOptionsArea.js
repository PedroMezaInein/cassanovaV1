import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiGet } from '../functions/api';
import {
    SaveOptionsAreas,
    SaveOptionsPresupuestos,
    Departamentos,
    Ventas,
    Ingresos,
    Compras,
    Proyectos,
    Empresas,
    Empresa,
    Proveedores,
    Clientes,
} from '../redux/actions/actions';

const useOptionsArea = () => {
    const [opciones, setOpciones] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authUser);

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        if (opciones) {
            processData(opciones.area, SaveOptionsAreas);
            dispatch(SaveOptionsPresupuestos(opciones.presupuesto));
            dispatch(Departamentos(opciones.departamentos));
            processData(opciones.ventas, Ventas);
            processData(opciones.ingresos, Ingresos);
            processData(opciones.compras, Compras);
            processSimpleData(opciones.proyectos, Proyectos, 'nombre', 'simpleName');
            processSimpleData(opciones.empresas, Empresas, 'name');
            processSimpleData(opciones.empresa, Empresa, 'name', null, 'cuentas');
            processProveedores(opciones.proveedores, Proveedores, 'nombre');
            processClientes(opciones.clientes, Clientes, 'nombre');
            // empre(opciones.empresa, Empresa, 'name', null, 'nombre');
            
        }
    }, [opciones]);

    const fetchOptions = async () => {
        try {
            const response = await apiGet('areas', user.access_token);
            setOpciones(response.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    // Procesa datos complejos (como áreas, ingresos, ventas, compras)
    const processData = (data, action) => {
        const aux = Object.keys(data).reduce((result, key) => {
            const areas = Object.keys(data[key]).map((area) => {
                const partidas = Object.keys(data[key][area]).map((idPartida) => {
                    const partidasArray = Object.entries(data[key][area][idPartida]).map(
                        ([nombre, elementos]) => ({
                            id: idPartida,
                            nombre,
                            subpartidas: elementos
                                .map((elemento) => ({
                                    id: elemento.id,
                                    nombre: elemento.nombre
                                }))
                                .sort(sortByName)
                        })
                    );
                    return partidasArray.sort(sortByName);
                });
                return {
                    nombreArea: area,
                    id_area: key,
                    partidas: partidas.flat()
                };
            });
            return [...result, ...areas];
        }, []);

        aux.sort(sortByName);
        dispatch(action(aux));
    };

    // Procesa datos simples como proyectos o empresas
    // Procesa datos simples como proyectos o empresas
    const processSimpleData = (data, action, sortKey, additionalKey = null, additionalArrayKey = null) => {
        const aux = data
            .map((item) => ({
                id: item.id,
                rfc: item.rfc,
                nombre: item[sortKey],
                ...(additionalKey && { [additionalKey]: item[additionalKey] }),
                ...(additionalArrayKey && { cuentas: item[additionalArrayKey] || [] }) // Agregar array de cuentas
            }))
            .sort(sortByName);

        dispatch(action(aux));
    };


      // Procesa proveedores con validación específica
      const processProveedores = (data, action) => {
        const aux = data
            .filter((proveedor) => proveedor.razon_social !== null) // Validación
            .map((proveedor) => ({
                id: proveedor.id,
                name: proveedor.razon_social,
                rfc: proveedor.rfc,
            }))
            .sort(sortByName);
        dispatch(action(aux));
    };

    const processClientes = (data, action) => {
        const aux = data
            .filter((clientes) => clientes.nombre !== null) // Validación
            .map((clientes) => ({
                id: clientes.id,
                name: clientes.nombre,
                rfc: clientes.rfc,
            }))
            .sort(sortByName);
        dispatch(action(aux));
    };

    const empre = (data, action) => {
        const aux = data
            .filter((empresa) => empresa.name !== null) // Validación
            .map((empresa) => ({
                id: empresa.id,
                nombre: empresa.name,
                rfc: empresa.rfc,
            }))
            .sort(sortByName);
        dispatch(action(aux));
    };

    const sortByName = (a, b) => {
        if (a.nombre < b.nombre) return -1;
        if (a.nombre > b.nombre) return 1;
        return 0;
    };
};

export default useOptionsArea;
