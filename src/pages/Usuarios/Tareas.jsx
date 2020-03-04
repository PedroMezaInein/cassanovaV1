import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
import { Modal } from '../../components/singles'
import swal from 'sweetalert'
class Tareas extends Component{
    constructor(props){
        super(props)
    }

    state = {
        columns:[],
        user : ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url
        });
        if(!tareas)
            history.push('/')
        this.getTareasAxios()
    }

    // Sets

    setTareas = columns => {
        this.setState({
            ... this.state,
            columns
        })
    }

    // Dragable
    onDragEnd = result => {
        const { destination, source, draggableId } = result
        
        console.log('destination',destination)
        console.log('source',source)
        console.log('draggableId',draggableId)

        if(!destination)
            return;
        
        if( destination.droppableId === source.droppableId &&
            destination.index === source.index )
            return;
        
        const _source = {
            grupo: source.droppableId,
            index: source.index
        }
        
        const _destination = {
            grupo: destination.droppableId,
            index: destination.index
        }

        const task = draggableId

        this.reordeingTasksAxios(_source, _destination, task)

    }

    // Handle Buttons

    // Handle add Button
    handleAddButton = id => {
        
    }

    // Axios
    async getTareasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas', { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                this.setState({
                    user: user
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    async reordeingTasksAxios(source, destination, task){
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'user/tareas/order', {source, destination, task}, { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                const { data : { user : user } } = response
                this.setState({
                    user: user
                })
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    swal({
                        title: '¡Ups!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    })
                }else{
                    swal({
                        title: '¡Ups!',
                        text: 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups!',
                text: 'Ocurrió un error desconocido, intenta de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        })
    }

    render(){
        const { columns, user } = this.state
        return(
            <Layout { ...this.props}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="row mx-0">
                        {
                            columns.map((column) => {
                                return(
                                    <div key={column.id} className="col-md-6 col-lg-3 px-3">
                                        <Column handleAddButton={this.handleAddButton} column={column} id={user.id} tareas={column.tareas} />
                                    </div>
                                )
                                
                            })
                        }
                    </div>
                </DragDropContext>
                <Modal>
                    
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Tareas);