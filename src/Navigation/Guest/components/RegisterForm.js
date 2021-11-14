import React, {useState} from 'react'
import {Button, Icon, Form, Input} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import firebase from '../../../shared/utils/Firebase';
import "firebase/compat/auth";
import {toast} from 'react-toastify';
import {validateEmail} from '../../../shared/utils/Validations';



import "../styles/RegisterForm.scss";

export default function RegisterForm(props) {
    
    const {setSelectedForm}=props;

    const [formError, setFormError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState(defaultValueForm());
    const [showPassword, setShowPassword] = useState(false);
    
    const handlerShowPassword=()=>{
        setShowPassword(!showPassword);
    }


    const changeUserName=(usuario)=>{
        
        console.log(usuario);
        usuario.updateProfile({
        displayName: formData.username
        
        }).then(() => {
        // Update successful
        // ...
        }).catch((error) => {
         
        });  
}



    
    const onChange=e=>{
        
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }
    const  onSubmit=()=>{
        console.log(formData);
        
        let errors={};
        let formOk =true;

        if(!validateEmail(formData.email)){
            errors.email=true;
            formOk=false;
            
        }
        if(formData.password.length<6){
            errors.password=true;
            formOk=false;
        }
        if(!formData.username){
            errors.username=true;
            formOk=false;
        }
        setFormError(errors);
        if(formOk){
            setIsLoading(true);
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email,formData.password)
                .then(()=>{
                    firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).then((response)=>{
                        
                        changeUserName(response.user);
                        sendVerificationEmail(response.user);

                    })
                    
                }).catch(()=>{
                    toast.error("Error al registrar el usuario");
                }).finally(()=>{
                    setIsLoading(false);
                    setSelectedForm(null);
                });
        }
    }


    

    const sendVerificationEmail= (usuario)=>{
        usuario.sendEmailVerification()
        .then(()=>{
            toast.success("Se envio un email para verificar su cuenta");

        }).catch(()=>{
            toast.error("Error al enviar el email de verificacion");
        })
    }

    return (
        <div className="register-form">
            <h1>Registrate</h1>
            <Form onSubmit={onSubmit}>
                <Form.Field>
                    <Input
                        type="text"
                        name="email"
                        placerholder="Correo Electronico"
                        icon="mail outline"
                        onChange={(e)=>onChange(e)}
                        error={formError.email}
                    />
                    {formError.email&&(
                        <span className="error-text">
                            Por favor introduce un correo electronico válido

                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input
                        type={showPassword? "text": "password"}
                        name="password"
                        placerholder="Contraseña"
                        icon={showPassword? (
                            <Icon name="eye slash outline" link onClick={handlerShowPassword}/>
                        ):(
                            <Icon name="eye" link onClick={handlerShowPassword}/>
                        )}
                        onChange={(e)=>onChange(e)}
                        error={formError.password}
                    />
                    {formError.password&&(
                        <span className="error-text">
                           La contraseña debe ser mayor a 6 caracteres

                        </span>
                    )}
                </Form.Field>
                <Form.Field>
                    <Input
                        type="text"
                        name="username"
                        placerholder="Nombre y apellido"
                        icon="user circle outline"
                        onChange={(e)=>onChange(e)}
                        error={formError.username}
                    />
                    {formError.username&&(
                        <span className="error-text">
                          Por favor, introduce un nombre

                        </span>
                    )}
                </Form.Field>
                <Button type="submit" loading={isLoading}>Continuar</Button>
                
            </Form>
            <div className="register-form__options">
                    <p onClick={()=>setSelectedForm(null)}>Volver</p>
                    <p>
                        Si ya estas registado:{""}
                        <span onClick={()=>setSelectedForm("login")}>Iniciar sessión</span>
                    </p>

                </div>
        </div>
    )
}

function defaultValueForm(){
    return{
        email:"",
        password:"",
        username:""
    }
}
