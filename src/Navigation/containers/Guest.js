import React, {useState} from 'react';

import AuthOptions from '../Guest/components/AuthOptions';
import LoginForm from '../Guest/components/LoginForm';
import RegisterForm from '../Guest/components/RegisterForm';

import BackgroundApp from '../Guest/assets/background-medico.jpg';
import LogoAuth from '../Guest/assets/logo.png';

import "../Guest/styles/Guest.scss";





export function Guest() {
    
   

    
     

    const [selectedForm, setSelectedForm] = useState(null);

    const handlerForm= ()=>{
        switch (selectedForm) {
            case "login":
                
                return <LoginForm setSelectedForm={setSelectedForm}/>;
            case "register":
                return <RegisterForm setSelectedForm={setSelectedForm}/>
            default:
                return <AuthOptions setSelectedForm={setSelectedForm}/>;
        }
    }

    return (
        <div className="auth" style={{backgroundImage: `url(${BackgroundApp})`}}>
            <div className="auth__dark" />
            <div className="auth__box">
                    <div className="auth__box__logo">
                        <img src={LogoAuth} alt="logo" />
                    </div>
                
                    {handlerForm()}
                    
            </div>
                
            
        </div>
    )
}
