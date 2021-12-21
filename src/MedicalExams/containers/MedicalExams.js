import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Label } from "semantic-ui-react";
import "../styles/MedicalExams.scss";
import EnviarPresupuesto from "./EnviarPresupuesto";
import SubirComprobante from "./SubirComprobante";
import EnviarConsentimiento from "./EnviarConsentimiento";
import SubirConsentimiento from "./SubirConsentimiento";
import ReservarTurno from "./ReservarTurno";
import TomarMuestra from "./TomarMuestra";
import RetirarMuestra from "./RetirarMuestra";
import { actions as insurersActions } from "../../Insurers";
import CargarInterpretacion from "./CargarInterpretacion";
import EnviarResultado from "./EnviarResultado";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export function MedicalExams(props) {
  const { user } = props;

  const [doctors, setDoctors] = useState(null);
  const [patients, setPatients] = useState(null);
  const [filterStates, setFilterStates] = useState({
        "enviarPresupuesto": [],
        "esperandoComprobante": [],
        "enviarConsentimiento": [],
        "esperandoConsentimiento": [],
        "esperandoTurno": [],
        "esperandoTomaDeMuestra": [],
        "esperandoRetiroDeMuestra": [],
        "esperandoLote": [],
        "enLote": [],
        "esperandoInterpretacion": [],
        "resultadoEntregado": [],
        "finalizado": [],
      });
  const [reloading, setReloading] = useState(false);
  const [viewFilter, setViewFilter] = useState({ estado: "todos" });
  const [insurers, setInsurers] = React.useState([]);
  const userFromFirestore =
    React.useContext(AuthContext).getUserFromFirestore();
  const userRole = userFromFirestore?.role;
  const { idPatient } = userFromFirestore;

  useEffect(() => {
    (async () => {
      const statesAsDict = await actions.getStatesAsDict();
      const filters = {
        "enviarPresupuesto": [],
        "esperandoComprobante": [],
        "enviarConsentimiento": [],
        "esperandoConsentimiento": [],
        "esperandoTurno": [],
        "esperandoTomaDeMuestra": [],
        "esperandoRetiroDeMuestra": [],
        "esperandoLote": [],
        "enLote": [],
        "esperandoInterpretacion": [],
        "resultadoEntregado": [],
        "finalizado": [],
      }
      const exams = await actions.getExams(idPatient);
      exams.forEach((exam) => {
        if (exam.idState in statesAsDict) {
          filters[statesAsDict[exam.idState].name].push(exam);
        }
      });
      setFilterStates({ ...filters });
    })();
  }, [reloading, idPatient]);

  useEffect(() => {
    (async () => {
      const list = await actions.getDoctors();
      setDoctors(
        list.reduce(
          (acc, item) => ({
            ...acc,
            [item.id]: `${item.nombre} ${item.apellido}`,
          }),
          {}
        )
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (userRole === "patient" && idPatient) {
        const patient = await actions.getPatient(idPatient);
        setPatients({ [idPatient]: patient });
      } else {
        setPatients(await actions.getPatientsAsDict());
      }
    })();
  }, [userRole, idPatient]);

  useEffect(() => {
    (async () => {
      const insurers = await insurersActions.getAllInsurers();
      setInsurers(
        insurers.reduce(
          (acc, insurer) => ({
            ...acc,
            [insurer.id]: insurer,
          }),
          {}
        )
      );
    })();
  }, []);

  const viewOnChange = (e) => {
    setViewFilter({ estado: e.target.value });
  };

  const allStates = React.useMemo(
    () => [
      { value: "todos", label: "Todos" },
      { value: "enviarPresupuesto", label: "Estudios sin presupuesto enviado" },
      {
        value: "esperandoComprobante",
        label: "Estudios sin recibir comprobante de pago",
      },
      {
        value: "enviarConsentimiento",
        label: "Estudios sin enviar consentimiento",
      },
      {
        value: "esperandoConsentimiento",
        label: "Estudios sin recibir consentimiento informado",
      },
      { value: "esperandoTurno", label: "Estudios sin turno" },
      {
        value: "esperandoTomaDeMuestra",
        label: "Estudios sin toma de muestra",
      },
      {
        value: "esperandoRetiroDeMuestra",
        label: "Estudios con muestra sin retirar",
      },
      { value: "esperandoLote", label: "Estudios esperando lote" },
      {
        value: "esperandoInterpretacion",
        label: "Estudios esperando interpretacion de resultados",
      },
      {
        value: "resultadoEntregado",
        label: "Estudios con interpretacion de resultados",
      },
      {
        value: "finalizado",
        label: "Estudios finalizados",
      },
    ],
    []
  );
  const statesForPatients = React.useMemo(
    () => [
      "todos",
      "esperandoComprobante",
      "esperandoConsentimiento",
      "esperandoTurno",
      "esperandoTomaDeMuestra",
      "finalizado",
    ],
    []
  );
  const visibleStates = React.useMemo(
    () =>
      allStates.filter(({ value }) => {
        if (userRole === "patient") {
          return statesForPatients.includes(value);
        }
        return true;
      }),
    [allStates, statesForPatients, userRole]
  );

  const visibleStatesMenosTodos = React.useMemo(() => {
    return visibleStates.filter(({ value }) => value !== 'todos');
  }, [visibleStates]);

  return (
    <div className="estudios-content">
      <select
        name="estado"
        onChange={viewOnChange}
        className="ui fluid dropdown"
        value={viewFilter.estado}
      >
        {visibleStates.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {visibleStatesMenosTodos.map(({ value : exams }, i) => (
          <Fragment key={i}>
            {exams === "enviarPresupuesto" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "enviarPresupuesto" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios que requieren enviar presupuesto</h3>
              )}

            {exams === "enviarConsentimiento" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "enviarConsentimiento" ||
                viewFilter.estado === "todos") && (
                <h3>
                  Estudios que requieren enviar consentimiento para su firma
                </h3>
              )}

            {exams === "esperandoComprobante" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoComprobante" ||
                viewFilter.estado === "todos") && <h3>Estudios impagos</h3>}

            {exams === "esperandoConsentimiento" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoConsentimiento" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios que esperan recibir consentimiento firmado </h3>
              )}

            {exams === "esperandoTurno" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoTurno" ||
                viewFilter.estado === "todos") && <h3>Estudios sin turno </h3>}

            {exams === "esperandoTomaDeMuestra" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoTomaDeMuestra" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios a la espera de la toma de muestra </h3>
              )}

            {exams === "esperandoRetiroDeMuestra" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoRetiroDeMuestra" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios a la espera del retiro de muestra </h3>
              )}

            {exams === "esperandoLote" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoLote" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios a la espera de lote de muestras </h3>
              )}

            {exams === "esperandoInterpretacion" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "esperandoInterpretacion" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios a la espera de interpretacion de resultados </h3>
              )}

            {exams === "resultadoEntregado" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "resultadoEntregado" ||
                viewFilter.estado === "todos") && (
                <h3>
                  Estudios que requieren envio de resultado a medico derivante{" "}
                </h3>
              )}

            {exams === "finalizado" &&
              filterStates[exams].length > 0 &&
              (viewFilter.estado === "finalizado" ||
                viewFilter.estado === "todos") && (
                <h3>Estudios finalizados </h3>
              )}

            <div className="section-state">
              {filterStates[exams].map((exam, i) => (
                <Fragment key={i}>
                  {(viewFilter.estado === exams ||
                    viewFilter.estado === "todos") && (
                    <div className="contenedor-tarjeta">
                      <div className="ui card">
                        <Label horizontal style={{ width: "100%", margin: 0 }}>
                          <Icon name="file outline" />
                          <small>{exam.id}</small>
                        </Label>

                        <div className="header">
                          {patients &&
                            `${patients[exam.idPatient].nombre} ${
                              patients[exam.idPatient].apellido
                            }`}
                          <Button
                            as={Link}
                            primary
                            size="mini"
                            to={`/exam/${exam.id}`}
                          >
                            <Icon name="eye" />
                            Ver Detalles
                          </Button>
                        </div>

                        <div className="content">
                          <h4 className="ui sub header">Estudios</h4>
                          <ol className="ui list">
                            <li value="*" key={exam.examSelected}>
                              {exam.examSelected}
                            </li>
                          </ol>
                          <h4 className="ui sub header">Medico Derivante:</h4>
                          <ol className="ui list">
                            {doctors && (
                              <li key="medic" value="*">
                                {doctors[exam.idMedic]}
                              </li>
                            )}
                          </ol>
                        </div>

                        {exams === "enviarPresupuesto" && patients && (
                          <EnviarPresupuesto
                            patient={patients[exam.idPatient]}
                            patientInsurer={
                              patients[exam.idPatient]
                                ? insurers[patients[exam.idPatient].idInsurer]
                                : null
                            }
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "enviarConsentimiento" && (
                          <EnviarConsentimiento
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoComprobante" && (
                          <SubirComprobante
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoConsentimiento" && (
                          <SubirConsentimiento
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoTurno" && (
                          <ReservarTurno
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoTomaDeMuestra" && (
                          <TomarMuestra
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoRetiroDeMuestra" && (
                          <RetirarMuestra
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "esperandoInterpretacion" && (
                          <CargarInterpretacion
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "resultadoEntregado" && (
                          <EnviarResultado
                            user={user}
                            exam={exam}
                            setReloading={setReloading}
                          />
                        )}

                        {exams === "finalizado" && (
                          <h3 className="end">FINALIZADO</h3>
                        )}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
    </div>
  );
}
