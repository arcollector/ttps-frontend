import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import AuthOptions from "../Guest/components/AuthOptions";
import LoginForm from "../Guest/components/LoginForm";
import RegisterForm from "../Guest/components/RegisterForm";
import { Auth } from "../../Auth";
import { NotFound } from "../../NotFound";

import BackgroundApp from "../Guest/assets/background-medico.jpg";
import LogoAuth from "../Guest/assets/logo.png";

import "../Guest/styles/Guest.scss";

export function Guest() {
  const [selectedForm, setSelectedForm] = useState<
    "auth" | "login" | "register"
  >("auth");

  const handlerForm = (form: typeof selectedForm) => {
    setSelectedForm(form);
  };

  return (
    <Switch>
      <Route path="/" exact>
        <div
          className="auth"
          style={{ backgroundImage: `url(${BackgroundApp})` }}
        >
          <div className="auth__dark" />
          <div className="auth__box">
            <div className="auth__box__logo">
              <img src={LogoAuth} alt="logo" />
            </div>

            {selectedForm === "login" && (
              <LoginForm setSelectedForm={handlerForm} />
            )}
            {selectedForm === "register" && (
              <RegisterForm setSelectedForm={handlerForm} />
            )}
            {selectedForm === "auth" && (
              <AuthOptions setSelectedForm={handlerForm} />
            )}
          </div>
        </div>
      </Route>

      <Route path="/registro" exact>
        <Auth.Register />
      </Route>

      <Route path="/registro-clave" exact>
        <Auth.RegisterPassword />
      </Route>

      <Route path="/ingresar" exact>
        <Auth.Access />
      </Route>

      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}
