import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './Home.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, plugins} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { categories, icons } from './constants';
import AddButton from './AddButton';
import { useNavigate } from 'react-router-dom';
import banner from "../assets/Spendi-banner.png"
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol } from "./HelperFunctions";
import CustomSelect from './customs/CustomSelect';
import CountryModal2 from './CountryModal2';

const Home = () => {
    const navigate = useNavigate();
    const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
    const baseCurrency = useBaseCurrency();
    const currencySymbol = getSymbol(baseCurrency);
    const [graphExpenses, setGraphExpenses] = useState(expenses) // last 30
    const [pieExpenses, setPieExpenses] = useState(expenses);
    const [showGraph, setShowGraph] = useState(30)  // Shows the last X dates entries (dates that had entry) in the bar graph
    const [selectFrame, setSelectFrame] = useState('All');
    const boxContainerRef = useRef(null);
    const [filteredExpenses, setFilteredExpenses] = useState(expenses.filter(expense => {
            return expense.exclude == undefined || !expense.exclude
        }));
    const [selectedCountries, setSelectedCountries] = useState([])
    const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const FirstMTs = firstOfMonth.getTime();

    useEffect(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      meta.setAttribute('content', "rgb(239, 240, 239)")
    }, [])

    const setCurrentFilteredExpenses = () => {
        const tmpExpenses = expenses.filter(expense => {
            return expense.exclude == undefined || !expense.exclude
        })
        setFilteredExpenses(tmpExpenses);
        return tmpExpenses;
    }

    useEffect(() => {
        setCurrentFilteredExpenses();
    }, [expenses]);

    useEffect(() => {
        let tmpExpenses
        switch (selectFrame) {
            case 'All': 
                tmpExpenses = filteredExpenses;
                break;
            case 'Last month (30 days)':
                tmpExpenses = getExpensesFrame(filteredExpenses, new Date().getTime() - 2592000000, new Date().getTime());
                break;
            case "Month to date":
                tmpExpenses = getExpensesFrame(filteredExpenses, FirstMTs, new Date().getTime());
                break;            
            default:
                tmpExpenses = filteredExpenses;
                break;
            }
            setGraphExpenses(tmpExpenses);
            setPieExpenses(tmpExpenses);
    }, [selectFrame, filteredExpenses])

    useEffect(() => {  // Invisible scrolling
      const c = boxContainerRef.current;
      if (!c) return;
      const oneWidth = c.scrollWidth / 3;
      c.scrollLeft = oneWidth;
      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          if (c.scrollLeft < oneWidth * 0.5) c.scrollLeft += oneWidth;
          else if (c.scrollLeft > oneWidth * 1.5) c.scrollLeft -= oneWidth;
          ticking = false;
        });
      }
      c.addEventListener('scroll', onScroll, { passive: true });
      return () => c.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        let filteredCountryExpenses = setCurrentFilteredExpenses();
        if (selectedCountries.length > 0) {  // No country is selected
            filteredCountryExpenses = filteredCountryExpenses.filter(expense => selectedCountries.includes(expense.country));
        }
        setFilteredExpenses(filteredCountryExpenses);
    }, [selectedCountries, expenses])

    const getExpensesFrame = (expensesArray, t1, t2) => {
         return expensesArray.filter((expense) => {
            return expense.date > t1 && expense.date < t2
        })
    }

    const getTotal = (expensesArray=filteredExpenses) => {
        return expensesArray.reduce((sum, item) => sum + (item.convertedPrice || 0), 0);
    }

    const rangeAvg = (t1, t2) => {
        if (filteredExpenses.length === 0) return 0;
        const tmpExpenses = filteredExpenses.filter((expense) => {
            return expense.date > t1 && expense.date < t2
        })
        return dayAvg(tmpExpenses);
    }

    const totalRange = (t1, t2) => {  // Sum of the expenses between 2 ranges (d1, d2 - timestamps)
        if (filteredExpenses.length === 0) return 0;
        const tmpExpenses = filteredExpenses.filter((expense) => {
            return expense.date > t1 && expense.date < t2
        });
        return getTotal(tmpExpenses).toFixed(2);
    }
    
    const dayAvg = (expensesArray=filteredExpenses) => {
        if (expensesArray.length === 0) return 0;
        expensesArray.sort((a, b) => a.date - b.date);
        const firstDay = new Date(expensesArray[0].date).setHours(0, 0, 0, 0);
        const lastDay = new Date(expensesArray[expensesArray.length - 1].date).setHours(0, 0, 0, 0);
        const days = (lastDay - firstDay) / (1000 * 60 * 60 * 24) + 1;
        return (getTotal(expensesArray) / days).toFixed(2);
    };

    const getColor = (category) => {
        if (!convertCategories()[category]) return;  // In case of changing categories names
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

    const boxesData = [
        {title: 'Total', value: currencySymbol + getTotal(filteredExpenses).toFixed(2)},
        {title: "Daily Average", value: currencySymbol + dayAvg()},
        {title: "MTD Total", value: currencySymbol + totalRange(FirstMTs, new Date().getTime())},
        {title: "MTD Daily Average", value: currencySymbol + rangeAvg(FirstMTs, new Date().getTime())}
    ]

    const boxes = [...boxesData, ...boxesData, ...boxesData];



    ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, ArcElement);
    // Bar graph

    const labels = [];
    const sums = [];

    // Grouped
    const graphGrouped = graphExpenses.reduce((result, item) => {
        const isoDate = new Date(item.date).toISOString().split("T")[0];
        if (!result[isoDate]) {  // If this date doesn't exist in our groups yet, create an empty list
            result[isoDate] = [];
        }
        // Add the item into the correct date group
        result[isoDate].push(item);
        return result;
    }, {});
    
    const sortedDatesDesc = Object.keys(graphGrouped)
    .sort((a, b) => new Date(b) - new Date(a));
    const filteredGraphDates = sortedDatesDesc.slice(0, showGraph);

    const filteredGrouped = filteredGraphDates.reduce((obj, date) => {
        obj[date] = graphGrouped[date];
        return obj;
    }, {})

    Object.entries(filteredGrouped).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([isoDate, items]) => {
        const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
        labels.push(isoDate);
        sums.push(sum);
    });


    // Pie chart
    const catSums = {}
    const groupedCats = pieExpenses.reduce((result, item) => {
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
                        return `${((context.parsed / getTotal(filteredExpenses)) * 100).toFixed(0)}%`
                    }}}}}

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
        title: { display: true, text: `Daily Expenses (${Math.min(showGraph, sortedDatesDesc.length)} nodes)` },
            tooltip: {
                backgroundColor: 'rgba(118, 115, 110, 0.9)',
                bodyFont: { weight: "bold" },
                callbacks: {
                    label: function(context) {
                        return `Daily Expense: ${currencySymbol}` + context.parsed.y.toFixed(2);
                    }}}},
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
        <AddButton  expenses={filteredExpenses} setExpenses={setExpenses}/>
            <img className='home-banner' src={banner} />
            
            {/* Boxes */}
            <div className="box-container" ref={boxContainerRef}>
                {boxes.map(({ title, value }, index) => (
                    <div className="box" key={index}>
                        <span className='title'>{title}</span>
                        <span className='number'>{value}</span>
                    </div>
                ))}
            </div>

            {/* Selection  */}
            <div className='filter-containers'>
            <CustomSelect onSelect={setSelectFrame} optionTitle={selectFrame} className='range-frame-select'>
                <div data-value='All' className='select-frame-tab'>All</div>
                <div data-value='Last month (30 days)' className='select-frame-tab'>Last month (30 days)</div>
                <div data-value='Month to date' className='select-frame-tab'>Month to date</div>
            </CustomSelect>
            <CountryModal2 selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
            </div>

            {/* Graphs */}
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
                </div>
            </div>
        </div>
    );
};

export default Home;