import AuthUser from './auth_user'
import Formulario from './formulario'
import { combineReducers } from 'redux'

export default combineReducers({
    authUser: AuthUser,
    formulario: Formulario
})