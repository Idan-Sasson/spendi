import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetAllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const { userID } = useGetUserInfo();

  useEffect(() => {
    if (!userID) return; // Avoid setting up the query before userID is ready

    const expensesRef = collection(db, "expenses");
    const queryExpenses = query(
      expensesRef,
      where("userID", "==", userID),
      orderBy("date")
    );

    const unsubscribe = onSnapshot(queryExpenses, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setExpenses(docs);
    }, (error => {
      console.error(error);
      return "error";
    }));

    return () => unsubscribe(); // Clean up the listener
  }, [userID]);

  return expenses;
};