// import React, { useState, useEffect } from 'react';
// import { useSelector } from "react-redux";
// import { Row, Col, Form } from 'react-bootstrap';
// import $ from 'jquery';
// import Swal from 'sweetalert2';
// import { apiPost, apiGet } from '../../../../functions/api';
// import { printResponseErrorAlert, doneAlert, waitAlert } from './../../../../functions/alert';
// import './../../../../styles/_modal_form.scss';

// const EdithEquipoForm = ({ props: data, refresh, close }) => {
//   const authUser = useSelector(state => state.authUser.access_token);

//   const [usuarios, setUsuarios] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [dispositivos, setDispositivos] = useState([]);

//   const [equipoActual, setEquipoActual] = useState('');
//   const [ediciones, setEdiciones] = useState({});
//   const [equipoForm, setEquipoForm] = useState({
//     empleado_id: '',
//     area_id: ''
//   });
//   const [nuevasCaracteristicas, setNuevasCaracteristicas] = useState({});

//   const agruparDispositivos = (lista) => {
//     const map = new Map();
//     lista.forEach(d => {
//       const key = (d.equipo?.trim()) || (d.nombre?.trim()) || `DISP_${d.id}`;
//       let caracs = [];
//       if (Array.isArray(d.caracteristicas)) {
//         caracs = d.caracteristicas;
//       } else if (typeof d.caracteristicas === 'string') {
//         try { caracs = JSON.parse(d.caracteristicas); } catch { caracs = []; }
//       }
//       if (map.has(key)) {
//         const actual = map.get(key);
//         map.set(key, {
//           ...actual,
//           ids: [...actual.ids, d.id],
//           caracteristicas: [...new Set([...actual.caracteristicas, ...caracs])]
//         });
//       } else {
//         map.set(key, {
//           equipo: key,
//           ids: [d.id],
//           descripcion: d.descripcion || '',
//           area_id: d.area_id || '',
//           caracteristicas: caracs
//         });
//       }
//     });
//     return Array.from(map.values());
//   };

//   useEffect(() => {
//     if (data) {
//       getUsers();
//       getAreas();
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!data || usuarios.length === 0 || areas.length === 0) return;

//     const user = usuarios.find(u =>
//       u.id === data.empleado_id || u.id === data.colaborador_id ||
//       u.nombre?.toLowerCase().includes(data.colaborador?.toLowerCase())
//     );

//     const area = areas.find(a =>
//       a.id === data.area_id ||
//       a.nombre?.toLowerCase() === data.area?.toLowerCase()
//     );

//     const agrupados = agruparDispositivos(data.dispositivos);
//     setDispositivos(agrupados);

//     setEquipoForm({
//       empleado_id: user?.id || '',
//       area_id: area?.id || ''
//     });

//     const firstKey = `${agrupados[0]?.equipo}_${agrupados[0]?.ids[0]}`;
//     setEquipoActual(firstKey);

//     const nuevoEstado = {};
//     agrupados.forEach(d => {
//       const key = `${d.equipo}_${d.ids[0]}`; // clave única
//       nuevoEstado[key] = {
//         id: d.ids[0], // ID original!
//         equipo: d.equipo,
//         descripcion: d.descripcion || '',
//         caracteristicas: d.caracteristicas.map(c => ({ carac: c }))
//       };
//     });
//     setEdiciones(nuevoEstado);

//   }, [usuarios, areas, data]);

//   useEffect(() => {
//     if (dispositivos.length && !equipoActual) {
//       const first = dispositivos[0];
//       if (first) setEquipoActual(`${first.equipo}_${first.ids[0]}`);
//     }
//   }, [dispositivos]);

//   const getUsers = () => {
//     apiGet('user/users/options', authUser)
//       .then(res => setUsuarios(res.data.empleados || []))
//       .catch(printResponseErrorAlert);
//   };

//   const getAreas = () => {
//     apiGet('equipos/areas/options', authUser)
//       .then(res => setAreas(res.data.areas || []))
//       .catch(printResponseErrorAlert);
//   };

//   const editarCaracteristica = (idx, value) => {
//     setEdiciones(prev => {
//       const caracs = [...prev[equipoActual].caracteristicas];
//       caracs[idx].carac = value;
//       return {
//         ...prev,
//         [equipoActual]: { ...prev[equipoActual], caracteristicas: caracs }
//       };
//     });
//   };

//   const agregarCaracteristica = () => {
//     const nueva = (nuevasCaracteristicas[equipoActual] || '').trim();
//     if (nueva) {
//       setEdiciones(prev => ({
//         ...prev,
//         [equipoActual]: {
//           ...prev[equipoActual],
//           caracteristicas: [...prev[equipoActual].caracteristicas, { carac: nueva }]
//         }
//       }));
//       setNuevasCaracteristicas(prev => ({
//         ...prev,
//         [equipoActual]: ''
//       }));
//     }
//   };

//   const eliminarCaracteristica = (idx) => {
//     setEdiciones(prev => {
//       const nuevoCaracs = prev[equipoActual].caracteristicas.filter((_, i) => i !== idx);
//       return {
//         ...prev,
//         [equipoActual]: {
//           ...prev[equipoActual],
//           caracteristicas: nuevoCaracs
//         }
//       };
//     });
//   };


//   const handleDescripcionChange = (value) => {
//     setEdiciones(prev => ({
//       ...prev,
//       [equipoActual]: { ...prev[equipoActual], descripcion: value }
//     }));
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     waitAlert();
//     const payload = Object.keys(ediciones).map(key => ({
//   id: ediciones[key].id, // ⏫ IMPORTANTE
//   equipo: ediciones[key].equipo,
//   descripcion: ediciones[key].descripcion,
//   caracteristicas: ediciones[key].caracteristicas.map(c => c.carac),
//   empleado_id: equipoForm.empleado_id,
//   area_id: equipoForm.area_id
// }));



//     apiPost(`v2/rh/empleados/equipos/${equipoForm.empleado_id}`, { equipos: payload }, authUser)
//       .then(() => {
//         if (refresh) refresh();
//         if (close) close();
//         doneAlert('Equipos actualizados con éxito');
//       })
//       .catch(printResponseErrorAlert);
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       <Row className="mx-0 align-items-end mb-3">
//         <Col md="4" className="mb-2">
//           <label>Colaborador</label>
//           <select
//             name="empleado_id"
//             value={equipoForm.empleado_id || ''}
//             disabled
//             className="form-control"
//           >
//             <option hidden>Selecciona un colaborador</option>
//             {usuarios.map(u => (
//               <option key={u.id} value={u.id}>{u.nombre}</option>
//             ))}
//           </select>
//         </Col>

//         <Col md="4" className="mb-2">
//           <label>Área</label>
//           <select
//             name="area_id"
//             value={equipoForm.area_id || ''}
//             disabled
//             className="form-control"
//           >
//             <option hidden>Selecciona un área</option>
//             {areas.map(a => (
//               <option key={a.id} value={a.id}>{a.nombre}</option>
//             ))}
//           </select>
//         </Col>

//         <Col md="4" className="mb-2">
//           <label>Dispositivo</label>
//           <select
//             value={equipoActual}
//             onChange={e => setEquipoActual(e.target.value)}
//             className="form-control"
//           >
//             <option hidden>Selecciona un dispositivo</option>
//             {Array.from(new Set(dispositivos.map(d => d.equipo)))
//               .map(name => {
//                 const key = Object.keys(ediciones).find(k => ediciones[k].equipo === name);
//                 return (
//                   <option key={key} value={key}>{name}</option>
//                 );
//               })}
//           </select>
//         </Col>
//       </Row>

//       <Row className="mx-0 mb-3">
//         <Col md="12">
//           <label>Detalles del Dispositivo</label>
//           <table className="table table-bordered">
//             <thead>
//               <tr>
//                 <th>Características</th>
//                 <th>Adicionales</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>
//                   <ul className="list-unstyled mb-0">
//                     {(ediciones[equipoActual]?.caracteristicas || []).map((item, idx) => (
//                       <li key={idx} className="d-flex align-items-center mb-1">
//                         <input
//                           type="text"
//                           className="form-control mr-2"
//                           value={item.carac}
//                           onChange={(e) => editarCaracteristica(idx, e.target.value)}
//                         />
//                         <button
//                           type="button"
//                           className="btn btn-link text-danger p-0"
//                           onClick={() => eliminarCaracteristica(idx)}
//                         >❌</button>
//                       </li>
//                     ))}

//                     <li className="d-flex align-items-center">
//                       <input
//                         type="text"
//                         className="form-control mr-2"
//                         value={nuevasCaracteristicas[equipoActual] || ''}
//                         onChange={e =>
//                           setNuevasCaracteristicas(prev => ({
//                             ...prev,
//                             [equipoActual]: e.target.value
//                           }))
//                         }
//                         placeholder="Nueva característica"
//                       />
//                       <button
//                         type="button"
//                         className="btn btn-primary"
//                         onClick={agregarCaracteristica}
//                       >➕</button>
//                     </li>
//                   </ul>
//                 </td>
//                 <td>
//                   <textarea
//                     value={ediciones[equipoActual]?.descripcion || ''}
//                     onChange={e => handleDescripcionChange(e.target.value)}
//                     className="form-control"
//                     rows="3"
//                     placeholder="Información adicional"
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </Col>
//       </Row>

//       <div className="text-right">
//         <button type="submit" className="btn btn-primary">GUARDAR</button>
//       </div>
//     </Form>
//   );
// };

// export default EdithEquipoForm;
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import swal from 'sweetalert2';
import { Row, Col, Form } from 'react-bootstrap';
import { apiPostForm, apiGet } from '../../../../functions/api';
import { printResponseErrorAlert, doneAlert, waitAlert } from './../../../../functions/alert';
import './../../../../styles/_modal_form.scss';

export default function EdithEquipoForm({ props: data, refresh, close }) {
  const authUser = useSelector(state => state.authUser.access_token);

  const [usuarios, setUsuarios] = useState([]);
  const [areas, setAreas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [equipoForm, setEquipoForm] = useState({
    empleado_id: '',
    area_id: ''
  });

  const [ediciones, setEdiciones] = useState({});
  const [nuevasCaracteristicas, setNuevasCaracteristicas] = useState({});

  useEffect(() => {
    if (data) {
      getUsers();
      getAreas();
    }
  }, [data]);

  useEffect(() => {
    if (!data || usuarios.length === 0 || areas.length === 0) return;

    const user = usuarios.find(u =>
      u.id === data.empleado_id || u.id === data.colaborador_id ||
      (data.colaborador && u.nombre?.toLowerCase().includes(data.colaborador.toLowerCase()))
    );
    const area = areas.find(a =>
      a.id === data.area_id || (data.area && a.nombre?.toLowerCase() === data.area.toLowerCase())
    );

    const agrupados = agruparDispositivos(data.dispositivos);
    setDispositivos(agrupados);

    setEquipoForm({
      empleado_id: user?.id || '',
      area_id: area?.id || ''
    });

    const nuevoEstado = {};
    agrupados.forEach(d => {
      const key = `${d.equipo}_${d.ids[0]}`;
      nuevoEstado[key] = {
        id: d.ids[0],
        equipo: d.equipo,
        descripcion: d.descripcion || '',
        caracteristicas: d.caracteristicas.map(c => ({ carac: c }))
      };
    });
    setEdiciones(nuevoEstado);

  }, [usuarios, areas, data]);

  const getUsers = () => {
    apiGet('user/users/options', authUser)
      .then(res => setUsuarios(res.data.empleados || []))
      .catch(printResponseErrorAlert);
  };

  const getAreas = () => {
    apiGet('equipos/areas/options', authUser)
      .then(res => setAreas(res.data.areas || []))
      .catch(printResponseErrorAlert);
  };

  const agruparDispositivos = lista => {
    const map = new Map();
    lista.forEach(d => {
      const key = d.equipo?.trim() || d.nombre?.trim() || `DISP_${d.id}`;
      let caracs = [];
      if (Array.isArray(d.caracteristicas)) caracs = d.caracteristicas;
      else if (typeof d.caracteristicas === 'string') {
        try { caracs = JSON.parse(d.caracteristicas); } catch { caracs = []; }
      }
      if (map.has(key)) {
        const actual = map.get(key);
        map.set(key, {
          ...actual,
          ids: [...actual.ids, d.id],
          caracteristicas: [...new Set([...actual.caracteristicas, ...caracs])]
        });
      } else {
        map.set(key, {
          equipo: key,
          ids: [d.id],
          descripcion: d.descripcion || '',
          caracteristicas: caracs
        });
      }
    });
    return Array.from(map.values());
  };

  const handleDescripcionChange = (key, value) => {
    setEdiciones(prev => ({
      ...prev,
      [key]: { ...prev[key], descripcion: value }
    }));
  };

  const agregarCaracteristica = (key) => {
    const nueva = (nuevasCaracteristicas[key] || '').trim();
    if (nueva) {
      setEdiciones(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          caracteristicas: [...prev[key].caracteristicas, { carac: nueva }]
        }
      }));
      setNuevasCaracteristicas(prev => ({ ...prev, [key]: '' }));
    }
  };

  const eliminarCaracteristica = (key, idx) => {
    setEdiciones(prev => {
      const nuevoCaracs = prev[key].caracteristicas.filter((_, i) => i !== idx);
      return {
        ...prev,
        [key]: { ...prev[key], caracteristicas: nuevoCaracs }
      };
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    waitAlert();
    const payload = Object.keys(ediciones).map(key => {
      const original = data.dispositivos.find(d => d.id === ediciones[key].id);

      const descOriginal = (original?.descripcion || '').trim();
      const descActual = (ediciones[key].descripcion || '').trim();

      return {
        id: ediciones[key].id,
        equipo: ediciones[key].equipo,
        // ✅ Siempre manda la descripción, si no cambió, manda la original
        descripcion: descActual || descOriginal,
        caracteristicas: ediciones[key].caracteristicas.map(c => c.carac),
        empleado_id: equipoForm.empleado_id,
        area_id: equipoForm.area_id
      };
    });


    apiPostForm(`v2/rh/empleados/equipos/${equipoForm.empleado_id}`, { equipos: payload }, authUser)
      .then(() => {
        if (refresh) refresh();
        if (close) close();
        doneAlert('Dispositivos editados con éxito');
      })
      .catch(printResponseErrorAlert);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mx-0 align-items-end mb-3">
        <Col md="4" className="mb-2">
          <label>Colaborador</label>
          <select
            name="empleado_id"
            value={equipoForm.empleado_id || ''}
            disabled
            className="form-control"
          >
            <option hidden>Selecciona un colaborador</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </Col>

        <Col md="4" className="mb-2">
          <label>Área</label>
          <select
            name="area_id"
            value={equipoForm.area_id || ''}
            disabled
            className="form-control"
          >
            <option hidden>Selecciona un área</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </Col>
      </Row>

      <Row className="mx-0">
        {Object.keys(ediciones).map(key => (
          <Col md="4" key={key} className="mb-3">
            <div className="p-3 border rounded shadow-sm">
              <h6 className="mb-2">EQUIPO</h6>
              <input
                value={ediciones[key].equipo}
                disabled
                className="form-control mb-2"
              />

              <h6 className="mb-2">DESCRIPCIÓN</h6>
              <textarea
                rows="2"
                className="form-control mb-2"
                value={ediciones[key].descripcion}
                onChange={e => handleDescripcionChange(key, e.target.value)}
              />

              <h6 className="mb-2">CARACTERÍSTICAS</h6>
              {(ediciones[key].caracteristicas || []).map((item, idx) => (
                <div key={idx} className="d-flex align-items-center mb-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger mr-2"
                    onClick={() => eliminarCaracteristica(key, idx)}
                  >
                    X
                  </button>
                  <span>{item.carac}</span>
                </div>
              ))}

              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nueva característica"
                value={nuevasCaracteristicas[key] || ''}
                onChange={e =>
                  setNuevasCaracteristicas(prev => ({
                    ...prev,
                    [key]: e.target.value
                  }))
                }
              />
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => agregarCaracteristica(key)}
              >
                + AGREGAR
              </button>
            </div>
          </Col>
        ))}
      </Row>

      <div className="text-right mt-3">
        <button type="submit" className="btn btn-primary">GUARDAR CAMBIOS</button>
      </div>
    </Form>
  );
}
