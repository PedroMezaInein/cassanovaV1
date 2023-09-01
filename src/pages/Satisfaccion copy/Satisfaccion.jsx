import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { openWizard1, openWizard2, openWizard3 } from '../../functions/wizard'
import { InputGray, ReactSelectSearchGray, Button} from '../../components/form-components'
import { validateAlert ,waitAlert, doneAlert, printResponseErrorAlert } from '../../functions/alert'
import { apiPostForm, catchErrors } from '../../functions/api'
import Swal from 'sweetalert2'

class Satisfaccion extends Component {
    state = {
        formeditado: 0,
        form: {
            pregunta1: '1.-EN GENERAL, ¿CÓMO CALIFICARÍAS LA CALIDAD DE TU EXPERIENCIA CON INFRAESTRUCTURA MÉDICA?',
            pregunta2: '2.-¿Cómo evaluarías la atención que le dimos para resolver tus necesidades y dudas?',
            pregunta3: '3.-EN GENERAL, ¿CÓMO CALIFICARÍAS EL TIEMPO ASIGNADO PARA ATENDER TU PROYECTO Y DUDAS?',
            pregunta4: '4.-¿Qué tan satisfech@ te encuentras con la calidad en la realización de planos y renders ?',
            pregunta5: '5.-¿Qué tan posible es que contrates el servicio de construcción?',
            pregunta6: '6.-¿Cómo calificarías nuestro conocimiento sobre el sector salud?',
            pregunta7: '7.-¿Existe algún servicio adicional que te gustaría que brindara Infraestructura Médica?',
            pregunta8: '8.-¿Qué tan probable es que recomiendes a Infraestructura Médica con tus amigos, familiares o colegas?',

            respuesta1: '',
            respuesta2: '',
            respuesta3: '',
            respuesta4: '',
            respuesta41: '',
            respuesta42: '',

            respuesta5: 0 ,
            respuesta6: '',
            respuesta7: '',
            respuesta8: '',

            comen1: '',
            comen2: '',
            comen3: '',
            comen4: '',
            comen41: '',
            comen42: '',

            comen5: '',
            comen6: '',
            comen7: '',
            comen8: '',

            planos: 0,
            renders: 0,
            recomendar: 0,
            servicio:0,
        },
        options: {
            experiencia: [
                { value: 'excelente', name: 'Excelente', label: 'Excelente' },
                { value: 'positiva', name: 'Positiva', label: 'Positiva' },
                { value: 'neutral', name: 'Neutral', label: 'Neutral' },
                { value: 'negativa', name: 'Negativa', label: 'Negativa' },
                { value: 'pesima', name: 'Pésima', label: 'Pésima' }
            ],
            necesidades: [
                { value: 'excelente', name: 'Excelente', label: 'Excelente' },
                { value: 'muyBien', name: 'Muy bien', label: 'Muy bien' },
                { value: 'bien', name: 'Bien', label: 'Bien' },
                { value: 'noTanBien', name: 'No tan bien', label: 'No tan bien' },
                { value: 'nadaBien', name: 'Nada bien', label: 'Nada bien' }
            ],
            tiempo: [
                { value: 'menosTiempo', name: 'Menos tiempo de lo esperado', label: 'Menos tiempo de lo esperado' },
                { value: 'tiempoPactado', name: 'El tiempo que se pacto', label: 'El tiempo que se pacto' },
                { value: 'tiempoEsperado', name: 'El tiempo que esperaba', label: 'El tiempo que esperaba' },
                { value: 'masPactado', name: 'Un poco más tiempo de lo pactado', label: 'Un poco más tiempo de lo pactado' },
                { value: 'muchoMasPactado', name: 'Mucho más tiempo de lo pactado', label: 'Mucho más tiempo de lo pactado' }
            ],
            calidadPlanosRenders: [
                { value: 'muySatisfecho', name: 'Muy satisfech@', label: 'Muy satisfech@' },
                { value: 'satisfecho', name: 'Satisfech@', label: 'Satisfech@' },
                { value: 'neutral', name: 'Neutral', label: 'Neutral' },
                { value: 'insatisfecho', name: 'Insatisfech@', label: 'Insatisfech@' },
                { value: 'muyInsatisfecho', name: 'Muy insatisfech@', label: 'Muy insatisfech@' }
            ],
            califica: [
                { value: 'muybueno', name: 'Muy bueno', label: 'Muy bueno' },
                { value: 'bueno', name: 'Bueno', label: 'Bueno' },
                { value: 'neutral', name: 'Neutral', label: 'Neutral' },
                { value: 'malo', name: 'Malo', label: 'Malo' },
                { value: 'muymalo', name: 'Muy malo', label: 'Muy malo' }
            ]
        }
    }

    componentDidMount = () => {
        // encuesta()       
    }
    
    setButton = (value, name)=> {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    updateSelect = (value, type) => {
        const { form } = this.state
        form[type] = value
        this.setState({ ...this.state, form })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { at } = this.props
        const { form } = this.state
        form.respuesta41 = form.planos
        form.respuesta42 = form.renders
        form.respuesta8 = form.recomendar

        if(form.renders  !== 0 && form.planos !== 0 && form.recomendar !== 0 && form.servicio !== 0){
            waitAlert()
            apiPostForm(`cuestionario`, form, at).then(
                (response) => {
    
                    doneAlert(`Gracias por contestar la encuesta`, () => {  this.redirectURL() } )
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) })
           
        }else{
            let preguntas1 = form.renders !== 0 ? ' ' : 'pregunta 4 planos, '
            let preguntas2 = form.planos !== 0 ? ' ' : 'pregunta 4 renders, '
            let preguntas3 = form.recomendar !== 0 ? ' ' : 'pregunta 8, '
            let preguntas4 = form.servicio !== 0 ? ' ' : 'pregunta 5, '

            Swal.fire({
                show: true,
                // title:"! PARA TERMINAR LA ENCUESTA !",
                title: 'Oops... Contesta las preguntas de nivel de satisfacción faltantes',
                text:" " + preguntas1 + "  " +  preguntas2  + "  " + preguntas3 + "  " + preguntas4,
                icon: 'error',
                button:"aceptar",
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                  },
                  hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                  }
            });                 

        }        
    }

    redirectURL = () =>{
        window.location.assign("https://contenido.infraestructuramedica.mx/thank-you-encuesta-diseno")
    }

    setClassButtons  = (id,group) =>{
        let button = document.getElementById(id)
        const collectionButtons = document.getElementsByClassName(group);
        for (const button of collectionButtons) {
            button.classList.remove('active');
          }
        button.classList.add('active')
    }

    // setButton= (value, type) => {
    //     const { form } = this.state
    //     form[type] = value
    //     console.log(value)
    //     console.log(type)

    //     // this.setState({ ...this.state, form })
    // }

    render() {
        const { form, options, formeditado } = this.state
        let logo= 'https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/empresas/4/adjuntos/logos/Logo_IM_CMYK-01-1597874562.png'    
          const body = {
            backgroundColor: "#315694",
            width: "100%",
            height: "100%" ,
            backgroundImage: "url(https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/empresas/4/adjuntos/logos/Background-IM-encuesta.jpg)",
            fontWeight: "bold",
        }
        const centrar = {
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'o auto',

        }
         
        return (
    
    <section  style={body}>
            <div className="container">               
                <section >
                <img src={logo} alt="logo" style={{ 
                    height: '70px',
                    marginLeft: '60px',
                    marginTop: '-90px',                    
                    }} />
                 <div class="container">
                 <div class ="row">
                 <div class="col-md-3"></div>
                    <div class="col-md-6">
                        <div className="wizard wizard-3  " id="wizardP" data-wizard-state="step-f">
                            <div className="wizard-nav">                
                                <div className="wizard-steps">

                                    <div id="wizard-1" className="wizard-step pt-0" data-wizard-state="current" data-wizard-type="step"
                                        onClick={openWizard1} >
                                    </div>
                                    <div id="wizard-2" className="wizard-step pt-0" data-wizard-type="step" onClick={openWizard2}>
                                    
                                    </div>
                                    <div id="wizard-3" className="wizard-step pt-0" data-wizard-type="step" onClick={openWizard3}>
                                    </div>
                                </div>
                            </div>
                            <Form>
                            <div id="wizard-1-content" className="pb-3 " data-wizard-type="step-content" data-wizard-state="current">
                                <div className="form-group form-group-marginless row mx-0">
                                    <div class="col-md-12">                         
                                        <h1 class="text-center" style={{ color:'#CBBA8E',fontWeight: "bold" ,fontSize: "18px" }} >Encuesta de Satisfacción</h1>
                                        <p class="text-center" style={{ color:'#8BA2C5',fontSize: "14px"  }} >Con tus respuestas sabremos si estamos atendiendo a tus expectativas y cómo podremos mejorar en nuestras interacciones.</p>     
                                    </div>
                                        <div className="mb-8 px-0 h-50-encuesta mt-1">
                                            <label className="col-form-label font-weight-bold marginTop" style={{ color:'#8BA2C5',fontWeight: "bold !important",fontSize: "14px" }}> 
                                            1.- En general, ¿Cómo calificarías la calidad de tu experiencia con Infraestructura Médica?</label>
                                            <ReactSelectSearchGray
                                                placeholder='Selecciona una opción'
                                                value={form.respuesta1}
                                                defaultvalue={form.respuesta1}
                                                iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                                options={options.experiencia} 
                                                onChange={(value) => this.updateSelect(value, 'respuesta1')}
                                                messageinc='Selecciona una opción.'
                                                requirevalidation={1}

                                            />
                                            <InputGray
                                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                                as="textarea" rows="2" 
                                                placeholder="comentario "
                                                value={form.comen1} 
                                                name="comen1"
                                                onChange={this.onChange}
                                                customclass="px-2"
                                            />
                                                </div>
                                            <div className="mb-0 px-0">
                                                <label id='aa' className="col-form-label font-weight-bold  marginTop" style={{ color:'#8BA2C5' ,fontWeight: "bold !important",fontSize: "14px"}}>
                                                    2. ¿Cómo evaluarías la atención que le dimos para resolver tus necesidades y dudas?</label>
                                                <ReactSelectSearchGray
                                                    placeholder='Selecciona una opción'
                                                    defaultvalue={form.respuesta2}
                                                    iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                                    options={options.necesidades}
                                                    onChange={(value) => this.updateSelect(value, 'respuesta2')}
                                                    messageinc='Selecciona una opción.'
                                                    requirevalidation={1}
                                                />
                                                <InputGray
                                                    withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0} formeditado={formeditado}
                                                    as="textarea" rows="2" 
                                                    value={form.comen2} name="comen2"
                                                    onChange={this.onChange}
                                                    placeholder="comentario"
                                                    customclass="px-2"
                                                />
                                            </div>
                                            <div className=" mb-0 px-0"><br />
                                                <label id='aa' className="col-form-label font-weight-bold  marginTop" style={{ color:'#8BA2C5' ,fontWeight: "bold !important",fontSize: "14px"}}>
                                                 3.- En general, ¿Cómo calificarías el tiempo asignado para atender tu proyecto y dudas?</label>
                                                <ReactSelectSearchGray
                                                    placeholder='Selecciona una opción'
                                                    defaultvalue={form.respuesta3}
                                                    iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                                    options={options.tiempo}
                                                    onChange={(value) => this.updateSelect(value, 'respuesta3')}
                                                    messageinc='Selecciona una opción.'
                                                    requirevalidation={1}
                                                />
                                                <InputGray
                                                    withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                                    as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen3} name="comen3"
                                                    onChange={this.onChange}
                                                    customclass="px-2"
                                                />
                                            </div>                          
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center border-top mt-3 pt-3 stay-bottom">
                                        <div className="mr-2"></div>
                                        <div>
                                            <button type="button" className="btn btn-primary font-weight-bold text-uppercase"
                                                onClick={openWizard2} data-wizard-type="action-next">
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">

                    <div className="form-group form-group-marginless row mx-0">

                    <div className=" mb-0 px-0">
                        <label id='aa' className="col-form-label font-weight-bold " style={{ color:'#8BA2C5',fontWeight: "bold !important",fontSize: "14px" }}>
                             4.- ¿Qué tan satisfech@ te encuentras con la calidad en la realización de planos y renders?</label>
                             <ReactSelectSearchGray
                                placeholder='Selecciona una opción'
                                defaultvalue={form.respuesta4}
                                iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                options={options.calidadPlanosRenders}
                                onChange={(value) => this.updateSelect(value, 'respuesta4')}
                                messageinc='Selecciona una opción.'
                                requirevalidation={1}
                            />
                             <br></br>
                             <label htmlFor=""> <strong>PLANOS</strong></label>
                            <span  className='d-flex text-center justify-content-between  titulo-sugerencias' style={{ color:'#8BA2C5', marginTop: '5px', }}>
                                <p>Menos insatisfech@</p>
                                <p >Muy insatisfech@</p></span>
                                
                            <div class='container aa'   >

                                <div className='d-flex cinco-botones' style={centrar} >
                                    <button onClick={()=>{
                                        this.setButton(1, 'planos')
                                        this.setClassButtons('1Planos','planos')
                                    }}  type="button" id='1Planos' class="btn btn-outline-red planos"  style={{width:'90px',borderColor: '#ff0000'}}>1</button>
                                    <button onClick={()=>{
                                        this.setButton(2, 'planos')
                                        this.setClassButtons('2Planos','planos')
                                    }} type="button" id='2Planos' class="btn btn-outline-red planos"  style={{width:'90px',borderColor: '#ff0000'}} >2</button>
                                    <button onClick={()=>{
                                        this.setButton(3, 'planos')
                                        this.setClassButtons('3Planos','planos')
                                    }} type="button" id='3Planos' class="btn btn-outline-orange planos" style={{width:'90px' }}>3</button>
                                    <button onClick={()=>{
                                        this.setButton(4, 'planos')
                                        this.setClassButtons('4Planos','planos')
                                    }} type="button" id='4Planos' class="btn btn-outline-orange planos" style={{width:'90px' }}>4</button>
                                    <button onClick={()=>{
                                        this.setButton(5, 'planos')
                                        this.setClassButtons('5Planos','planos')
                                    }} type="button" id='5Planos' class="btn btn-outline-green planos" style={{width:'90px' }}>5</button>
                                </div>
                            </div>

                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen41} name="comen41"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>
                        <div className=" mb-10 px-0">
                        <label id='aa' className="col-form-label font-weight-bold "  style={{ color:'#8BA2C5',fontWeight: "bold !important",fontSize: "14px" }}>
                         Renders</label><br></br>
                            <span className='d-flex justify-content-between  titulo-sugerencias' style={{ color:'#8BA2C5', }}>
                                <p>Muy insatisfech@</p>
                                <p>Muy satisfech@</p></span>
                            <div class="container" >
                                <div className='d-flex cinco2' style={centrar}>
                                    <button onClick={()=>{
                                        this.setButton(1, 'renders') 
                                        this.setClassButtons('1Renders','renders')
                                    }} type="button" id='1Renders' class="btn btn-outline-red renders"  style={{width:'90px',borderColor: '#ff0000'}} >1</button>
                                    <button onClick={()=>{
                                        this.setButton(2, 'renders')
                                        this.setClassButtons('2Renders','renders')
                                    }} type="button" id='2Renders' class="btn btn-outline-red renders"  style={{width:'90px',borderColor: '#ff0000'}} >2</button>
                                    <button onClick={()=>{
                                        this.setButton(3, 'renders')
                                        this.setClassButtons('3Renders','renders')
                                    }} type="button" id='3Renders' class="btn btn-outline-orange renders"  style={{width:'90px'}}>3</button>
                                    <button onClick={()=>{
                                        this.setButton(4, 'renders')
                                        this.setClassButtons('4Renders','renders')
                                    }} type="button" id='4Renders' class="btn btn-outline-orange renders" style={{width:'90px'}}>4</button>
                                    <button onClick={()=>{
                                        this.setButton(5, 'renders')
                                        this.setClassButtons('5Renders','renders')
                                    }} type="button" id='5Renders' class="btn btn-outline-green renders" style={{width:'90px'}}>5</button>
                                </div>
                            </div>
                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen42} name="comen42"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>
                        <div className="mb-0 px-0">
                            <label id='aa' className="col-form-label font-weight-bold "  style={{ color:'#8BA2C5',fontWeight: "bold !important",fontSize: "14px" }}>
                              5. ¿Qué tan posible es que contrates el servicio de construcción?
                                </label><br></br><br></br>
                            <span className='d-flex justify-content-between  titulo-sugerencias' style={{ color:'#8BA2C5', }}>
                                <p>Nada Posible</p>
                                <p>Muy Posible</p></span>
                           <div class="container" >
                           <div className='d-flex once-botones' style={centrar}>
                                <button  onClick={()=>{
                                    this.setButton(1, 'servicio')
                                    this.setClassButtons('1Servicio','servicio')
                                }}  type="button" id='1Servicio' class="btn btn-outline-red servicio" style={{width:'90px',borderColor: '#ff0000'}}>1</button>
                                <button onClick={()=>{
                                    this.setButton(2, 'servicio')
                                    this.setClassButtons('2Servicio','servicio')
                                }} type="button" id='2Servicio' class="btn btn-outline-red servicio" style={{width:'90px',borderColor: '#ff0000'}}>2</button>
                                <button onClick={()=>{
                                    this.setButton(3, 'servicio')
                                    this.setClassButtons('3Servicio','servicio')
                                }} type="button" id='3Servicio' class="btn btn btn-outline-orange  servicio" style={{width:'90px'}} >3</button>
                                <button onClick={()=>{
                                    this.setButton(4, 'servicio')
                                    this.setClassButtons('4Servicio','servicio')
                                }} type="button" id='4Servicio' class="btn btn-outline-orange servicio" style={{width:'90px'}}>4</button>
                                <button onClick={()=>{
                                    this.setButton(5, 'servicio')
                                    this.setClassButtons('5Servicio','servicio')
                                }} type="button" id='5Servicio' class="btn btn-outline-green servicio" style={{width:'90px'}}>5</button>
                            
                            </div>

                           </div>
                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen5} name="comen5"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>
                        
                    </div>
                    <div className="d-flex justify-content-center align-items-center border-top mt-3 pt-3 stay-bottom  ">
                        <div className="mr-2">
                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={openWizard1}
                                data-wizard-type="action-prev">
                                Anterior
                            </button>
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={openWizard3}
                                data-wizard-type="action-next">
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
                <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">

                    <div className="form-group form-group-marginless row mx-0">
                        <div className=" mb-10 px-0">
                            <label id='aa' className="col-form-label font-weight-bold  marginTop" style={{ color:'#8BA2C5' ,fontWeight: "bold !important",fontSize: "14px"}}>
                                6. ¿Cómo calificarías nuestro conocimiento sobre el sector salud?</label>
                            <ReactSelectSearchGray
                                placeholder='Selecciona una opción'
                                defaultvalue={form.respuesta6}
                                iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                options={options.califica}
                                onChange={(value) => this.updateSelect(value, 'respuesta6')}
                                messageinc='Selecciona una opción.'
                                requirevalidation={1}
                            />
                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen6} name="comen6"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>       
                        <div className=" mb-10 px-0">
                            <label id='aa' className="col-form-label font-weight-bold  marginTop" style={{ color:'#8BA2C5' ,fontWeight: "bold !important",fontSize: "14px"}}>
                            7. ¿Existe algún servicio adicional que te gustaría que brindará Infraestructura Médica?</label>
                            <ReactSelectSearchGray
                                placeholder='Selecciona una opción'
                                defaultvalue={form.respuesta7}
                                iconclass='las la-user icon-xl' /* requirevalidation={0} */
                                options={options.califica}
                                onChange={(value) => this.updateSelect(value, 'respuesta7')}
                                messageinc='Selecciona una opción.'
                                requirevalidation={1}
                            />
                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen7} name="comen7"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>       
                
                        <div className="mb-0 px-0">
                            <label id='aa' className="col-form-label font-weight-bold "  style={{ color:'#8BA2C5',fontWeight: "bold !important",fontSize: "14px" }}>
                                8. ¿Qué tan probable es que recomiendes a Infraestructura Médica con tus amigos, familiares o colegas?
                                </label><br></br><br></br>
                            <span className='d-flex justify-content-between  titulo-sugerencias' style={{ color:'#8BA2C5', }}>
                                <p>Nada Posible</p>
                                <p>Muy Posible</p></span>
                           <div class="container" >
                           <div className='d-flex once-botones' style={centrar}>
                                <button  onClick={()=>{
                                    this.setButton(1, 'recomendar')
                                    this.setClassButtons('1Recomendar','recomendar')
                                }}  type="button" id='1Recomendar' class="btn btn-outline-red recomendar" style={{width:'50px',borderColor: '#ff0000'}}>1</button>
                                <button onClick={()=>{
                                    this.setButton(2, 'recomendar')
                                    this.setClassButtons('2Recomendar','recomendar')
                                }} type="button" id='2Recomendar' class="btn btn-outline-red recomendar" style={{width:'50px',borderColor: '#ff0000'}}>2</button>
                                <button onClick={()=>{
                                    this.setButton(3, 'recomendar')
                                    this.setClassButtons('3Recomendar','recomendar')
                                }} type="button" id='3Recomendar' class="btn btn-outline-red recomendar" style={{width:'50px',borderColor: '#ff0000'}}>3</button>
                                <button onClick={()=>{
                                    this.setButton(4, 'recomendar')
                                    this.setClassButtons('4Recomendar','recomendar')
                                }} type="button" id='4Recomendar' class="btn btn-outline-orange recomendar" style={{width:'50px'}}>4</button>
                                <button onClick={()=>{
                                    this.setButton(5, 'recomendar')
                                    this.setClassButtons('5Recomendar','recomendar')
                                }} type="button" id='5Recomendar' class="btn btn-outline-orange recomendar" style={{width:'50px'}}>5</button>
                                <button onClick={()=>{
                                    this.setButton(6, 'recomendar')
                                    this.setClassButtons('6Recomendar','recomendar')
                                }} type="button" id='6Recomendar' class="btn btn-outline-orange recomendar" style={{width:'50px'}}>6</button>
                                <button onClick={()=>{
                                    this.setButton(7, 'recomendar')
                                    this.setClassButtons('7Recomendar','recomendar')
                                }} type="button"  id='7Recomendar'class="btn btn-outline-orange recomendar" style={{width:'50px'}}>7</button>
                                <button onClick={()=>{
                                    this.setButton(8, 'recomendar')
                                    this.setClassButtons('8Recomendar','recomendar')
                                }} type="button" id='8Recomendar' class="btn btn-outline-orange recomendar" style={{width:'50px'}}>8</button>
                                <button onClick={()=>{
                                    this.setButton(9, 'recomendar')
                                    this.setClassButtons('9Recomendar','recomendar')
                                }} type="button" id='9Recomendar' class="btn btn-outline-green recomendar" style={{width:'50px'}}>9</button>
                                <button onClick={()=>{
                                    this.setButton(10, 'recomendar')
                                    this.setClassButtons('10Recomendar','recomendar')
                                }} type="button" id='10Recomendar' class="btn btn-outline-green recomendar" style={{width:'50px'}}>10</button>
                            </div>

                           </div>
                            <InputGray
                                withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                as="textarea" placeholder="COMENTARIOS" rows="2" value={form.comen8} name="comen8"
                                onChange={this.onChange}
                                customclass="px-2"
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center border-top mt-3 pt-3 stay-bottom  ">
                        <div className="mr-2">
                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={openWizard2}
                                data-wizard-type="action-prev">
                                Anterior
                            </button>
                        </div>
                        <div>
                            <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" text="ENVIAR"
                                onClick={(e) => {
                                    e.preventDefault();
                                     validateAlert(this.onSubmit, e, 'wizard-3-content')

                                }} />
                        </div>
                    </div>
                </div>

                            </Form>

                        </div>
                    </div>
                </div>

                 </div>
                </section>
            </div>
          
    </section>
       
        )
    }
}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Satisfaccion)