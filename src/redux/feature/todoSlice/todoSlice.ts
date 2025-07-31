'use client'
import { createSlice } from "@reduxjs/toolkit";

type todoState= string[];

const initialState: todoState = []

 const  todoSlice = createSlice({
    name:"todo",
    initialState,
    reducers:{

    }

})

export default todoSlice.reducer
