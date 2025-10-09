import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './Home.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, plugins} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { categories, icons } from './constants';
import AddButton from './AddButton';
import { data, useNavigate } from 'react-router-dom';
import banner from "../assets/Spendi-banner.png"
import { setIconColor, parseRgbaString, convertCategories, useBaseCurrency, getSymbol, useAllSecondaryCats } from "./HelperFunctions";
import CustomSelect from './customs/CustomSelect';
import CountryModal2 from './CountryModal2';
import CustomSelect2 from './CustomSelect2';

const Home = () => {
    const navigate = useNavigate();
    const [savedCategories, setSavedCategories] = useLocalStorage("savedCategories", []);
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const [cachedIcons, setCachedIcons] = useLocalStorage("cachedIcons", []);
    const baseCurrency = useBaseCurrency();
    const currencySymbol = getSymbol(baseCurrency);
    const [showGraph, setShowGraph] = useState(30)  // Shows the last X dates entries (dates that had entry) in the bar graph
    const [selectFrame, setSelectFrame] = useState('All');
    const boxContainerRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedCountries, setSelectedCountries] = useLocalStorage("selectedCountries", []);
    const allSecCats = useAllSecondaryCats();
    const [selectedSecCat, setSelectedSecCat] = useLocalStorage("selectedSecCat", []);
    const getFilteredExpenses = (expenses) => {
        expenses = expenses.filter(expense => {
            return expense.exclude == undefined || !expense.exclude
        })
        if (selectedCountries.length > 0) {  // No country is selected
            expenses = expenses.filter(expense => selectedCountries.includes(expense.country));
        }
        if (selectedSecCat.length > 0) {
            expenses = expenses.filter(expense => selectedSecCat.includes(expense.secondaryCat));
        }
        if (selectedCategory !== '') {
            expenses = expenses.filter(expense => selectedCategory === expense.category);
        }
        return expenses
    }
    const [excludedExpenses, setExcludedExpenses] = useState(getFilteredExpenses(expenses));
    const [filteredExpenses, setFilteredExpenses] = useState(excludedExpenses);
    const [graphExpenses, setGraphExpenses] = useState(filteredExpenses) // last 30
    const [pieExpenses, setPieExpenses] = useState(filteredExpenses);

    // const [isCountryFilterOpen, setIsCountryFilterOpen] = useState(false);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const FirstMTs = firstOfMonth.getTime();
    const selectRef = useRef(null)

    useEffect(() => {
      const meta = document.querySelector('meta[name="theme-color"]');
      meta.setAttribute('content', "rgb(239, 240, 239)")
    }, [])

    const setCurrentExcludedExpenses = () => {  // All expenses that are not excluded
        const tmpExpenses = expenses.filter(expense => {
            return expense.exclude == undefined || !expense.exclude
        })
        setExcludedExpenses(tmpExpenses);
        return tmpExpenses;
    }

    useEffect(() => {
        setCurrentExcludedExpenses();
    }, [expenses]);

    useEffect(() => {
        let tmpExpenses
        switch (selectFrame) {
            case 'All': 
                tmpExpenses = excludedExpenses;
                break;
            case 'Last 30 days':
                tmpExpenses = getExpensesFrame(excludedExpenses, new Date().getTime() - 2592000000, new Date().getTime());
                break;
            case "Month to date":
                tmpExpenses = getExpensesFrame(excludedExpenses, FirstMTs, new Date().getTime());
                break;            
            default:
                tmpExpenses = excludedExpenses;
                break;
            }
            setGraphExpenses(tmpExpenses);
            setPieExpenses(tmpExpenses);
            setFilteredExpenses(tmpExpenses);
    }, [selectFrame, excludedExpenses])

    const onOpen = () => {
        selectRef.current.style.overflowY = 'visible';
    }

    const onClose = () => {
        selectRef.current.style.overflowY = 'hidden';
        selectRef.current.scrollLeft = 0;
    }

    useEffect(() => {
        let tmpExpenses = setCurrentExcludedExpenses();
        if (selectedCountries.length > 0) {  // No country is selected
            tmpExpenses = tmpExpenses.filter(expense => selectedCountries.includes(expense.country));
        }
        if (selectedSecCat.length > 0) {
            tmpExpenses = tmpExpenses.filter(expense => selectedSecCat.includes(expense.secondaryCat));
        }
        if (selectedCategory !== '') {
            if (selectedCategory !== 'All') tmpExpenses = tmpExpenses.filter(expense => selectedCategory === expense.category);
        }
        setExcludedExpenses(tmpExpenses);

    }, [selectedCountries, expenses, selectedSecCat, selectedCategory])

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
    // const boxes = [...boxesData, ...boxesData, ...boxesData];

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
    const getCatsSum = (groupedExpenses) => {
        const groupedCategory = groupedExpenses.reduce((result, item) => {
            const cat = item.category
            if (!result[cat]) {
                result[cat] = [];
            }
            result[cat].push(item);
            return result
        }, {});

        const catsSum = {}
        Object.entries(groupedCategory).map(([cat, items]) => {
            const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
            if (!catsSum[cat]) catsSum[cat] = sum
            else catsSum[cat] += sum;
        });
        return catsSum;
    }
    const pieCatSums = getCatsSum(pieExpenses);

    // const groupedCats = pieExpenses.reduce((result, item) => {
    //     const cat = item.category
    //     if (!result[cat]) {
    //         result[cat] = [];
    //     }
    //     result[cat].push(item)
    //     return result;
    // }, {});
    // Object.entries(groupedCats).map(([cat, items]) => {
    //     const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
    //     if (!catSums[cat]) catSums[cat] = sum
    //     else catSums[cat] += sum
    // });

    const pieData = {
        labels: Object.keys(pieCatSums),
        datasets: [{
            data: Object.keys(pieCatSums).map(cat => pieCatSums[cat]),
            backgroundColor: Object.keys(pieCatSums).map(cat => {
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
                labels: {
                    usePointStyle: true,
                    font: {
                        family: 'Helvetica'
                },
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

    // Bar Month Chart
    const firstDayYearly = new Date(new Date().getFullYear(), 0, 1).getTime();
    const lastYearExpenses = getExpensesFrame(graphExpenses, firstDayYearly, new Date().getTime())
    // console.log(lastYearExpenses);
    const monthDict = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    const releventCats = [];

    const monthFilteredGrouped = lastYearExpenses.reduce((result, item) => {  // All expenses for each month
        if (!releventCats.includes(item.category)) releventCats.push(item.category);
        const itemMonth = monthDict[String(new Date(item.date).getMonth() + 1)];
        if (!result[itemMonth]) result[itemMonth] = [];
        result[itemMonth].push(item);
        return result;
    }, {});

    Object.keys(monthFilteredGrouped).map(month => {  // Category sums for each month
        monthFilteredGrouped[month] = getCatsSum(monthFilteredGrouped[month]);
    })
    const catMonthSum = {}
    Object.keys(monthFilteredGrouped).map(month => {  // Each month
        releventCats.map(cat => {  // Fill the last item of each category 0 (then add sum)
            if (!catMonthSum[cat]) catMonthSum[cat] = []
            catMonthSum[cat].push(0);
        })  
        Object.keys(monthFilteredGrouped[month]).map(cat => {
            catMonthSum[cat][catMonthSum[cat].length - 1] += (monthFilteredGrouped[month][cat])  // Add cat sum to array 
        }) 
    })
    
    const getMonthTotal = (month) => {
        return Object.values(monthFilteredGrouped[month]).reduce((acc, value) => acc + value, 0).toFixed(2);
    }

    const monthsChartData = {
        labels: Object.keys(monthFilteredGrouped),
        datasets: Object.keys(catMonthSum).map(cat => {
            return {label: cat, data: catMonthSum[cat], stack: "Group A", backgroundColor: getColor(cat), borderRadius: 6,}
        }),
    };

    const monthsChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        indexAxis: 'y', // flip the axes to horizontal bars
        scales: {
        x: {
            stacked: true,
            beginAtZero: true,
        },
        y: {
            stacked: true,
        },
        },
        plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                font: {
                    family: 'Helvetica'
            },
            }
        },
        title: {
            display: true,
            text: 'Monthly Total',
        },
                tooltip: {
                titleFont: {
                    size: 16,
                    // weight: 600
                },
                bodyFont: {
                    size: 12,
                    // weight: 400
                },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        // console.log(getMonthTotal(context["label"]))
                        return `${currencySymbol}${getMonthTotal(context["label"])}`
                    }}}

    },};

    return (
        <div className="home">
        <AddButton  expenses={expenses} setExpenses={setExpenses}/>
            <img className='home-banner' src={banner} />            { expenses.length > 0 &&
            <div>
                {/* Boxes */}
                <div className="box-container" ref={boxContainerRef}>
                    {boxesData.map(({ title, value }, index) => (
                        <div className="box" key={index}>
                            <span className='title'>{title}</span>
                            <span className='number'>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Selection  */}
                <div className='filter-containers' ref={selectRef}>
                <CustomSelect onSelect={val => setSelectedCategory(val)} optionTitle={selectedCategory} style={{boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)', paddingBottom: '1px'}} onClose={onClose} onOpen={onOpen} className="s-cat-dropdown-container">
                    <div data-value="All" className="s-option-container">
                        <img className="s-filter-icon" src={icons["All"]} />
                        <div key={"All"}>All</div>
                    </div>
                    {categories.map((cat) => (
                        <div key={cat.name} data-value={cat.name} className="s-option-container">
                            <img className="s-filter-icon" src={getIconSrc(cat.name)} />
                            <div>{cat.name}</div>
                        </div>
                    ))}
                </CustomSelect>
                <CustomSelect onSelect={setSelectFrame} optionTitle={selectFrame} onOpen={onOpen} onClose={onClose} className='range-frame-select'>
                    <div data-value='All' className='select-frame-tab'>All</div>
                    <div data-value='Last 30 days' className='select-frame-tab'>Last 30 days</div>
                    <div data-value='Month to date' className='select-frame-tab'>Month to date</div>
                </CustomSelect>
                <CountryModal2 selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
                <CustomSelect2 items={allSecCats} selected={selectedSecCat} setSelected={setSelectedSecCat} />
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
                        {Object.entries(pieCatSums).sort((a, b) => b[1] - a[1]).map(([cat, sum]) => (
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
                <div className='month-bar-container'>
                    <Bar data={monthsChartData} options={monthsChartOptions} />
                </div>
            </div>
            }
            { expenses.length === 0 &&
        	<div className="empty-expenses-container">
        	  <span>Looks kinda empty, try adding a new expense by clicking on that red</span>
        	  <span className="text-plus"> +</span>
        	  <span> on the bottom.</span>
        	</div>
            }
        </div>
    );
};

export default Home;