import { ReduxStore } from "@/interfaces";

export const selectAuthorize = (state: ReduxStore) => state.authorize.loginWindowState
