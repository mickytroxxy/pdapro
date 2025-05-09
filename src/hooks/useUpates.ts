import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../helpers/api";
import { setAccountInfo } from "../state/slices/accountInfo";

import { setActiveUser } from "../state/slices/users";
import moment from "moment";
import useAuth from "./useAuth";

export const useUpdates = () => {
    const dispatch = useDispatch();
    const { activeUser, accountInfo } = useAuth();

    const handleChange = (field: string, value: string | any) => {
        if (field == 'birthDay') {
            value = moment(value).format("L");
        }
        dispatch(setActiveUser({ ...activeUser, [field]: value }));
        dispatch(setAccountInfo({ ...activeUser, [field]: value }));
        updateData("users", (activeUser?.userId || ''), { field, value });
    };
    const updateAppBalance = async(amount:number) => {
        // const response = await getAppBalance();
        // const appBalance = response?.[0]?.amount;
        // if(appBalance > -1){
        //     const balance = appBalance + amount
        //     updateData("balance","balanceId",{value:balance,field:'amount'})
        // }

    }
    return { handleChange, updateAppBalance };
};
