import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import './Home.css';

const Home = () => {
    const [expenses, setExpenses] = useLocalStorage("expenses", []);
    const total = expenses.reduce((sum, item) => sum + (item.price || 0), 0);

    const dayAvg = () => {
        if (expenses.length === 0) return 0;
        expenses.sort((a, b) => a.date - b.date);
        const firstDay = new Date(expenses[0].date).setHours(0, 0, 0, 0);
        const lastDay = new Date(expenses[expenses.length - 1].date).setHours(0, 0, 0, 0);
        const days = (lastDay - firstDay) / (1000 * 60 * 60 * 24) + 1;
        console.log(total);
        console.log(days);
        return (total / days).toFixed(2);
    };

    return (
        <div className="home">
            <h1 className="spendi">Spendi</h1>
            <div className="box-container">
                <div className="box">
                    <span className='title'>Total</span>
                    <span className="number">{total}₪</span>
                </div>
                <div className="box">
                    <span className='title'>Daily Average</span>
                    <span className='number'>{dayAvg()}₪</span>
                </div>                
            </div>
        </div>
    );
};

export default Home;