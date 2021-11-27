import React, { useEffect, useState } from 'react'
import firebase from '../../shared/utils/Firebase';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import '../styles/charts.scss';
import * as actions from '../actions';

const db = firebase.firestore(firebase);

export function Charts() {

  // gráfico de barras horizontal de Cantidad de estudios por tipo

  const [cantExoma, setExoma] = useState(null);
  const [cantGenoma, setGenoma] = useState(null);
  const [cantCarrier, setCarrier] = useState(null);
  const [cantCariotipo, setCariotipo] = useState(null);
  const [cantArray, setArray] = useState(null);

  useEffect(() => {
    (async () => {
	const sums = await actions.getPathologies();
        setExoma(sums.sumExoma);
        setGenoma(sums.sumGenoma);
        setCarrier(sums.sumCarrier);
        setCariotipo(sums.sumCariotipo);
        setArray(sums.sumArray);
    })();
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
	(async () => {
		const añoTiempo = await actions.getYearTimes();
        	setTiemposDia(Object.values(añoTiempo));
	        setTiemposAño(Object.keys(añoTiempo));
	})();
      }, []);

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

  // gráfico de barras vertical de Cantidad de estudios por mes

  const [cantEstudios, setCantEstudios] = useState(null);
  const [mesEstudios, setMesEstudios] = useState(null);

  useEffect(() => {
	  (async () => {
		const estudiosMes = await actions.getMonthStudies();
        	setCantEstudios(Object.values(estudiosMes));
	        setMesEstudios(Object.keys(estudiosMes));
	  })();
  }, []);

  const dataEstudiosMes = {
    labels: mesEstudios,
    datasets: [
      {
        label: '# de estudios',
        data: cantEstudios,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsEstudiosMes = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
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
          <div class="ui segment">
            <div className='header'>
              <h1 className='title'>Tiempos que demora el estudio desde la toma de muestra hasta entregado al médico derivante, por año</h1>
            </div>
            <Line data={dataTiempos} options={optionsTiempo} />
          </div>
          <div class="ui segment">
            <div className='header'>
              <h1 className='title'>Cantidad de estudios por mes</h1>
            </div>
            <Bar data={dataEstudiosMes} options={optionsEstudiosMes} />
          </div>
        </div>
      </div>
    </>
  )
}
