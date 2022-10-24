import React from 'react';

export default function AplicantesCurso() {
    return (
        <div>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Claudio</td>
                        <td>Herrera</td>
                        <td>claudio@inein.mx</td>
                        <td>
                            <button className='btn btn-success'>Aceptar</button>
                            <button className='btn btn-danger'>Rechazar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}