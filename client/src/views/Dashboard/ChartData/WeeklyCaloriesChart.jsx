import React, {useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';
import {useDispatch, useSelector } from 'react-redux';
import { getWeeklyCalories } from '../../../redux/action/Stats';
import moment from 'moment';

import { Card, Col, Form, Row } from 'react-bootstrap';
import HkBadge from '../../../components/@hk-badge/@hk-badge';

const WeeklyCaloriesChart = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getWeeklyCalories())
    },[])

 
    const rawData = useSelector(state => state.statsReducer.weeklyCalories);
    const { mealTypes } = useSelector((state) => state.metadataReducer);

    const getWeekDays = () => {
        const startOfWeek = moment().startOf('isoWeek'); // lundi
        return Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days'));
      };

    const weekDays = getWeekDays();

    console.log({rawData})

      const formattedData = weekDays.map(day => {
        const entry = rawData.find(d => moment(d.date).isSame(day, 'day'));

        console.log({entry})

        return {
          date: day.format("YYYY-MM-DD"),
          ...mealTypes.reduce((acc, type) => ({
            ...acc,
            [type]: entry?.meals?.[type]?.label || 0
          }), {})
        };
      });

      console.log({formattedData})

      const categories = formattedData.map(d => moment(d.date).format("ddd")); // ['Mon', 'Tue', ...]

    
      const series = mealTypes.map(type => ({
        name: type,
        data: formattedData.map(d => d[type])
      }));
  

    var options = {

        chart: {
            type: 'bar',
            height: 250,
            stacked: true,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            foreColor: "#646A71",
            fontFamily: 'DM Sans',
        },

        grid: {
            borderColor: '#F4F5F6',
        },

        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '35%',
                borderRadius: 5,
                borderRadiusApplication: "end",
                borderRadiusWhenStacked: "last",
            },
        },
        xaxis: {
            // type: 'datetime',
            categories: categories,
            labels: {
              style: {
                fontSize: '12px',
                fontFamily: 'inherit',
              },
            },
            axisBorder: {
              show: false,
            },
            title: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit',
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit',
                },
            },
            title: {
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit',
                }
            },
        },
        legend: {
            show: true,
            position: 'top',
            fontSize: '15px',
            labels: {
                colors: '#6f6f6f',
            },
            markers: {
                width: 8,
                height: 8,
                radius: 15

            },
            itemMargin: {
                vertical: 5
            },
        },

        colors: ['#007D88', '#25cba1', '#ebf3fe'],
        fill: {
            opacity: 1
        },
        dataLabels: {
            enabled: false,
        },
        annotations: {
            yaxis: [
              {
                y: 1800,
                borderColor: '#FF5733',
                label: {
                  text: 'Objectif journalier (1800 kcal)',
                  style: {
                    color: '#fff',
                    background: '#FF5733',
                  }
                }
              }
            ]
          }
    };

    // KPI

    const totalCalories = rawData.reduce((sum, d) => {
        return sum + Object.values(d.meals || {}).reduce((s, val) => s + val, 0);
      }, 0);
      
    const averageCalories = Math.round(totalCalories / 7);

    const mealTypeAverages = mealTypes.reduce((acc, type) => {
        const total = rawData.reduce((sum, d) => sum + (d.meals?.[type] || 0), 0);
        return {
          ...acc,
          [type]: Math.round(total / 7),
        };
      }, {});

    return <Card className="card-border mb-0 h-100">
            <Card.Header className="card-header-action">
                <h6>Weekly Calories Overview</h6>
            </Card.Header>
            <Card.Body>
                    
            {/* <ReactApexChart options={options} series={series} type="bar" height={270} /> */}

                <div className="separator-full mt-5" />
                <div className="flex-grow-1 ms-lg-3">
                <Row>
                    <Col md={3} className="mb-3">
                        <span className="d-block text-muted fs-7">Calories moyennes (tous repas)</span>
                        <div className="d-flex align-items-center">
                        <span className="fs-4 fw-semibold text-primary mb-0">{averageCalories} kcal</span>
                        </div>
                    </Col>

                    {mealTypes.filter(a=>a.value!="baby").map((type) => (
                        <Col md={3} sm={6} className="mb-3" key={type.value}>
                        <span className="d-block text-muted fs-7">Calories moyennes – {type.label}</span>
                        <div className="d-flex align-items-center">
                            <span className="fs-4 fw-semibold text-dark mb-0">
                            {/* {mealTypeAverages[type]} kcal */}
                            </span>
                        </div>
                        </Col>
                    ))}
                </Row>

                </div>
            </Card.Body>
        </Card>
}
    
    
    


export default WeeklyCaloriesChart
