import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { login } from '../../redux/reducers/auth_user';
import axios from 'axios';
import { URL_DEV, EMAIL } from '../../constants';
import { validateAlert, errorAlert, printResponseErrorAlert, doneAlert, waitAlert } from '../../functions/alert';
import { InputLEmail } from '../../components/form-components';
import { Tab, Form } from 'react-bootstrap';
import WOW from 'wowjs';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const PasswordField = ({
  label = 'Contraseña',
  name,
  value,
  onChange,
  error = '',
  helperText = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <TextField
      fullWidth
      type={showPassword ? 'text' : 'password'}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      variant="outlined"
      size="small"
      margin="normal"
      error={Boolean(error)}
      helperText={error || helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={toggleShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};



const LoginForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', emailfp: '', password2: '', token: '' });
  const [error, setError] = useState({});

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
    const params = new URLSearchParams(location.search);
    const token = params.get('token') || '';
    if (token) {
      setForm(prev => ({ ...prev, token }));
      setTab('nueva');
    }
    initLocalStorage();
  }, []);

  const initLocalStorage = () => {
    if (!localStorage.getItem('activeKeyTabModulo')) localStorage.setItem('activeKeyTabModulo', 'Repse');
    if (!localStorage.getItem('activeKeyTabColaboradores')) localStorage.setItem('activeKeyTabColaboradores', 'administrativo');
    checkLocalStorageSize();
  };

  const checkLocalStorageSize = () => {
    const maxSize = 5 * 1024 * 1024;
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) total += localStorage[key].length;
    }
    if (total > maxSize) {
      console.warn('Exceso en localStorage, limpiando...');
      ['access_token', 'user', 'modulos', 'departamento'].forEach(k => localStorage.removeItem(k));
    }
  };

  const validateEmail = email =>
    !email ? 'No dejes este campo vacío.' :
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) ? 'Correo electrónico no válido.' : '';

  const validatePassword = pwd => {
    if (!pwd) return 'No dejes este campo vacío.';
    if (pwd.length < 8) return 'Debe tener al menos 8 caracteres.';
    if (!/[a-z]/.test(pwd)) return 'Debe incluir minúsculas.';
    if (!/[A-Z]/.test(pwd)) return 'Debe incluir mayúsculas.';
    if (!/[0-9]/.test(pwd)) return 'Debe incluir números.';
    if (!/[!@#$%^&*()_\-+=]/.test(pwd)) return 'Debe incluir símbolos.';
    return '';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let formatted = value;
    let newError = { ...error };

    switch (name) {
      case 'email':
      case 'emailfp':
        formatted = value.toLowerCase(); // Correos en minúscula
        newError[name] = validateEmail(formatted);
        break;

      case 'nombre':
      case 'apellido':
        formatted = value.toUpperCase(); // Mayúsculas para nombres/apellidos
        break;

      case 'password':
      case 'password2':
        // Se respeta la combinación de mayúsculas/minúsculas
        newError[name] = validatePassword(value);
        break;

      default:
        break;
    }

    setForm(prev => ({ ...prev, [name]: formatted }));
    setError(newError);
  };

  const handleLogin = async e => {
    e.preventDefault();
    waitAlert();
    try {
      const res = await axios.post(`${URL_DEV}user/login`, form);
      const { access_token, user, modulos, departamento } = res.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('modulos', JSON.stringify(modulos));
      localStorage.setItem('departamento', JSON.stringify(departamento));

      dispatch(login({ access_token, user, modulos, departamento }));

      if (!user.permisos || user.permisos.length === 0) {
        history.push('/login');
      } else {
        const prioridad = ['calendario-tareas','mi-proyecto', 'tareas', 'crm'];
        // let arreglo = ['calendario-tareas', 'mi-proyecto', 'crm', 'tareas', 'te-escuchamos', 'cuestionario-satisfaccion', 'incidencias', 'directorio'];

        console.log(modulos)
        const permisoPrioritario = prioridad.reduce((acc, slug) => {
        if (acc) return acc;
        return user.permisos.find(p => p.modulo.slug === slug);
        }, null);

        if (permisoPrioritario) {
        history.push(permisoPrioritario.modulo.url);
        } else if (user.permisos.length > 0) {
        history.push(user.permisos[0].modulo.url); // fallback
        } else {
        history.push('/login'); // sin permisos válidos
        }
      }
    } catch (err) {
      errorAlert('Correo o contraseña incorrectos.');
    }
  };

  const sendForgotPassword = async () => {
    const emailError = validateEmail(form.emailfp);

    console.log(emailError)
    if (emailError) return setError({ ...error, emailfp: emailError });

    waitAlert();
    try {
      await axios.post(`${URL_DEV}password`, { emailfp: form.emailfp });
      doneAlert('Revisa tu correo para restablecer tu contraseña.');
    } catch (err) {
      printResponseErrorAlert(err);
    }
  };

  const sendNewPassword = async () => {

    const errors = {
      password: validatePassword(form.password),
      password2: validatePassword(form.password2)
    };
    console.log(errors)
        console.log(form)


    if (form.password !== form.password2) errors.password2 = 'Las contraseñas no coinciden';

    if (errors.password || errors.password2) return setError(errors);

    try {
      await axios.post(`${URL_DEV}password/restaurar`, { password: form.password,password2: form.password2, token: form.token });
      doneAlert('Contraseña actualizada.');
        console.log('Redirigiendo al login...');
        handleTabChange('login'); // 👈 esto regresa al tab de inicio de sesión
    } catch (err) {
      printResponseErrorAlert(err);
    }
  };

  const handleTabChange = nextTab => {
    setTab(nextTab);
    setForm({ email: '', password: '', password2: '', emailfp: '', token: form.token });
    setError({});
  };

  return (
    <Tab.Container activeKey={tab}>
      <Tab.Content>
        {/* LOGIN */}
        <Tab.Pane eventKey="login">
          <Form id="form-login" onSubmit={e => { e.preventDefault(); validateAlert(handleLogin, e, 'form-login'); }}>
            <h3 className="text-center mb-4">INICIAR SESIÓN</h3>
            <InputLEmail name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" error={error} requirevalidation={1} patterns={EMAIL} />
              <PasswordField
                name="password"
                label="Contraseña"
                value={form.password}
                onChange={handleChange}
                error={error.password}
              />           
               <div className="text-right text-muted cursor-pointer" onClick={() => handleTabChange('recuperar')}>
              ¿Olvidaste tu contraseña?
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary" type="submit">Iniciar Sesión</button>
            </div>
          </Form>
        </Tab.Pane>

        {/* RECUPERAR */}
        <Tab.Pane eventKey="recuperar">
          <Form id="form-forgotP" onSubmit={(e) => {
            e.preventDefault();
            sendForgotPassword();
          }}>
            <h3 className="text-center mb-4">Recuperar contraseña</h3>
            <InputLEmail 
              name="emailfp" 
              value={form.emailfp} 
              onChange={handleChange} 
              placeholder="Correo electrónico" 
              error={error} 
              requirevalidation={1} 
              patterns={EMAIL} 
            />
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-light-im" type="submit">Enviar</button>
              <button className="btn btn-light-danger" type="button" onClick={() => handleTabChange('login')}>Cancelar</button>
            </div>
          </Form>
        </Tab.Pane>


        {/* NUEVA CONTRASEÑA */}
        <Tab.Pane eventKey="nueva">
          <Form id="form-nueva">
            <h3 className="text-center mb-4">Nueva Contraseña</h3>
            <PasswordField
              name="password"
              label="Nueva contraseña"
              value={form.password}
              onChange={handleChange}
              error={error.password}
             />

            <PasswordField
              name="password2"
              label="Repite la contraseña"
              value={form.password2}
              onChange={handleChange}
              error={error.password2}
            />
            <div className="text-center mt-3">
              <button className="btn btn-light-im" type="button" onClick={sendNewPassword}>Enviar</button>
            </div>
          </Form>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

export default LoginForm;
