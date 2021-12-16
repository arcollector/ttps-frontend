import React, { useEffect, useState } from "react";
import { Form, Button, TextArea } from "semantic-ui-react";
import { toast } from "react-toastify";
import * as actions from "../actions";

export default function CargarInterpretacionForm(props) {
  const { exam, user, setReloading, setShowModal } = props;

  const [doctorSelected, setDoctorSelected] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultSelected, setResultSelected] = useState("positivo");
  const [formData, setFormData] = useState({ descripcion: "" });

  useEffect(() => {
    (async () => {
      setDoctors(await actions.getMedicosInformantes());
    })();
  }, []);
  useEffect(() => {
    if (doctors.length) {
      setDoctorSelected(doctors[0].id);
    }
  }, [doctors]);

  const handlerDoctorSelected = (e) => {
    setDoctorSelected(e.target.value);
  };
  const handlerResultSelected = (e) => {
    setResultSelected(e.target.value);
  };

  const onChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    if (formData.descripcion === "") {
      toast.warning("Debe ingresar la descripcion del resultado");
    } else {
      try {
        await actions.setResultadoEntregado(
          exam.id,
          user.displayName,
          formData.descripcion,
          doctorSelected,
          resultSelected
        );
      } catch (e) {
      } finally {
        setIsLoading(false);
        setReloading((v) => !v);
        setShowModal(false);
      }
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <div>Medico Informante:</div>

        <select
          multiple={false}
          onChange={handlerDoctorSelected}
          name="medicoInf"
          className="ui fluid normal dropdown"
        >
          {doctors?.map((doc) => {
            return (
              <option
                key={doc?.id}
                value={doc?.id}
              >{`${doc?.nombre} ${doc?.apellido}`}</option>
            );
          })}
        </select>
      </Form.Field>
      <Form.Field>
        <div>Resultado:</div>
        <select
          multiple={false}
          onChange={handlerResultSelected}
          name="resultado"
          className="ui fluid normal dropdown"
        >
          <option value="positivo">Positivo</option>
          <option value="negativo">Negativo</option>
        </select>
      </Form.Field>
      <Form.Field>
        <div>Descripcion del resultado:</div>
        <TextArea
          name="descripcion"
          placerholder="descripcion"
          onChange={onChange}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Guardar Interpretacion
      </Button>
    </Form>
  );
}
