import React from 'react';

export default function AplicantesCurso(props) {
    const { closeModal, rh } = props;
    return (
        <div>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Estatus</th>
                        {rh? null : <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Claudio</td>
                        <td>claudio@inein.mx</td>
                        <td>Pendie</td>
                        {rh ? null :
                        <td>
                            <button className='btn btn-success'>Aceptar</button>
                            <button className='btn btn-danger'>Rechazar</button>
                        </td>
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    )
}