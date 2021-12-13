import { Segment, Message } from "semantic-ui-react";
import { Patients } from "../../Patients";

export function Register() {
  return (
    <Segment>
      <Message>
        <Message.Header size="huge">
          Por favor complete los siguientes campos para poder registrarse como
          paciente en nuestro sitio
        </Message.Header>
        <p>
          Para registrar a un menor de edad, se pediran tambien los datos un
          tutor
        </p>
      </Message>

      <Patients.Create isGuestMode />
    </Segment>
  );
}
