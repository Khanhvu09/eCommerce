// A reducer is a FUNCTION that returns an object, or 
// a piece of state to the rootReducer
// I specifically manage the user's name and token
// If tou want to change menubar, let me know by
// an action.type

export default (state = [], action)=>{
    // signature takes state, we default it to []
    if (action.type === 'AUTH_ACTION'){
        // I am going to update, because I care
        console.log(action.payload.data)
        return action.payload.data
    } else if (action.type === 'LOGOUT'){
        return []
    } else {
        return state
    }
}