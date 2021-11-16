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
export function optionsEsquemas (){
    return [
        { name: 'Esquema 1', value: 'esquema_1', label: 'Esquema 1'},
        { name: 'Esquema 2', value: 'esquema_2', label: 'Esquema 2'},
        { name: 'Esquema 3', value: 'esquema_3', label: 'Esquema 3'}
    ]
}
export function optionsTipoLicencias (){
    return [
        { name: 'antivirus', value: 'antivirus', label: 'Antivirus'},
        { name: 'software', value: 'software', label: 'Software'}
    ]
}
export function optionsPeriodoPagos (){
    return [
        { name: 'semanal', value: 'semanal', label: 'Semanal'},
        { name: 'quincenal', value: 'quincenal', label: 'Quincenal'},
        { name: 'mensual', value: 'mensual', label: 'Mensual'},
        { name: 'semestral', value: 'semestral', label: 'Semestral'},
        { name: 'anual', value: 'anual', label: 'Anual'},
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