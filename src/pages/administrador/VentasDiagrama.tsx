import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/estadisticas.css';

const options = {
  chart: {
    type: 'spline',
    backgroundColor: 'transparent',
    style: {
        fontFamily: 'inherit'
    }
  },
    title: {
        text: '',
        style: {
            color: '#f8f9fa'
        }
    },
    xAxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        labels: {
            style: {
                color: '#f8f9fa'
            }
        },
        lineColor: 'rgba(255, 255, 255, 0.2)',
        tickColor: 'rgba(255, 255, 255, 0.2)'
    },
    yAxis: {
        title: {
            text: 'Ventas (S/)',
            style: {
                color: '#f8f9fa'
            }
        },
        labels: {
            style: {
                color: '#f8f9fa'
            }
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)',
        lineColor: 'rgba(255, 255, 255, 0.2)'
    },
    legend: {
        itemStyle: {
            color: '#f8f9fa'
        }
    },
    tooltip: {
        shared: true,
        valuePrefix: 'S/ ',
        valueDecimals: 2
    },
    series: [{
        name: 'Ventas 2023',
        data: [12500, 19000, 15300, 17800, 22000, 19500, 23000, 24500, 21000, 23500, 26000, 28000],
        color: '#d10000',
        marker: {
            fillColor: '#ffffff',
            lineWidth: 2,
            lineColor: '#d10000'
        }
    }, {
        name: 'Ventas 2022',
        data: [11000, 16500, 14200, 15500, 18500, 17000, 19500, 21000, 18500, 20000, 22500, 24000],
        color: '#666',
        dashStyle: 'Dash',
        marker: {
            fillColor: '#ffffff',
            lineWidth: 2,
            lineColor: '#666'
        }
    }],
    credits: {
        enabled: false
    },
    exporting: {
        enabled: true,
        buttons: {
            contextButton: {
                symbolStroke: '#f8f9fa',
                theme: {
                    fill: 'transparent'
                }
            }
        }
    }
};

const DiagramadeVentas = () => {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default DiagramadeVentas;
