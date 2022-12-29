import React from 'react'

export default function Adjuntos(props) {
    return (
        <>
            <div>
                <span>
                    Subir cotizacion
                </span>
                <input
                    type="file"
                    multiple
                />
            </div>

            <div>
                <span>
                    Orden de compra
                </span>
                <input
                    type="file"
                    multiple
                />
            </div>

        </>
    )
}