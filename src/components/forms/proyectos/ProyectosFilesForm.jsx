import React, { Component } from 'react'
import { FileInput } from '../../form-components'

class ProyectosFilesForm extends Component{
    const { form, onChangeAdjunto, clearFiles, ... props } = this.props
    render(){
        return(
            <div className="row mx-0">
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Cotización"
                        value = {form.adjuntos.cotizacion.value}
                        name = "cotizacion"
                        id = "cotizacion"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.cotizacion.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Comprobante de pagos"
                        value = {form.adjuntos.comprobantePagos.value}
                        name = "comprobantePagos"
                        id = "comprobantePagos"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.comprobantePagos.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Catálogo de conceptos"
                        value = {form.adjuntos.catalogoConceptos.value}
                        name = "catalogoConceptos"
                        id = "catalogoConceptos"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.catalogoConceptos.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Programas de obra"
                        value = {form.adjuntos.programasObra.value}
                        name = "programasObra"
                        id = "programasObra"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.programasObra.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Descripción de los trabajos"
                        value = {form.adjuntos.descripcion.value}
                        name = "descripcion"
                        id = "descripcion"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.descripcion.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Levantanmiento"
                        value = {form.adjuntos.levantamientos.value}
                        name = "levantamientos"
                        id = "levantamientos"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.levantamientos.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Fotos durante"
                        value = {form.adjuntos.fotosDurante.value}
                        name = "fotosDurante"
                        id = "fotosDurante"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.fotosDurante.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Fotos fin"
                        value = {form.adjuntos.fotosFin.value}
                        name = "fotosFin"
                        id = "fotosFin"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.fotosFin.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Planos"
                        value = {form.adjuntos.planos.value}
                        name = "planos"
                        id = "planos"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.planos.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Render"
                        value = {form.adjuntos.renders.value}
                        name = "renders"
                        id = "renders"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.renders.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Fichas técnicas"
                        value = {form.adjuntos.fichasTecnicas.value}
                        name = "fichasTecnicas"
                        id = "fichasTecnicas"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.fichasTecnicas.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Dictámenes y memorias de cálculo"
                        value = {form.adjuntos.dictamenes.value}
                        name = "dictamenes"
                        id = "dictamenes"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.dictamenes.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Consignas de mantenimiento"
                        value = {form.adjuntos.mantenimiento.value}
                        name = "mantenimiento"
                        id = "mantenimiento"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.mantenimiento.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Moodboard"
                        value = {form.adjuntos.moodboard.value}
                        name = "moodboard"
                        id = "moodboard"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.moodboard.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Diseños aprobados por cliente"
                        value = {form.adjuntos.diseñosAprobados.value}
                        name = "diseñosAprobados"
                        id = "diseñosAprobados"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.diseñosAprobados.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-6">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Garantía de vicios ocultos"
                        value = {form.adjuntos.garantia.value}
                        name = "garantia"
                        id = "garantia"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.garantia.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
                <div className="col-md-12">
                    <FileInput 
                        onChangeAdjunto = { onChangeAdjunto } 
                        placeholder = "Contratos"
                        value = {form.adjuntos.contratos.value}
                        name = "contratos"
                        id = "contratos"
                        accept = "image/*, application/pdf" 
                        files = { form.adjuntos.contratos.files }
                        deleteAdjunto = { clearFiles }
                        multiple
                        />
                </div>
            </div>
        )
    }
}

export default ProyectosFilesForm