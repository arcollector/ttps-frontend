import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import AuthOptions from "../Guest/components/AuthOptions";
import LoginForm from "../Guest/components/LoginForm";
import RegisterForm from "../Guest/components/RegisterForm";
import { Auth } from "../../Auth";
import { NotFound } from "../../NotFound";
import { Splash } from "../containers/Splash";

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
        <Splash isLoading={false}>
          <>
            {selectedForm === "login" && (
              <LoginForm setSelectedForm={handlerForm} />
            )}
            {selectedForm === "register" && (
              <RegisterForm setSelectedForm={handlerForm} />
            )}
            {selectedForm === "auth" && (
              <AuthOptions setSelectedForm={handlerForm} />
            )}
          </>
        </Splash>
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
