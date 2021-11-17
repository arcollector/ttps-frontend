import React, { useEffect, useState } from 'react'
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Bar } from 'react-chartjs-2';
import '../styles/charts.scss';

const db = firebase.firestore(firebase);

export function Charts() {

  const [cantExoma, setExoma] = useState(null);
  const [cantGenoma, setGenoma] = useState(null);
  const [cantCarrier, setCarrier] = useState(null);
  const [cantCariotipo, setCariotipo] = useState(null);
  const [cantArray, setArray] = useState(null);

  useEffect(() => {
    const ref = db.collection("medicExams");
    ref.get().then(doc => {
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
  }, [])

  const data = {
    labels: ['Exoma', 'Genoma Mitocondrial Completo', 'Carrier de Enfermedades Monogenicas', 'Cariotipo', 'Array CGH'],
    datasets: [
      {
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
          <div class="ui segment">Segundo grafico</div>
          <div class="ui segment">Tercer grafico</div>
        </div>
      </div>
    </>
  )
}
