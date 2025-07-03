import { deleteUser } from "firebase/auth";
import { auth } from "../../config/firebase";
import { getAllExpenses } from "./getAllExpenses";
import { useGetUserInfo } from "./useGetUserInfo";
import { useDeleteExpense } from "./useDeleteExpense";

export const useDeleteUser = () => {
  // const { userID } = useGetUserInfo();
    // Delete all expenses
  const { deleteExpense } = useDeleteExpense();
  const deleteUserAccount = async (userID) => {
    const expenses = await getAllExpenses(userID);
    expenses.map(expense => {
      deleteExpense(expense.id)  // Deletes from firebase
    })
    // Delete user
    const user = auth.currentUser
    deleteUser(user).then(() => {
    }).catch((err) => {
      console.log(err)
    });  
  }
  return { deleteUserAccount };
}