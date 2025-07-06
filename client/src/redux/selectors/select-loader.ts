import { ReduxStore } from "@/interfaces";

export const selectLoader = (state: ReduxStore) => state.loader.isLoad
