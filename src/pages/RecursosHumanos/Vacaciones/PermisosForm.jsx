import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Form, Card } from 'react-bootstrap'
import { InputGray, FileInput, Button, RangeCalendar, SelectHorario } from '../../../components/form-components'


class PermisosForm extends Component {
  state = {
    formeditado: 0,
    form: {
      fechas: { start: null, end: null },
      nombre: this.props.authUser.user.name,
      //  nombre: '',
      hora_salida: 0,
      hora_entrada: 0,
      minuto_entrada:0,
      minuto_salida:0,
      fechaInicio: new Date(),
      fechaFin: new Date(),
      tipo:'',
      lider:'',
      adjuntos: {
        permisos: {
          value: '',
          placeholder: 'Permiso',
          files: []
        },
      }
    }
  }

  componentDidMount() {

  }

  onChange = e => {
    const { form } = this.state
    const { name, value } = e.target
    form[name] = value
    this.setState({...this.state, form})
}

  onChangeRange = range => {
    const { startDate, endDate } = range
    const { form } = this.state
    form.fechaInicio = startDate
    form.fechaFin = endDate
    this.setState({ ...this.state, form })
  }
  onChangeAdjunto = e => {
    const { value, files } = e.target
    const { form } = this.state
    form.adjuntos.value = value
    form.adjuntos.files = []
    files.forEach((file, index) => {
      form.adjuntos.files.push({
        name: file.name,
        file: file,
        url: URL.createObjectURL(file),
        key: index
      })
    })
    this.setState({ ...this.state, form })
  }

  render() {
    const { form } = this.state
    // const { access_token } = this.props
    return (
      <Layout active='rh'  {...this.props}>
        <Card className="card-custom">
          <Card.Header>
            <div className="card-title">
              <h3 className="card-label"> Nuevo permiso </h3>
            </div>
          </Card.Header>
          <Card.Body className="pt-0">
            <Form id='form-permisos'
              onSubmit={
                //  (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-permisos') }
                (e) => { console.log('asdasd') }
              }>
              <div className="form-group row form-group-marginless">
                <div className="col-md-4 offset-md-1 text-center align-self-center">
                  <div className="col-md-6 text-center">
                    <label className="col-form-label font-weight-bold text-dark-60">Fecha</label><br />
                    <RangeCalendar start = { form.fechas.start } end = { form.fechas.end } 
                        onChange = { ( value ) => { this.onChange( { target: { name: 'fechas', value: { start: value.startDate, end: value.endDate } } }) } }  />
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="form-group row form-group-marginless">
                    {/* <div className="col-md-6 ">
                    <SelectSearchGray options={options.usuarios} placeholder='Nombre' value={this.state.form.nombre}
                      onChange={(value) => { this.updateSelect(value, 'empresa') }} withtaglabel={1} withtextlabel={1}
                      withicon={1} iconclass="far fa-building" messageinc="Incorrecto. Ingresa el nombre"
                    />
                  </div> */}
                    <div className="col-md-6">
                      <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0}
                        requirevalidation={1}
                        value={this.state.form.nombre}
                        name="nombre" onChange={this.onChangeNombre} placeholder="NOMBRE"
                        iconclass="far fa-file-alt icon-lg text-dark-50" messageinc="Incorrecto. ingresa el tipo nomrbe"
                      />
                    </div>
                    <div className="col-md-6">
                      <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0}
                        requirevalidation={1}
                        name="tipo"
                        value={form.tipo}
                        onChange={this.onChange}
                        placeholder="TIPO DE PERMISO"
                        iconclass="far fa-file-alt icon-lg text-dark-50" messageinc="Incorrecto. ingresa el tipo de permiso"
                      />
                    </div>
                    <div className="col-md-6 ">
                      <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1}
                        name='lider' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='LÍDER INMEDIATO' onChange={this.onChange}
                        value={form.lider} messageinc="Incorrecto. Ingresa el líder inmediato" />
                    </div>
                    <div className="col-md-6 ">
                      <label className="col-form-label font-weight-bolder text-dark-60">Entrada tardía</label>
                      <div className="mb-3 row d-flex justify-content-center">
                        <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_entrada, name: 'minuto_entrada' }}
                          hora={{ value: form.hora_entrada, name: 'hora_entrada' }} allhours={true} width='w-60' />
                      </div>
                    </div>
                    <div className="col-md-6 ">
                      <label className="col-form-label font-weight-bolder text-dark-60">Salida anticipada</label>
                      <div className="mb-3 row d-flex justify-content-center">
                        <SelectHorario onChange={this.onChange} minuto={{ value: form.minuto_salida, name: 'minuto_fin' }}
                          hora={{ value: form.hora_salida, name: 'hora_salida' }} allhours={true} width='w-60' />
                      </div>
                      <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} requirevalidation={0} as='textarea' rows='1'
                        withformgroup={0} name='descripcion' placeholder='DESCRIPCIÓN' value={form.descripcion} onChange={this.onChange}
                        withicon={0} customclass="px-2" />
                    </div>
                    <div className="col-md-6 text-center">
                      <FileInput requirevalidation={0} onChangeAdjunto={this.onChangeAdjunto}
                        placeholder={form.adjuntos.permisos.placeholder} value={form.adjuntos.permisos.value} name='adjuntoPermiso' id='adjuntoPermiso'
                        files={form.adjuntos.permisos.files} deleteAdjunto={this.clearFiles} multiple
                        classinput='file-input' accept='*/*' iconclass='flaticon2-clip-symbol text-primary'
                        classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                      // formeditado = { formeditado }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end border-top mt-3 pt-3">
                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                ///type='submit'
                 text="ENVIAR"
                 onClick={()=> { console.log(this.state.form)}}
                  />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Layout>
    )
  }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PermisosForm);