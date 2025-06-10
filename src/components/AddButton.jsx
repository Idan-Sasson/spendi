import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";

export default function AddButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button className="open-modal" onClick={() => setIsOpen(true)}>+</button>
            {isOpen && <AddExpenseModal setIsOpen={setIsOpen}/>}
        </div>
    )
}