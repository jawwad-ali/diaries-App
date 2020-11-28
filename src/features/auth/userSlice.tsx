import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Certificate } from 'crypto';
import { User } from '../../interfaces/user.interface';

const user = createSlice({
    name: "user",
    initialState: null as User | null,
    reducers: {
        setUser(state, { payload }: PayloadAction<User | null>) {
            return state = (payload != null) ? payload : null
        }
    }
})
export const { setUser } = user.actions
export default user.reducer