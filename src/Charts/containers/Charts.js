import React, { useEffect, useState } from 'react'
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import '../styles/charts.scss';

const db = firebase.firestore(firebase);

export function Charts() {

  // gráfico de barras horizontal de Cantidad de estudios por tipo

  const [cantExoma, setExoma] = useState(null);
  const [cantGenoma, setGenoma] = useState(null);
  const [cantCarrier, setCarrier] = useState(null);
  const [cantCariotipo, setCariotipo] = useState(null);
  const [cantArray, setArray] = useState(null);

  useEffect(() => {
    const refStates = db.collection("states");

    const refMedicExams = db.collection("medicExams");
    refMedicExams.get().then(doc => {
      let sumExoma = 0;
      let sumGenoma = 0;
      let sumCarrier = 0;
      let sumCariotipo = 0;
      let sumArray = 0;
      if (!doc.empty) {
        doc.docs.map((docActual) => {
          switch (docActual.data().examSelected) {
            case "exoma":
              sumExoma++;
              break;
            case "genoma":
              sumGenoma++;
              break;
            case "carrier":
              sumCarrier++;
              break;
            case "cariotipo":
              sumCariotipo++;
              break;
            case "array":
              sumArray++;
          }
          return {}
        })
        setExoma(sumExoma);
        setGenoma(sumGenoma);
        setCarrier(sumCarrier);
        setCariotipo(sumCariotipo);
        setArray(sumArray);
      }
    })
    return () => {

    }
  }, []);

  const data = {
    labels: ['Exoma', 'Genoma Mitocondrial Completo', 'Carrier de Enfermedades Monogenicas', 'Cariotipo', 'Array CGH'],
    datasets: [
      {
        label: '# de estudios',
        data: [cantExoma, cantGenoma, cantCarrier, cantCariotipo, cantArray],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  // grafico de lineas de tiempos que demora el estudio desde la toma de muestra hasta entregado al médico derivante, por año

  const [tiemposAño, setTiemposAño] = useState(null);
  const [tiemposDia, setTiemposDia] = useState(null);

  useEffect(() => {
    const refStates = db.collection("states");
    refStates.get().then(doc => {
      let añoTiempo = {};
      if (!doc.empty) {
        doc.docs.map((docActual) => {
          if (docActual.data().name == "resultadoEntregado") {
            let fechaFin = new Date();
            fechaFin.setDate(docActual.data().day);
            fechaFin.setMonth(docActual.data().month);
            fechaFin.setFullYear(docActual.data().year);
            let idActual = docActual.data().idMedicExam;
            let fechaInicio = new Date();
            doc.docs.map((docActual2) => {
              if (docActual2.data().idMedicExam == idActual && docActual2.data().name == "esperandoRetiroDeMuestra") {
                fechaInicio.setDate(docActual2.data().day);
                fechaInicio.setMonth(docActual2.data().month);
                fechaInicio.setFullYear(docActual2.data().year);
              } return {}
            })
            let diferencia = Math.abs(fechaFin - fechaInicio);
            let dias = diferencia / (1000 * 3600 * 24);
            if (añoTiempo[docActual.data().year]) {
              añoTiempo[docActual.data().year] += dias;
            } else {
              añoTiempo[docActual.data().year] = dias;
            }
          }
          return {}
        })
        setTiemposDia(Object.values(añoTiempo));
        setTiemposAño(Object.keys(añoTiempo));
      }
    })
    return () => {

    }
  }, [])

  console.log("años: ", tiemposAño);
  console.log("dias: ", tiemposDia);

  const dataTiempos = {
    labels: tiemposAño,
    datasets: [
      {
        label: '# de días',
        data: tiemposDia,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const optionsTiempo = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <>
      <div class="ui container">
        <div class="ui segments">
          <div class="ui segment">
            <div className='header'>
              <h1 className='title'>Cantidad de estudios por tipo</h1>
            </div>
            <Bar data={data} options={options} />
          </div>
          <div class="ui segment">
            <div className='header'>
              <h1 className='title'>Tiempos que demora el estudio desde la toma de muestra hasta entregado al médico derivante, por año</h1>
            </div>
            <Line data={dataTiempos} options={optionsTiempo} />
          </div>
          <div class="ui segment">Tercer grafico</div>
        </div>
      </div>
    </>
  )
}
