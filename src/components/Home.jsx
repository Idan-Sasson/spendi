import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './Home.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, plugins} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { categories } from './constants';
;
const Home = () => {
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const total = expenses.reduce((sum, item) => sum + (item.price || 0), 0);

    const dayAvg = () => {
        if (expenses.length === 0) return 0;
        expenses.sort((a, b) => a.date - b.date);
        const firstDay = new Date(expenses[0].date).setHours(0, 0, 0, 0);
        const lastDay = new Date(expenses[expenses.length - 1].date).setHours(0, 0, 0, 0);
        const days = (lastDay - firstDay) / (1000 * 60 * 60 * 24) + 1;
        return (total / days).toFixed(2);
    };

    // Graph
    ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, ArcElement);

    // const data{
    const labels = [];
    const sums = [];
    const groupedExpenses = expenses.reduce((result, item) => {
        const isoDate = new Date(item.date).toISOString().split("T")[0];
        if (!result[isoDate]) {  // If this date doesn't exist in our groups yet, create an empty list
            result[isoDate] = [];
        }
        // Add the item into the correct date group
        result[isoDate].push(item);
        return result;
    }, {});
    Object.entries(groupedExpenses).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([isoDate, items]) => {
        const sum = items.reduce((sum, item) => sum + item.price, 0);
        labels.push(isoDate);
        sums.push(sum);
    });

    const catSums = {}
    const groupedCats = expenses.reduce((result, item) => {
        const cat = item.category
        if (!result[cat]) {
            result[cat] = [];
        }
        result[cat].push(item)
        return result;
    }, {});
    Object.entries(groupedCats).map(([cat, items]) => {
        const sum = items.reduce((sum, item) => sum + item.price, 0);
        if (!catSums[cat]) catSums[cat] = sum
        else catSums[cat] += sum
    });

    const pieData = {
        labels: Object.keys(catSums),
        datasets: [{
            data: Object.keys(catSums).map(cat => catSums[cat]),
            backgroundColor: Object.keys(catSums).map(cat => {
                const match = categories.find(c => c.name === cat);
                return match ? match.color : 'rgba(0, 0, 0, 0.85)'
            }),
            borderWidth: 2,
            borderColor: 'rgb(239, 240, 239)'
        }]
    }

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                // display: false
                position: 'right',
                font: {
                    size: 18, 
                    weight: 'bold'
                }
            },
            tooltip: {
                titleFont: {
                    size: 15,
                    weight: 600
                },
                bodyFont: {
                    size: 15,
                    weight: 600
                },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${((context.parsed / total) * 100).toFixed(0)}%`
                    }
                }
            }
        }
    }

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                grid : { display: false }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                display: false
            },
        title: { display: true, text: 'Daily Expenses' },
            tooltip: {
                backgroundColor: 'rgba(118, 115, 110, 0.9)',
                bodyFont: { weight: "bold" },
                callbacks: {
                    label: function(context) {
                        return 'Daily Expense: ₪' + context.parsed.y;
                    }
               }
            }

        
        },
        animation: {
            duration: 1200
        }
    };

    const backgroundColors = sums.map((value, _) => (value < 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(75, 192, 192, 0.5)'));
    const borderColors = sums.map((value, _) => (value < 0 ? 'rgba(255, 99, 132, 0.7)' : 'rgba(75, 192, 192, 0.7)'));
    const chartData = {
        labels: labels,
        datasets: [
            {
            data: sums,
            borderColor: borderColors,
            backgroundColor: backgroundColors,
            borderWidth: 1,
            borderRadius: 12,
            borderSkipped: false,
            }
        ]
    };
    return (
        <div className="home">
            <h1 className="spendi">Spendi</h1>
            <div className="box-container">
                <div className="box">
                    <span className='title'>Total</span>
                    <span className="number">₪{total.toFixed(2)}</span>
                </div>
                <div className="box">
                    <span className='title'>Daily Average</span>
                    <span className='number'>₪{dayAvg()}</span>
                </div>
            </div>
            <div className="chart-container">
                <Bar options={chartOptions} data={chartData} />
            </div>
            <div className='pie-wrapper'>
                <div className='pie-container'>
                    <Pie options={pieOptions} data={pieData}/>
                </div>
                <div className='categories-total'>
                    {Object.entries(catSums).map(([cat, sum]) => (
                        <div className='cat-expense'>{cat}- {sum}</div>
                    ))}
                </div>
            </div>
            {/* <button className='reset' onClick={() => setExpenses([])}>Reset</button> */}
        </div>
    );
};

export default Home;