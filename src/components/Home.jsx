import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './Home.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, plugins} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { AppOptions, categories, icons } from './constants';
import AddButton from './AddButton';
import { useNavigate } from 'react-router-dom';
import banner from "../assets/Spendi-banner.png"
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol } from "./HelperFunctions";


const Home = () => {
    const navigate = useNavigate();
    const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const total = expenses.reduce((sum, item) => sum + (item.convertedPrice || 0), 0);
    const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
    const baseCurrency = useBaseCurrency();
    const currencySymbol = getSymbol(baseCurrency);

    
    const dayAvg = () => {
        if (expenses.length === 0) return 0;
        expenses.sort((a, b) => a.date - b.date);
        const firstDay = new Date(expenses[0].date).setHours(0, 0, 0, 0);
        const lastDay = new Date(expenses[expenses.length - 1].date).setHours(0, 0, 0, 0);
        const days = (lastDay - firstDay) / (1000 * 60 * 60 * 24) + 1;
        return (total / days).toFixed(2);
    };

    const getColor = (category) => {
        return savedCategories[category] || convertCategories()[category].color
    }

    useEffect(() => {
    const isAllColored = () => {
    return categories.map(cat => {
        const cacheKey = `${cat.name}-${getColor(cat.name)}`;
        if (cachedIcons[cacheKey]) return false
        return [cat.name, getColor(cat.name)];
    })};
    let toColor = isAllColored()
    if (toColor.every(item => item === false)) {
    }
    else {
        async function iconsCache(iconName, colorStr) {
            const cacheKey = `${iconName}-${colorStr}`;
            const iconRgba = parseRgbaString(colorStr);
            const iconSrc = icons[iconName];
            const dataUrl = await setIconColor(iconSrc, iconRgba);
            setCachedIcons(prev => ({ ...prev, [cacheKey]: dataUrl }));
        }
        toColor = toColor.filter(val => val !== false);
        Promise.all(
        toColor.map(([name, color]) => iconsCache(name, color)))
    }
    }, [])

    const getIconSrc = (category) => {
        // const color = categories.find(cat => cat.name == category)?.color
        const color = getColor(category);
        const cacheKey = `${category}-${color}`
        if (cachedIcons[cacheKey]) {
            return cachedIcons[cacheKey];
        }
        return icons[category]
    }

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
        const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
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
        const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
        if (!catSums[cat]) catSums[cat] = sum
        else catSums[cat] += sum
    });

    const pieData = {
        labels: Object.keys(catSums),
        datasets: [{
            data: Object.keys(catSums).map(cat => catSums[cat]),
            backgroundColor: Object.keys(catSums).map(cat => {
                // const match = categories.find(c => c.name === cat);
                const catColor = getColor(cat);
                return catColor || 'rgba(0, 0, 0, 0.85)'
            }),
            borderWidth: 2,
            borderColor: 'rgb(239, 240, 239)'
        }]
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                        return `Daily Expense: ${currencySymbol}` + context.parsed.y.toFixed(2);
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

    const handleCategoryClick = (category) => {
      navigate(`/search/${encodeURIComponent(category)}`);
    };

    return (
        <div className="home">
        <AddButton  expenses={expenses} setExpenses={setExpenses}/>
            {/* <h1 className="spendi">Spendi</h1> */}
            <img className='home-banner' src={banner} />
            <div className="box-container">
                <div className="box">
                    <span className='title'>Total</span>
                    <span className="number">{currencySymbol}{total.toFixed(2)}</span>
                </div>
                <div className="box">
                    <span className='title'>Daily Average</span>
                    <span className='number'>{currencySymbol}{dayAvg()}</span>
                </div>
            </div>
            <div className="chart-wrapper">
                <div className='chart-container'>
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
            <div className='pie-wrapper'>
                <div className='pie-container'>
                    <Pie options={pieOptions} data={pieData}/>
                </div>
                <div className='categories-total'>
                    {Object.entries(catSums).sort((a, b) => b[1] - a[1]).map(([cat, sum]) => (
                        <div className='category-header' key={cat} onClick={() => handleCategoryClick(cat)}>
                            <div className='icon-title'>
                                <img src={getIconSrc(cat)} className='cat-icon' />
                                <span className='cat-title'>{cat}</span>
                            </div>
                            <span className='cat-sum'>{sum.toFixed(2)} {currencySymbol}</span>
                        </div>
                    ))}
                {/* </div> */}
                </div>
            </div>
            {/* <button className='reset' onClick={() => setCachedIcons([])}>Clear Cache</button> */}
        </div>
    );
};

export default Home;