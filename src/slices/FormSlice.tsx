import { createSlice } from "@reduxjs/toolkit";
import type { CombinedUserFormData } from "../schema/FormSchema";

//new code 
const initialState: Partial<CombinedUserFormData> = {};  // Store in a single object;

const FormSlice = createSlice({
    name:"data",
    initialState,
    reducers:{
        addData: (state, action) => {
            //state.push(action.payload);  // if we want to store each data in a separate object
            return {...state,...action.payload}  
        },
    }
});

export { FormSlice };
export const {addData} = FormSlice.actions;