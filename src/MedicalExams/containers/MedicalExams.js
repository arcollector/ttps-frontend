import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Label, Divider } from "semantic-ui-react";
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
  const [exams, setExams] = useState([]);
  const [states, setStates] = useState({});
  const [filterStates, setFilterStates] = useState({
    enviarPresupuesto: [],
    esperandoComprobante: [],
    enviarConsentimiento: [],
    esperandoConsentimiento: [],
    esperandoTurno: [],
    esperandoTomaDeMuestra: [],
    esperandoResultado: [],
    esperandoRetiroDeMuestra: [],
    esperandoLote: [],
    enLote: [],
    esperandoInterpretacion: [],
    resultadoEntregado: [],
    finalizado: [],
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
        enviarPresupuesto: [],
        esperandoComprobante: [],
        enviarConsentimiento: [],
        esperandoConsentimiento: [],
        esperandoTurno: [],
        esperandoTomaDeMuestra: [],
        // este estado no existe
        esperandoResultado: [],
        esperandoRetiroDeMuestra: [],
        esperandoLote: [],
        enLote: [],
        esperandoInterpretacion: [],
        resultadoEntregado: [],
        finalizado: [],
      };
      const exams = await actions.getExams(idPatient);
      exams.forEach((exam) => {
        if (exam.idState in statesAsDict) {
          filters[statesAsDict[exam.idState].name].push(exam);
        }
      });
      setFilterStates({ ...filters });
      setExams(exams);
      setStates(statesAsDict);
    })();
  }, [reloading, idPatient, userRole]);

  useEffect(() => {
    if (userRole === "patient") {
      const compressedStates = [
        "esperandoResultado",
        "esperandoRetiroDeMuestra",
        "esperandoLote",
        "enLote",
        "esperandoInterpretacion",
        "resultadoEntregado",
      ];
      const examsCompressed = [];
      exams.forEach((exam) => {
        if (
          exam.idState in states &&
          exam.idPatient === userFromFirestore.idPatient
        ) {
          const stateName = states[exam.idState].name;
          if (compressedStates.includes(stateName)) {
            examsCompressed.push({
              id: exam.id,
              examSelected: exam.examSelected,
              idMedic: exam.idMedic,
              idPatient: exam.idPatient,
            });
          }
        }
      });
      setFilterStates((v) => ({ ...v, esperandoResultado: examsCompressed }));
    }
  }, [exams, states, userRole]);

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
      // este estado es de mentira
      {
        value: "esperandoResultado",
        label: "Estudios esperando resultado",
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
      "enviarPresupuesto",
      "esperandoComprobante",
      "enviarConsentimiento",
      "esperandoConsentimiento",
      "esperandoTurno",
      "esperandoTomaDeMuestra",
      // este estado no existe
      "esperandoResultado",
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
    return visibleStates.filter(({ value }) => value !== "todos");
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

      {visibleStatesMenosTodos.map(({ value: exams }, i) => (
        <Fragment key={i}>
          {exams === "enviarPresupuesto" &&
            (viewFilter.estado === "enviarPresupuesto" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios que requieren enviar presupuesto
              </Divider>
            )}

          {exams === "enviarConsentimiento" &&
            (viewFilter.estado === "enviarConsentimiento" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios que requieren enviar consentimiento para su firma
              </Divider>
            )}

          {exams === "esperandoComprobante" &&
            (viewFilter.estado === "esperandoComprobante" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>Estudios impagos</Divider>
            )}

          {exams === "esperandoConsentimiento" &&
            (viewFilter.estado === "esperandoConsentimiento" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios que esperan recibir consentimiento firmado{" "}
              </Divider>
            )}

          {exams === "esperandoTurno" &&
            (viewFilter.estado === "esperandoTurno" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>Estudios sin turno </Divider>
            )}

          {exams === "esperandoTomaDeMuestra" &&
            (viewFilter.estado === "esperandoTomaDeMuestra" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios a la espera de la toma de muestra{" "}
              </Divider>
            )}

          {exams === "esperandoRetiroDeMuestra" &&
            (viewFilter.estado === "esperandoRetiroDeMuestra" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios a la espera del retiro de muestra{" "}
              </Divider>
            )}

          {userRole === "patient" &&
            exams === "esperandoResultado" &&
            (viewFilter.estado === "esperandoResultado" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>Estudios esperando resultado </Divider>
            )}

          {exams === "esperandoLote" &&
            (viewFilter.estado === "esperandoLote" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios a la espera de lote de muestras{" "}
              </Divider>
            )}

          {exams === "esperandoInterpretacion" &&
            (viewFilter.estado === "esperandoInterpretacion" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios a la espera de interpretacion de resultados{" "}
              </Divider>
            )}

          {exams === "resultadoEntregado" &&
            (viewFilter.estado === "resultadoEntregado" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>
                Estudios que requieren envio de resultado a medico derivante{" "}
              </Divider>
            )}

          {exams === "finalizado" &&
            (viewFilter.estado === "finalizado" ||
              viewFilter.estado === "todos") && (
              <Divider horizontal>Estudios finalizados </Divider>
            )}

          <div className="section-state">
            {filterStates[exams].length === 0 && <div></div>}
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
