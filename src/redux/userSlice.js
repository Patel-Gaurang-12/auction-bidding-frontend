import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.value = action.payload
        }
    }
})

export default userSlice.reducer;
export const { addUser } = userSlice.actions;