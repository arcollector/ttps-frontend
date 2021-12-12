import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button } from "semantic-ui-react";
import "../styles/lotes.scss";
import CargarResultado from "./CargarResultado";
import * as actions from "../actions";

export function Lotes(props) {
  const { user } = props;
  const [lotes, setLotes] = useState(null);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    (async () => {
      setLotes(await actions.getAllLotes());
    })();
  }, [reloading]);

  return (
    <>
      <div className="estudios-content">
        {lotes?.map((lote, id) => {
          return (
            <div key={id} className="section-state">
              <div className="contenedor-tarjeta">
                <div className="ui card">
                  <div className="header">
                    {`Lote ${lote.numLote}`}

                    <Button
                      as={Link}
                      primary
                      size="mini"
                      to={`/lote/${lote.id}`}
                    >
                      <Icon name="eye" />
                      Ver Detalles
                    </Button>
                  </div>

                  <div className="content">
                    <h4 className="ui sub header">Examenes medicos:</h4>
                    <ol className="ui list">
                      <li>
                        <a href={`/exam/${lote?.idMedicExam1}`}>Estudio 1</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam2}`}>Estudio 2</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam3}`}>Estudio 3</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam4}`}>Estudio 4</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam5}`}>Estudio 5</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam6}`}>Estudio 6</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam7}`}>Estudio 7</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam8}`}>Estudio 8</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam9}`}>Estudio 9</a>
                      </li>
                      <li>
                        <a href={`/exam/${lote?.idMedicExam10}`}>Estudio 10</a>
                      </li>
                    </ol>
                  </div>

                  {lote.state === "esperandoResultado" && (
                    <CargarResultado
                      lote={lote}
                      user={user}
                      setReloading={setReloading}
                    />
                  )}
                  {lote.state === "finalizado" && (
                    <h3 className="end">FINALIZADO</h3>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
