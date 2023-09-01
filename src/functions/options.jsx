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

export function getEstados (){
    return [
        { name: "Aguascalientes", value: "Aguascalientes", label: "Aguascalientes" },
        { name: "Baja California", value: "Baja California", label: "Baja California" },
        { name: "Baja California Sur", value: "Baja California Sur", label: "Baja California Sur" },
        { name: "Campeche", value: "Campeche", label: "Campeche" },
        { name: "Chiapas", value: "Chiapas", label: "Chiapas" },
        { name: "Chihuahua", value: "Chihuahua", label: "Chihuahua" },
        { name: "Ciudad de México", value: "Ciudad de México", label: "Ciudad de México" },
        { name: "Coahuila", value: "Coahuila", label: "Coahuila" },
        { name: "Colima", value: "Colima", label: "Colima" },
        { name: "Durango", value: "Durango", label: "Durango" },
        { name: "Estado de México", value: "Estado de México", label: "Estado de México" },
        { name: "Guanajuato", value: "Guanajuato", label: "Guanajuato" },
        { name: "Guerrero", value: "Guerrero", label: "Guerrero" },
        { name: "Hidalgo", value: "Hidalgo", label: "Hidalgo" },
        { name: "Jalisco", value: "Jalisco", label: "Jalisco" },
        { name: "Michoacán", value: "Michoacán", label: "Michoacán" },
        { name: "Morelos", value: "Morelos", label: "Morelos" },
        { name: "Nayarit", value: "Nayarit", label: "Nayarit" },
        { name: "Nuevo León", value: "Nuevo León", label: "Nuevo León" },
        { name: "Oaxaca", value: "Oaxaca", label: "Oaxaca" },
        { name: "Puebla", value: "Puebla", label: "Puebla" },
        { name: "Querétaro", value: "Querétaro", label: "Querétaro" },
        { name: "Quintana Roo", value: "Quintana Roo" },
        { name: "San Luis Potosí", value: "San Luis Potosí" },
        { name: "Sinaloa", value: "Sinaloa", label: "Sinaloa" },
        { name: "Sonora", value: "Sonora", label: "Sonora" },
        { name: "Tabasco", value: "Tabasco", label: "Tabasco" },
        { name: "Tamaulipas", value: "Tamaulipas", label: "Tamaulipas" },
        { name: "Tlaxcala", value: "Tlaxcala", label: "Tlaxcala" },
        { name: "Veracruz", value: "Veracruz", label: "Veracruz" },
        { name: "Yucatán", value: "Yucatán", label: "Yucatán" },
        { name: "Zacatecas", value: "Zacatecas", label: "Zacatecas" },
    ]
}
