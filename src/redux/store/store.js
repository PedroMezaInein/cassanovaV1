export const loadState = () => {
    try {
        console.log()
        const serializedData = localStorage.getItem('state')
        console.log('state serializedData', serializedData)
        if (serializedData === null){
            return null // Si no existe el state en el local storage devolvemos undefined para que cargue el state inicial que hayamos definido
        }
        return JSON.parse(serializedData) // Si encontramos con exito nuestro storage lo devolvemos.
    } catch (error) {
        return null // Si ocurre algun error, devuelvo undefined para cargar el state inicial.
    }
}

export const saveState = (state) => {
    console.log('STATE ON LOCALSTORAGE')
    
    try {
        let serializedData = JSON.stringify(state)
        localStorage.setItem('state', serializedData)
        console.log('TRY')
        console.log(localStorage)
        console.log(state)

        
    } catch (error) {
        console.log(error, '?ERROR')
	    return null
    }
}