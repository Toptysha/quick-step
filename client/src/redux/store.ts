import { configureStore } from "@reduxjs/toolkit";
import { useDispatch} from "react-redux";
import userReducer from "./reducers/user-reducer";
import modalReducer from "./reducers/modal-reducer";
import loaderReducer from "./reducers/loader-reducer";
import AuthorizeReducer from "./reducers/authorize-reducer";
import errorReducer from "./reducers/error-reducer";

export const store = configureStore({
    reducer: {
      user: userReducer,
      authorize: AuthorizeReducer,
      modal: modalReducer,
      loader: loaderReducer,
      error: errorReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
