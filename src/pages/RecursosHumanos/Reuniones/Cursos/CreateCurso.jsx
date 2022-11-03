import React from 'react';

export default function CreateCurso() {
    return (
        <div>
            <form>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del curso</label>
                    <input type="text" className="form-control" id="nombre" placeholder="Nombre del curso" />
                </div>    
                <div className="form-group">
                    <label>Plataforma</label>
                    <select className="form-control">
                        <option hidden>Elige o selecciona la plataforma</option>
                        <option>plataforma 1</option>
                        <option>plataforma 2</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Sala</label>
                    <select className="form-control">
                        <option hidden>Elegir sala reservada</option>
                        <option>Reserva 1</option>
                        <option>Reserva 2</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea className="form-control" id="descripcion" rows="3"></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">Crear</button>

            </form>    
        </div>
    )
}