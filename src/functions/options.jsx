export function optionsFases (){
    return [
        { name: 'Fase 1', value: 'fase1', label: 'Fase 1' },
        { name: 'Fase 2', value: 'fase2', label: 'Fase 2' },
        { name: 'Fase 3', value: 'fase3', label: 'Fase 3' }
    ]
}
export function optionsPresupuestos (){
    return [
        { name: 'Conceptos', value: 'Conceptos', label: 'Conceptos' },
        { name: 'Volumetrías', value: 'Volumetrías', label: 'Volumetrías' },
        { name: 'Costos', value: 'Costos', label: 'Costos' },
        { name: 'En revisión', value: 'En revisión', label: 'En revisión' },
        { name: 'Utilidad', value: 'Utilidad', label: 'Utilidad' },
        { name: 'En espera', value: 'En espera', label: 'En espera' },
        { name: 'Aceptado', value: 'Aceptado', label: 'Aceptado' },
        { name: 'Rechazado', value: 'Rechazado', label: 'Rechazado' }
    ]
}

export function transformOptions (options){
    options = options ? options : []
    options.map((value) => {
        value.label = value.name
        return ''
    });
    return options
}