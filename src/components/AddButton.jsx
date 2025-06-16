import { useState, useEffect } from "react";
import AddExpenseModal from "./AddExpenseModal";
import './AddButton.css';
import { icons } from "./constants";

export default function AddButton({ expenses, setExpenses }) {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    return (
        <div style={isOpen ? {} : {}}>
            {/* <button className="open-modal" onClick={() => setIsOpen(true)}>+</button> */}
            <div className="button-container">
            <img src={icons["Plus"]} className='open-modal-icon' onClick={() => setIsOpen(true)}/>
            </div>
            {isOpen && <AddExpenseModal setIsOpen={setIsOpen} expenses={expenses} setExpenses={setExpenses} />}
        </div>
    )
}