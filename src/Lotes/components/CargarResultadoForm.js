import React, { useState } from "react";
import { Form, Input, Button, Segment } from "semantic-ui-react";
import { toast } from "react-toastify";
import * as actions from "../actions";

export default function CargarResultadoForm(props) {
  const { lote, user, setShowModal, setReloading } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    fails: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
  });

  const onSubmit = async () => {
    const lotesIdNames = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      (id) => `idMedicExam${id}`
    );
    const lotesWithFails = lotesIdNames.reduce((acc, loteKey, i) => {
      if (formData.fails[i]) {
        return [...acc, lote[loteKey]];
      }
      return acc;
    }, []);
    setIsLoading(true);
    if (formData.url === "") {
      toast.warning("Debe ingresar una url");
    } else {
      try {
        await actions.updateLotes(
          lote,
          lotesWithFails,
          formData.url,
          user.displayName
        );
      } catch (e) {
      } finally {
        setIsLoading(false);
        setReloading((v) => !v);
        setShowModal(false);
      }
    }
  };

  const onChange = (e) => {
    setFormData((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onChangeFails = (e) => {
    const id = e.target.name.split("-")[1] - 0;
    setFormData((v) => ({
      ...v,
      fails: v.fails.map((status, i) => (i + 1 === id ? !status : status)),
    }));
  };

  return (
    <Form className="add-medic-exam-form" onSubmit={onSubmit}>
      <Segment>
        <Form.Group grouped>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
            <Form.Field
              key={id}
              label={`Lote ${id} fallido?`}
              control="input"
              type="checkbox"
              name={`lote-${id}`}
              onChange={onChangeFails}
            />
          ))}
        </Form.Group>
      </Segment>

      <Form.Field>
        <div>Url del resultado:</div>
        <Input name="url" type="text" placerholder="url" onChange={onChange} />
      </Form.Field>

      <Button type="submit" loading={isLoading}>
        Guardar cambios
      </Button>
    </Form>
  );
}
