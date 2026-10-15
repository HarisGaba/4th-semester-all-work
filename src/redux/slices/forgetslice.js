import { Action } from "@dnd-kit/core/dist/store";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


export const verifyemail = createAsyncThunk(
  "/forget/verifyemail",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/forget/verifyemail", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const verifyotp = createAsyncThunk(
  "/forget/verifyotp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/forget/verifyotp", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


export const resetpassword = createAsyncThunk(
  "/forget/resetPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/forget/resetPassword", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const forgetslice = createSlice({
    name:"forget",
    initialstate:{
        email:"",
        otpverified:false,
        emailverified:false,
    },
    extraReducers:(builder) =>{
        builder
        .addCase(verifyemail.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(verifyemail.fullfiled,(state,Action)=>{
            state.email=action.payload.email
            state.emailverified=true
            state.loading=false
            state.error=null
        })
        .addCase(verifyemail.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })

        // otp work

         .addCase(verifyotp.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(verifyotp.fullfiled,(state,Action)=>{
            state.otpverified=true
            state.loading=false
            state.error=null
        })
        .addCase(verifyotp.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
// 

 .addCase(resetpassword.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(resetpassword.fullfiled,(state,Action)=>{
            state.emailverified=false
            state.otpverified=false
            state.loading=false
            state.error=null
        })
        .addCase(resetpassword.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        }
})

export default forgetslice.reducer;
