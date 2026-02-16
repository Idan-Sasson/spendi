import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
    const [showGraph, setShowGraph] = useState(10)  // Shows the last X dates entries (dates that had entry) in the bar graph
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

    // Gets a range t1,t2 and returns the daily average between these dates
    const rangeAvg2 = (t1, t2) => {
        if (filteredExpenses.length == 0) return 0;
        const total = totalRange(t1, t2);
        return (total / new Date().getDate()).toFixed(2);
    }

    // Gets a range t1,t2 and returns the daily average between the first expense and the last expense of the range
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

    // Returns the first date first expense of filteredExpenses
    const getFirstExpDate = (expensesArray=filteredExpenses) => {
        if (expensesArray.length === 0) return 0;
        expensesArray.sort((a, b) => a.date - b.date);
        const firstDay = new Date(expensesArray[0].date);
        return firstDay.getTime();
    }

    console.log(getFirstExpDate(filteredExpenses));

    const boxesData = [
        {title: 'Total', value: currencySymbol + getTotal(filteredExpenses).toFixed(2)},
        {title: "Daily Average", value: currencySymbol + totalRange(getFirstExpDate(filteredExpenses), new Date().getTime())},
        {title: "MTD Total", value: currencySymbol + totalRange(FirstMTs, new Date().getTime())},
        {title: "MTD Daily Average", value: currencySymbol + rangeAvg2(FirstMTs, new Date().getTime())}
    ]
    
    // If apple does it like so why should I
    const boxes = [...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData, ...boxesData];

    ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend, BarElement, ArcElement);
    // Bar graph

    const labels = [];
    const sums = [];

    const getWeek = (date) => {  // GEMINI
        const sunday = new Date(date.getTime());
        sunday.setDate(sunday.getDate() - sunday.getDay());
        const saturday = new Date(sunday.getTime());
        saturday.setDate(saturday.getDate() + 6);
        const pad = (num) => num.toString().padStart(2, '0');

        // Check if both dates are in the same month
        if (sunday.getMonth() === saturday.getMonth()) {
            const sunDay = pad(sunday.getDate());
            const satDay = pad(saturday.getDate());
            const month = pad(saturday.getMonth() + 1);
            
            return `${sunDay}-${satDay}/${month}`;
        } else {
            // Fallback for weeks that cross months (28/12-03/01)
            const formatFull = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
            return `${formatFull(sunday)}-${formatFull(saturday)}`;
        }
    }
    
    const getFullWeek = (date) => {  // GEMINI
        const sunday = new Date(date.getTime());
        sunday.setDate(sunday.getDate() - sunday.getDay());
        const saturday = new Date(sunday.getTime());
        saturday.setDate(saturday.getDate() + 6);
        const pad = (num) => num.toString().padStart(2, '0');
        
        const formatFull = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        return `${formatFull(sunday)}-${formatFull(saturday)}`;
    }

    // GEMINI
    // 1. Group by the TIMESTAMP of the start of the week (Sunday 00:00)
    // This ensures accurate sorting across months and years because we use numbers, not strings.
    const graphGrouped = graphExpenses.reduce((result, item) => {
        const date = new Date(item.date);
        
        // Find Sunday of this week
        const sunday = new Date(date.getTime());
        sunday.setDate(sunday.getDate() - sunday.getDay());
        sunday.setHours(0, 0, 0, 0); // Normalize time to midnight
        
        const weekKey = sunday.getTime(); // Use timestamp as key

        if (!result[weekKey]) {
            result[weekKey] = [];
        }
        result[weekKey].push(item);
        return result;
    }, {});

    // 2. Sort the keys (timestamps) numerically to find the most recent weeks
    const sortedTimestampsDesc = Object.keys(graphGrouped)
        .map(k => parseInt(k))    // Convert string keys back to numbers
        .sort((a, b) => b - a);   // Sort Descending (Newest first)

    // 3. Slice to get the number of weeks we want to show
    const filteredTimestamps = sortedTimestampsDesc.slice(0, showGraph);

    // 4. Map to Labels (Sort Ascending so the graph goes Left-to-Right: Old-to-New)
    const fullDateMap = {}; // Reset map
    
    // Sort Ascending for display
    const sortedTimestampsAsc = [...filteredTimestamps].sort((a, b) => a - b);

    sortedTimestampsAsc.forEach(timestamp => {
        const items = graphGrouped[timestamp];
        const dateObj = new Date(timestamp);
        
        // Use your existing getWeek function for the display label (e.g. "08-14/02")
        const weekLabel = getWeek(dateObj);
        
        // Use your getFullWeek function for the tooltip
        const fullLabel = getFullWeek(dateObj);
        
        const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
        
        labels.push(weekLabel);
        sums.push(sum);
        fullDateMap[weekLabel] = fullLabel;
    });

    // // Grouped
    // const graphGrouped = graphExpenses.reduce((result, item) => {
    //     const date = new Date(item.date);
    //     const week = getWeek(date);
    //     if (!result[week]) {  // If this date doesn't exist in our groups yet, create an empty list
    //         result[week] = [];
    //     }
    //     // Add the item into the correct date group
    //     result[week].push(item);
    //     return result;
    // }, {});

    // const sortedDatesDesc = Object.keys(graphGrouped)
    // .sort((a, b) => new Date(b) - new Date(a));
    // const filteredGraphDates = sortedDatesDesc.slice(0, showGraph);

    // const filteredGrouped = filteredGraphDates.reduce((obj, date) => {
    //     obj[date] = graphGrouped[date];
    //     return obj;
    // }, {})
    // const fullDateMap = {};
    // Object.entries(filteredGrouped).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([weekLabel, items]) => {
    //     const sum = items.reduce((sum, item) => sum + item.convertedPrice, 0);
    //     labels.push(weekLabel);
    //     sums.push(sum);

    //     if (items.length > 0) {
    //         fullDateMap[weekLabel] = getFullWeek(new Date(items[0].date));
    //     }
    // });

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
        // title: { display: true, text: `Weekly Expenses (${Math.min(showGraph, sortedDatesDesc.length)} nodes)` },
        title: { display: true, text: `Weekly Expenses (${Math.min(showGraph, sortedTimestampsDesc.length)} nodes)` },
        tooltip: {
            backgroundColor: 'rgba(118, 115, 110, 0.9)',
            bodyFont: { weight: "bold" },
            callbacks: {
                title: function(context) {
                    const shortLabel = context[0].label;
                    return fullDateMap[shortLabel] || shortLabel;
                },
                label: function(context) {
                    return `Weekly Expense: ${currencySymbol}` + context.parsed.y.toFixed(2);
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
                        return `${currencySymbol}${getMonthTotal(context["label"])}`
                    }}}

    },};

    useLayoutEffect(() => {
        if (boxContainerRef.current) {
            const scrollWidth = boxContainerRef.current.scrollWidth;
            boxContainerRef.current.scrollLeft = scrollWidth / 3
        }
    }, [expenses.length > 0]);


    return (
        <div className="home">
        <AddButton  expenses={expenses} setExpenses={setExpenses}/>
            <img className='home-banner' src={banner} />            
            { expenses.length > 0 &&
            <div>
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