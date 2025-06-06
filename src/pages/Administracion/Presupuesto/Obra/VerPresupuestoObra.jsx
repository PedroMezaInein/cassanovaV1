import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import { apiOptions, apiPostForm, apiGet } from '../../../../functions/api'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  customWidth: {
    maxWidth: 300,
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));



const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);


const TuComponente = (props) => {
  const { reload, handleClose, data, acceso } = props
  const userDepartment = useSelector((form) => form.authUser.departamento);
  const userAuth = useSelector((state) => state.authUser);

  const [presupuestos, setPresupuestos] = useState([]);
  const auth = useSelector(state => state.authUser.access_token)
  const classes = useStyles();

  const defaultMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];


  useEffect(() => {
    // Llamar a la API para obtener los datos
    const fetchData = async () => {
      try {
        // const response = await axios.get('URL_DE_TU_API');
        const response = apiGet(`presupuestosdep/verObra/${data.id}`, auth).then(res => {
          // apiGet(`presupuestosdep/edit/${data.id}`, auth)
          let respuesta = res.data.presupuesto; // Asegúrate de que la respuesta tenga esta estructura       
          console.log(res.data)
          if (Array.isArray(respuesta)) {
            setPresupuestos(respuesta);
          } else {
            console.error('La respuesta de la API no es un array:', respuesta);
            // Manejar el caso en el que la respuesta no sea un array
          }
        });

        // setPresupuestos(response.data.presupuestos);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  let acumulados = {};

  console.log(presupuestos)
  
  return (
    <div className="table-responsive rounded">
      <div className="table-container">
        <h1> {presupuestos[0] ? presupuestos[0].nombre : 'Presupuesto'}
        <LightTooltip title={
          <React.Fragment>
            <Typography color="inherit">Significados de letras</Typography>            
              <u>{"A = Autorizado "}</u><br />
              <u>{"G = Gastado "}</u> <br />
              <u>{"R = Restante "}</u> <br />
              <u>{"A = Acomulado "}</u> 



          </React.Fragment>
        } classes={{ tooltip: classes.customWidth }}>
          <Button style={{ color: 'red' }} className={classes.button}>? </Button>
        </LightTooltip>
        </h1>
       
        <table className="table table-borderless table-vertical-center rounded table-hover">
          <thead>            
            <tr>
              <th >Proyecto</th>
              <th >Área</th>
              <th >Partida</th>
              {
                presupuestos.length > 0 && presupuestos[0].mes[0] ? (
                defaultMeses.map((mes, index) => (
                  presupuestos[0].mes[0][mes.toLowerCase()] === 1 ? <th key={index}>{mes}</th> : null
                ))
              ) : (
                defaultMeses.map((mes, index) => <th key={index}>{mes}</th>)
              )}
            </tr>
          </thead>
          <tbody>
              <>
              {presupuestos.map((presupuesto, index) => (
                Object.keys(presupuesto.montos_por_mes_por_area).map((proyecto) => (
                  Object.keys(presupuesto.montos_por_mes_por_area[proyecto]).map((area) => (
                  (userAuth.user.tipo.id === 1 || acceso.read == 1 ) && (
                  Object.keys(presupuesto.montos_por_mes_por_area[proyecto][area]).map((partida) => {
                    return (
                      <tr key={`${proyecto}_${area}_${partida}`}>
                        <td>{proyecto}</td>
                        <td>{area}</td>
                        <td>{partida}</td>
                        {/* Renderizar los valores de cada mes */}
                        {presupuesto.montos_por_mes_por_area?.[proyecto]?.[area]?.[partida] && 
                        Object.keys(presupuesto.montos_por_mes_por_area[proyecto][area][partida]).map((mes, index) => {
                          const mesAutorizado = presupuesto.mes[0]?.[mes] === 1;

                          if (mesAutorizado) {
                          const valorMontos = presupuesto.montos_por_mes_por_area[proyecto][area][partida][mes] || 0;
                          const valorRequisiciones = presupuesto.requisiciones_info[area]?.[partida]?.[mes] || 0;
                          const resultado = valorMontos - valorRequisiciones;
                          const  valorMostrado = resultado
                          const acumuladoAnterior = acumulados[area]?.[partida] || 0;
                          const acumulado = acumuladoAnterior + valorMostrado;
                          acumulados[area] = { ...acumulados[area], [partida]: acumulado };
                          return (
                            <td key={index} style={{ width: 'auto', whiteSpace: 'nowrap' }}>
                                <span style={{ color: 'red' }}>A:</span>{valorMontos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br />
                                <span style={{ color: 'blue' }}>G:</span> {valorRequisiciones.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br />
                                <span style={{ color: 'green' }}>R:</span>  {valorMostrado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br />
                                <span style={{ color: 'orange' }}>A:</span> {acumulado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br />
                            </td>
                          );
                        }
                        return null;
                        })}
                        
                      </tr>
                    );
                  })
                  ))
                ))
                )
              ))
              }
              
              

          </>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TuComponente;
