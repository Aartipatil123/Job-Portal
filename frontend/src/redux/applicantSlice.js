
import { createSlice } from "@reduxjs/toolkit";
const applicantSlice = createSlice({
    name: 'application',
    initialState: { 
        applicants: [], 
    },
    reducers: {
        setAllApplicants: (state, action) => {
            console.log("Setting applicants in Redux:", action.payload.applications);
            state.applicants = action.payload;
        },
        updateApplicantStatus: (state, action) => {
            const { id, status } = action.payload;
            const applicantIndex = state.applicants.applications.findIndex(applicant => applicant._id === id);
            if (applicantIndex !== -1) {
                state.applicants.applications[applicantIndex].status = status;
            }
        },
    },
});
export const { setAllApplicants, updateApplicantStatus } = applicantSlice.actions;
export default applicantSlice.reducer;
