import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {}
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProduct: (state, action) => {
            state.value = action.payload
        }
    }
})

export default productSlice.reducer;
export const { addProduct } = productSlice.actions;