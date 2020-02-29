import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, URL_ASSETS } from '../../constants'
import { Column } from '../../components/draggable'
import { DragDropContext } from 'react-beautiful-dnd'
class Tareas extends Component{
    constructor(props){
        super(props)
    }

    state = {
        columns:[]
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
    }

    // Axios
    async getTareasAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user/tareas', { headers: {Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { data : { tareas : columns } } = response
                this.setTareas(columns)
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    console.log('No fue posible iniciar sesión')
                }
            }
        ).catch((error) => {
            console.log(error, 'catch')
        })
    }

    render(){
        const { columns } = this.state
        return(
            <Layout { ...this.props}>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="row mx-0">
                        {
                            columns.map((column) => {
                                return(
                                    <div key={column.id} className="col-md-4 px-3">
                                        <Column column={column} tareas={column.tareas} />
                                    </div>
                                )
                                
                            })
                        }
                    </div>
                </DragDropContext>
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