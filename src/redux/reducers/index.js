import AuthUser from './auth_user'
import Formulario from './formulario'
import Opciones from './options'
import { combineReducers } from 'redux'

export default combineReducers({
    authUser: AuthUser,
    formulario: Formulario,
    opciones: Opciones,
})