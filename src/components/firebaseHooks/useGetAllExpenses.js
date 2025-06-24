import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { useLocalStorage } from "../useLocalStorage";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetAllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const expensesRef = collection(db, "expenses");
  // const [authData] = useLocalStorage("auth", {})
  const { userID } = useGetUserInfo();
  // console.log(authData["userID"]);
  const fetchExpenses = async () => {
    try {
      const queryExpenses = query(expensesRef, where("userID", '==', userID), orderBy("date"))
      onSnapshot(queryExpenses, (snapshop) => {
        let docs = [];
        snapshop.forEach((expense) => {
          const data = expense.data();
          const id = expense.id;
          docs.push({ ...data, id })
        })
        console.log(docs);
      });
      // const data = await getDocs(collection(db, "expenses"));
      // const parseData = data.docs.map((expense) => ({ ...expense.data(), id: expense.id }))
    }
    catch (err) {
      console.error(err);
    }
  }
  fetchExpenses();
}