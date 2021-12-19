import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Button, Label } from "semantic-ui-react";
import "../styles/lotes.scss";
import CargarResultado from "../components/CargarResultado";
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
            <div
              key={id}
              className="section-state"
              style={{ display: "inline" }}
            >
              <div className="contenedor-tarjeta" style={{ height: "100%" }}>
                <div className="ui card">
                  <Label horizontal style={{ width: "100%", margin: 0 }}>
                    <Icon name="archive" />
                    <small>{lote.id}</small>
                  </Label>

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
                    <Button.Group basic vertical>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => (
                        <Button
                          key={id}
                          as={Link}
                          to={`/exam/${lote[`idMedicExam${id}`]}`}
                        >
                          Estudio {id}{" "}
                          <small>({lote[`idMedicExam${id}`]})</small>
                        </Button>
                      ))}
                    </Button.Group>
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
