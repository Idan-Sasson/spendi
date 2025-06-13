import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import './AddButton.css'
import { icons } from "./constants"
export default function AddButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={isOpen ? {overflow: 'hidden'} : {}}>
            {/* <button className="open-modal" onClick={() => setIsOpen(true)}>+</button> */}
            <div className="button-container">
            <img src={icons["Plus"]} className='open-modal-icon' onClick={() => setIsOpen(true)}/>
            </div>
            {isOpen && <AddExpenseModal setIsOpen={setIsOpen}/>}
        </div>
    )
}