import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Image,
  List,
  Icon,
  TextArea,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import { Patients, helpers as patientsHelpers } from "../../Patients";
import { actions as insurersActions } from "../../Insurers";
import { Pathologies } from "../components/Pathologies";
import * as actions from "../actions";
import "../styles/MedicalExamNewForm.scss";
import examen from "../assets/virus1.jpg";
import examen2 from "../assets/virus2.jpg";
import examen3 from "../assets/virus3.jpg";
import examen4 from "../assets/virus4.jpg";
import examen5 from "../assets/virus5.jpg";

export function MedicalExamNewForm(props) {
  const { setShowModal, user } = props;

  const [presupuesto, setPresupuesto] = useState(0);
  const [formData, setFormData] = useState(initialValues());
  const [seleccionado, setSeleccionado] = useState(initialState());
  const [isLoading, setIsLoading] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [prices, setPrices] = useState(null);
  const [doctorSelected, setDoctorSelected] = useState("");
  const [insurers, setInsurers] = React.useState([]);
  const [patientInsurer, setPatientInsurer] = React.useState(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    (async () => {
      setInsurers(await insurersActions.getAllInsurers());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setPrices(await actions.getPrices());
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setDoctors(await actions.getDoctors());
    })();
  }, []);

  useEffect(() => {
    if (doctors.length) {
      setDoctorSelected(doctors[0].id);
    }
  }, [doctors]);

  const onSubmit = async () => {
    if (!paciente) {
      toast.warning("El examen debe incluir los datos del paciente");
    } else {
      if (!formData.patologia) {
        toast.warning("El examen debe incluir una patologia");
      } else {
        if (
          seleccionado["exoma"] === "false" &&
          seleccionado["genoma"] === "false" &&
          seleccionado["carrier"] === "false" &&
          seleccionado["cariotipo"] === "false" &&
          seleccionado["array"] === "false"
        ) {
          toast.warning("Se debe seleccionar un examen medico");
        } else {
          setIsLoading(true);
          try {
            const medicExam = await actions.createMedicExam({
              idPatient: paciente.id,
              idEmployee: user.uid,
              idMedic: doctorSelected,
              patology: formData.patologia,
              exomaSelected: seleccionado["exoma"],
              genomaSelected: seleccionado["genoma"],
              carrierSelected: seleccionado["carrier"],
              cariotipoSelected: seleccionado["cariotipo"],
              arraySelected: seleccionado["array"],
              price: prices[selected],
              examSelected: selected,
            });
            let idMedicExam = medicExam.id;
            await actions.setStateEnviarPresupuesto(
              user.displayName,
              idMedicExam
            );
            toast.success("El estudio fue cargado correctamente");

            downloadPresupuestoPdf(paciente, idMedicExam);
          } catch (error) {
            console.error(error);
            toast.error("Error al guardar el estudio");
          } finally {
            setIsLoading(false);
            setFormData(initialValues());
            setShowModal(false);
          }
        }
      }
    }
  };

  const downloadPresupuestoPdf = async (paciente, idMedicExam) => {
    try {
      const res = await actions.downloadInformePdf(paciente);
      const file = new Blob([res.data], { type: "application/pdf" });
      const metadata = {
        contentType: "application/pdf",
      };
      await actions.setPresupuestoPdf(idMedicExam, file, metadata);
      const anchorLink = document.createElement("a");
      anchorLink.href = window.URL.createObjectURL(file);
      anchorLink.setAttribute("download", "prueba5.pdf");
      anchorLink.click();
      let fd = new FormData();
      fd.set("a", file);
      return fd.get("a");
    } catch (error) {
      console.error(error);
    }
  };

  const calucularPresupuesto = (e) => {
    setSelected(e.target.name);
    switch (e.target.name) {
      case "exoma":
        if (seleccionado[e.target.name] === "false") {
          setPresupuesto(presupuesto + prices[e.target.name]);
          setSeleccionado({ ...seleccionado, exoma: "true" });
        } else {
          setPresupuesto(presupuesto - prices[e.target.name]);
          setSeleccionado({ ...seleccionado, exoma: "false" });
        }

        break;
      case "genoma":
        if (seleccionado[e.target.name] === "false") {
          setPresupuesto(presupuesto + prices[e.target.name]);
          setSeleccionado({ ...seleccionado, genoma: "true" });
        } else {
          setPresupuesto(presupuesto - prices[e.target.name]);
          setSeleccionado({ ...seleccionado, genoma: "false" });
        }
        break;
      case "carrier":
        if (seleccionado[e.target.name] === "false") {
          setPresupuesto(presupuesto + prices[e.target.name]);
          setSeleccionado({ ...seleccionado, carrier: "true" });
        } else {
          setPresupuesto(presupuesto - prices[e.target.name]);
          setSeleccionado({ ...seleccionado, carrier: "false" });
        }
        break;
      case "cariotipo":
        if (seleccionado[e.target.name] === "false") {
          setPresupuesto(presupuesto + prices[e.target.name]);
          setSeleccionado({ ...seleccionado, cariotipo: "true" });
        } else {
          setPresupuesto(presupuesto - prices[e.target.name]);
          setSeleccionado({ ...seleccionado, cariotipo: "false" });
        }
        break;
      case "array":
        if (seleccionado[e.target.name] === "false") {
          setPresupuesto(presupuesto + prices[e.target.name]);
          setSeleccionado({ ...seleccionado, array: "true" });
        } else {
          setPresupuesto(presupuesto - prices[e.target.name]);
          setSeleccionado({ ...seleccionado, array: "false" });
        }
        break;
      default:
        break;
    }
  };

  const onChange = (e) => {
    setFormData((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onChangePathology = (patology) => {
    setFormData((v) => ({ ...v, patologia: patology }));
  };

  const onSearchPatient = (patient) => {
    setPaciente(patient);
  };

  useEffect(() => {
    setPatientInsurer(patientsHelpers.getPatientInsurer(paciente, insurers));
  }, [paciente, insurers]);

  const handlerDoctorSelected = (e) => {
    setDoctorSelected(e.target.value);
  };

  return (
    <Form className="add-medic-exam-form" onSubmit={onSubmit}>
      <Patients.SearchForm onSearch={onSearchPatient} />
      <div className="header-section">
        <h4>Datos del paciente</h4>
      </div>
      <div className="two-columns">
        <Form.Field>
          <div>Nombre del paciente:</div>
          <Input
            name="nompaciente"
            disabled={true}
            value={paciente?.nombre}
            placerholder="nombre del paciente"
          />
        </Form.Field>

        <Form.Field>
          <div>Apellido:</div>
          <Input
            name="apellido"
            disabled={true}
            value={paciente?.apellido}
            placerholder="nombre del paciente"
          />
        </Form.Field>
      </div>
      <div className="three-columns">
        <Form.Field>
          <div>Dni:</div>
          <Input
            name="dni"
            disabled={true}
            value={paciente?.dni}
            placerholder="dni"
          />
        </Form.Field>
        <Form.Field>
          <div>Cod Area:</div>
          <Input
            name="code"
            disabled={true}
            value={paciente?.code}
            placerholder="code"
          />
        </Form.Field>
        <Form.Field>
          <div>Telefono:</div>
          <Input
            name="telefono"
            disabled={true}
            value={paciente?.telefono}
            placerholder="telefono"
          />
        </Form.Field>
      </div>
      <Form.Field>
        <div>Correo Electronico:</div>
        <Input
          name="email"
          disabled={true}
          value={paciente?.email}
          placerholder="email"
        />
      </Form.Field>
      {patientInsurer ? (
        <>
          <Form.Field>
            <div>Nombre de la obra social:</div>
            <Input
              name="nomsoc"
              disabled={true}
              value={patientInsurer ? patientInsurer.nombre : ""}
              placerholder="nomsoc"
            />
          </Form.Field>

          <Form.Field>
            <div>Numero de la obra social:</div>
            <Input
              name="numsoc"
              disabled={true}
              value={paciente?.numsoc}
              placerholder="numsoc"
            />
          </Form.Field>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <strong>Este paciente no tiene obra social</strong>
        </div>
      )}
      <div className="header-section">
        <h4>Datos del estudio</h4>
      </div>
      <Form.Field>
        <div>Medico Derivante:</div>

        <select
          multiple={false}
          onChange={handlerDoctorSelected}
          name="medicodev"
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
        <div>Patologia (diagnostico presuntivo):</div>
        <Pathologies onChange={onChangePathology} />
      </Form.Field>
      Seleccionar Examen Medico
      <List className="patology">
        <List.Item>
          <Image avatar src={examen} />
          <List.Content>
            <List.Header as="a" name="exoma" onClick={calucularPresupuesto}>
              Exoma
            </List.Header>
            {selected === "exoma" && <Icon name="chevron circle up" />}
          </List.Content>
        </List.Item>
        <List.Item>
          <Image avatar src={examen2} />
          <List.Content>
            <List.Header as="a" name="genoma" onClick={calucularPresupuesto}>
              Genoma Mitocondrial Completo
            </List.Header>
            {selected === "genoma" && <Icon name="chevron circle up" />}
          </List.Content>
        </List.Item>
        <List.Item>
          <Image avatar src={examen3} />
          <List.Content>
            <List.Header as="a" name="carrier" onClick={calucularPresupuesto}>
              Carrier de Enfermedades Monogenicas
            </List.Header>
            {selected === "carrier" && <Icon name="chevron circle up" />}
          </List.Content>
        </List.Item>
        <List.Item>
          <Image avatar src={examen4} />
          <List.Content>
            <List.Header as="a" name="cariotipo" onClick={calucularPresupuesto}>
              Cariotipo
            </List.Header>
            {selected === "cariotipo" && <Icon name="chevron circle up" />}
          </List.Content>
        </List.Item>
        <List.Item>
          <Image avatar src={examen5} />
          <List.Content>
            <List.Header as="a" name="array" onClick={calucularPresupuesto}>
              Array CGH
            </List.Header>
            {selected === "array" && <Icon name="chevron circle up" />}
          </List.Content>
        </List.Item>
      </List>
      <h2>Presupuesto: {prices ? prices[selected] : null}</h2>
      <Button type="submit" loading={isLoading}>
        Crear Estudio Medico
      </Button>
    </Form>
  );
}

function initialValues() {
  return {
    patologia: "",
    search: "",
  };
}

function initialState() {
  return {
    exoma: "false",
    genoma: "false",
    carrier: "false",
    cariotipo: "false",
    array: "false",
  };
}

// function initialValuesPrices(){
//     const prices={};
//     return prices;
// }
