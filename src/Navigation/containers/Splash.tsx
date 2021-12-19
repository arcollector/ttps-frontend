import { Dimmer, Loader } from "semantic-ui-react";
import "../Guest/styles/Guest.scss";
import LogoAuth from "../Guest/assets/logo.png";
import BackgroundApp from "../Guest/assets/background-medico.jpg";

type Props = {
  isLoading: boolean;
  children?: React.ReactNode;
};

export function Splash(props: Props) {
  return (
    <div className="auth" style={{ backgroundImage: `url(${BackgroundApp})` }}>
      <div className="auth__dark" />
      <div className="auth__box">
        <div className="auth__box__logo">
          <img src={LogoAuth} alt="logo" />
        </div>

        {props.isLoading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          props.children
        )}
      </div>
    </div>
  );
}
