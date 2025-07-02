import { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/estadisticas.css'


const DiagramadeVentas = () => {
  const [totales, setTotales] = useState<number[]>([])
  const [año, setAño] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await fetch("/api/ventas-por-mes", {
        headers: {
          "usuario-id": "1",
          "admin": "true"
        }
      })
      const data = await res.json()
      setTotales(data.totales)
      setAño(data.año)
    }

    obtenerDatos()
  }, [])

  const options = {
    chart: {
      type: 'spline',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: {
      text: '',
      style: { color: '#f8f9fa' }
    },
    xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: { style: { color: '#f8f9fa' } },
      lineColor: 'rgba(255, 255, 255, 0.2)',
      tickColor: 'rgba(255, 255, 255, 0.2)'
    },
    yAxis: {
      title: {
        text: 'Ventas (S/)',
        style: { color: '#f8f9fa' }
      },
      labels: { style: { color: '#f8f9fa' } },
      gridLineColor: 'rgba(255, 255, 255, 0.1)',
      lineColor: 'rgba(255, 255, 255, 0.2)'
    },
    legend: { itemStyle: { color: '#f8f9fa' } },
    tooltip: {
      shared: true,
      valuePrefix: 'S/ ',
      valueDecimals: 2
    },
    series: [{
      name: `Ventas ${año}`,
      data: totales,
      color: '#d10000',
      marker: {
        fillColor: '#ffffff',
        lineWidth: 2,
        lineColor: '#d10000'
      }
    }],
    credits: { enabled: false },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          symbolStroke: '#f8f9fa',
          theme: { fill: 'transparent' }
        }
      }
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default DiagramadeVentas