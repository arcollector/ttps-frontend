import React, { useState, useEffect } from "react";
import { Form, Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import DatePicker from "react-widgets/DatePicker";
import DropdownList from "react-widgets/DropdownList";
import moment from "moment";
import "../../Appointments/styles/AppointmentNewForm.scss";
import "react-widgets/scss/styles.scss";
import * as actions from "../actions";
moment.locale("es");

export default function ReservarTurnoForm(props) {
  const now = moment().minutes(0).seconds(0).add(1, "hours");
  const { user, setShowModal, exam, setReloading } = props;
  const [dateStart, setDateStart] = useState(now.toDate());
  const [formData, setFormData] = useState(initialValues());
  const [isLoading, setIsLoading] = useState(false);
  const [reserved, setReserved] = useState([]);
  const [reloadingShifts, setReloadingShifts] = useState(true);

  useEffect(() => {
    (async () => {
      setReserved(await actions.getShiftsReserved());
    })();
  }, [reloadingShifts]);

  const getTimeList = () => {
    const horario = now.hours(8).minutes(0).twix(now.clone().add(7, "hours"));
    horario.format({ hourFormat: "hh" });
    let iter = horario.iterate(15, "minutes");
    let turnos = [];
    while (iter.hasNext()) {
      turnos.push(iter.next().format("HH:mm"));
    }
    return turnos;
  };

  const handleDateChange = (e) => {
    setDateStart(e);
    setFormData({
      ...formData,
      date: e.toLocaleDateString(),
    });
  };

  const handleHourChange = (e) => {
    setFormData({
      ...formData,
      hour: e,
    });
  };

  const onSubmit = async () => {
    if (reserved[formData.hour + formData.date]) {
      toast.warning("El turno elegido no esta disponible");
    } else {
      setIsLoading(true);
      try {
        await actions.createShift({
          idMedicExam: exam.id,
          date: formData.date,
          hour: formData.hour,
          idPatient: exam.idPatient,
        });
        await actions.setStateEsperandoTomaDeMuestra(exam.id, user.displayName);

        toast.success("El turno fue reservado");
        setReserved({
          ...reserved,
          [formData.hour + formData.date]: true,
        });
        setReloading((v) => !v);
      } catch (e) {
        toast.error(
          "Hubo un error en la reserva del turno. Vuelva a intentarlo"
        );
      } finally {
        setIsLoading(false);
        setShowModal(false);
        setReloadingShifts((v) => !v);
      }
    }
  };

  return (
    <Form className="add-medic-exam-form" onSubmit={onSubmit}>
      <div className="header-section">
        <label>Fecha y hora del turno</label>

        <Form.Field>
          <DatePicker onChange={handleDateChange} defaultValue={dateStart} />
        </Form.Field>
        <Form.Field>
          <DropdownList
            data={getTimeList()}
            onChange={handleHourChange}
            className="w-2/5 mt-0"
          />
        </Form.Field>
      </div>
      <Button type="submit" loading={isLoading}>
        Reservar Turno
      </Button>
    </Form>
  );
}

function initialValues() {
  return {
    patologia: "",
    date: "",
    hour: "",
  };
}
