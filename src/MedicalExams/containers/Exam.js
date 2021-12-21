import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Exam.scss";
import * as actions from "../actions";
import { AuthContext } from "../../contexts";

export default function Exam() {
  const { id: examId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [exam, setExam] = useState(null);
  const [patient, setPatient] = useState(null);
  const [state, setState] = useState(null);
  const [historial, setHistorial] = useState({});
  const [sample, setSample] = useState([]);
  const [shift, setShift] = useState([]);
  const [urlConsentimiento, setUrlConsentimiento] = useState(null);
  const [urlComprobante, setUrlComprobante] = useState(null);
  const [lote, setLote] = useState(null);
  const userFromFirestore =
    React.useContext(AuthContext).getUserFromFirestore();
  const userRole = userFromFirestore?.role;

  useEffect(() => {
    (async () => {
      setExam(await actions.getExam(examId));
    })();
  }, [examId]);

  useEffect(() => {
    (async () => {
      if (exam) {
        setDoctor(await actions.getDoctor(exam.idMedic));
      }
    })();
  }, [exam]);

  useEffect(() => {
    (async () => {
      if (exam) {
        setPatient(await actions.getPatient(exam.idPatient));
      }
    })();
  }, [exam]);

  useEffect(() => {
    (async () => {
      if (exam) {
        setState(await actions.getState(exam.idState));
      }
    })();
  }, [exam]);

  useEffect(() => {
    (async () => {
      if (exam) {
        setHistorial(await actions.getHistorial(exam.id));
      }
    })();
  }, [exam]);

  useEffect(() => {
    (async () => {
      if (exam) {
        if (historial["esperandoLote"] !== undefined) {
          setSample(await actions.getMedicalSample(exam.id));
        }
      }
    })();
  }, [exam, historial]);

  useEffect(() => {
    (async () => {
      if (exam) {
        if (historial["esperandoTomaDeMuestra"] !== undefined) {
          setShift(await actions.getShift(exam.id));
        }
      }
    })();
  }, [exam, historial]);

  useEffect(() => {
    (async () => {
      if (exam) {
        if (historial["enviarConsentimiento"] !== undefined) {
          setUrlComprobante(await actions.getUrlComprobante(exam.id));
        }
      }
    })();
  }, [exam, historial]);

  useEffect(() => {
    (async () => {
      if (exam) {
        if (historial["esperandoTurno"] !== undefined) {
          setUrlConsentimiento(await actions.getUrlConsentimiento(exam.id));
        }
      }
    })();
  }, [exam, historial]);

  useEffect(() => {
    (async () => {
      if (exam) {
        if (historial["esperandoRetiroDeMuestra"] !== undefined) {
          setLote(await actions.getLote(exam.idLote));
        }
      }
    })();
  }, [exam, historial]);

  return (
    <div className="content-exam">
      {exam && historial["enviarPresupuesto"] !== "" && (
        <>
          <h2>Datos del Paciente</h2>

          <p>
            <strong>Nombre y Apellido:</strong>
            <i>
              {" "}
              {patient?.nombre} {patient?.apellido}{" "}
            </i>
          </p>
          <p>
            <strong>Dni:</strong>
            <i> {patient?.dni} </i>
          </p>
          <p>
            <strong>Telefono:</strong>
            <i> {patient?.telefono} </i>
          </p>
          <p>
            <strong>Email:</strong>
            <i> {patient?.email} </i>
          </p>

          <h2>Datos del estudio:</h2>
          <p>
            <strong>Patologia (diagnostico presuntivo): </strong>
            <i> {exam.patology} </i>
          </p>
          <p>
            <strong>Medico derivante: </strong>
            <i>
              {" "}
              {doctor?.nombre} {doctor?.apellido}{" "}
            </i>
          </p>
          <p>
            <strong>Examen medico a realizar: </strong>
            <i>{exam?.examSelected} </i>
          </p>
          <p>
            <strong>Estado actual del estudio: </strong>
            <i>{state?.name} </i>
          </p>

          <h2>Historial:</h2>
          {historial["enviarPresupuesto"] !== undefined && (
            <>
              <h5>Creacion del estudio medico</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["enviarPresupuesto"]?.employee}{" "}
                <strong> fecha: </strong>
                <i>
                  {historial["enviarPresupuesto"]?.day}-
                  {historial["enviarPresupuesto"]?.month}-
                  {historial["enviarPresupuesto"]?.year}
                </i>
              </p>
            </>
          )}
          {historial["esperandoComprobante"] !== undefined && (
            <>
              <h5>Envio de presupuesto</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoComprobante"]?.employee}{" "}
                <strong> fecha: </strong>
                {historial["esperandoComprobante"]?.day}-
                {historial["esperandoComprobante"]?.month}-
                {historial["esperandoComprobante"]?.year}
              </p>
              <p>
                <strong>Precio: </strong>
                {exam.price}
              </p>
            </>
          )}
          {historial["enviarConsentimiento"] !== undefined && (
            <>
              <h5>Carga de comprobante de pago</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["enviarConsentimiento"]?.employee}{" "}
                <strong> fecha: </strong>
                {historial["enviarConsentimiento"]?.day}-
                {historial["enviarConsentimiento"]?.month}-
                {historial["enviarConsentimiento"]?.year}
              </p>
              <p>
                <a target="_blank" rel="noreferrer" href={urlComprobante}>
                  Ver comprobante de pago
                </a>
              </p>
            </>
          )}
          {historial["esperandoConsentimiento"] !== undefined && (
            <>
              <h5>Envio de consentimiento informado</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoConsentimiento"]?.employee}{" "}
                <strong> fecha: </strong>
                {historial["esperandoConsentimiento"]?.day}-
                {historial["esperandoConsentimiento"]?.month}-
                {historial["esperandoConsentimiento"]?.year}
              </p>
            </>
          )}
          {historial["esperandoTurno"] !== undefined && (
            <>
              <h5>Carga de consentimiento informado</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoTurno"]?.employee}{" "}
                <strong> fecha: </strong>
                {historial["esperandoTurno"]?.day}-
                {historial["esperandoTurno"]?.month}-
                {historial["esperandoTurno"]?.year}
              </p>
              <p>
                <a target="_blank" rel="noreferrer" href={urlConsentimiento}>
                  Ver consentimiento informado
                </a>
              </p>
            </>
          )}
          {historial["esperandoTomaDeMuestra"] !== undefined && (
            <>
              <h5>Reserva de un turno</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoTomaDeMuestra"]?.employee}{" "}
                <strong> fecha: </strong>
                {historial["esperandoTomaDeMuestra"]?.day}-
                {historial["esperandoTomaDeMuestra"]?.month}-
                {historial["esperandoTomaDeMuestra"]?.year}
              </p>
              <p>
                <strong>Fecha del turno: </strong> <i>{shift?.date}</i>{" "}
                <strong> Hora: </strong>
                <i>{shift?.hour}</i>
              </p>
            </>
          )}
          {userRole !== "patient" && historial["esperandoLote"] !== undefined && (
            <>
              <h5>Extraccion de la muestra</h5>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoLote"]?.employee} <strong> fecha: </strong>
                {historial["esperandoLote"]?.day}-
                {historial["esperandoLote"]?.month}-
                {historial["esperandoLote"]?.year}
              </p>
              <p>
                <strong>Cantidad de ml: </strong> <i>{sample?.cantMl}</i>{" "}
                <strong> Freezer: </strong>
                <i>{sample?.freezer}</i>
              </p>
            </>
          )}
          {userRole !== "patient" &&
            historial["esperandoRetiroDeMuestra"] !== undefined && (
              <>
                <h5>Conformacion del lote de muestras</h5>
                <p>
                  <strong>Realizado por:</strong>{" "}
                  {historial["esperandoRetiroDeMuestra"]?.employee}{" "}
                  <strong> fecha: </strong>
                  {historial["esperandoRetiroDeMuestra"]?.day}-
                  {historial["esperandoRetiroDeMuestra"]?.month}-
                  {historial["esperandoRetiroDeMuestra"]?.year}
                </p>
                <p>
                  <a href={`/lote/${lote?.id}`}>Ver lote</a>
                </p>
              </>
            )}
          {userRole !== "patient" &&
            historial["esperandoInterpretacion"] !== undefined &&
            lote?.urlResultado !== "" && (
              <>
                <h5>Llegada de resultados de la muestra</h5>
                <p>
                  <strong>Realizado por:</strong> {lote?.userResultado}{" "}
                  <strong> fecha: </strong>
                  {lote?.fechaResultado}
                </p>
                <p>
                  <a href={lote?.urlResultado}>Ver Resultado</a>
                </p>
              </>
            )}
          {userRole === "patient" && (
            <>
              <h5>Esperando resultado</h5>
              <h6>Extraccion de la muestra</h6>
              <p>
                <strong>Realizado por:</strong>{" "}
                {historial["esperandoLote"]?.employee} <strong> fecha: </strong>
                {historial["esperandoLote"]?.day}-
                {historial["esperandoLote"]?.month}-
                {historial["esperandoLote"]?.year}
              </p>
              <p>
                <strong>Cantidad de ml: </strong> <i>{sample?.cantMl}</i>{" "}
              </p>
            </>
          )}
          {/*
            TODO
              mostrar al paciente los datos que hacen a esperando resultado
              mostrar estado finalizado que mostrara el texto del estado interpretacion del resultado
          */}
        </>
      )}
    </div>
  );
}
