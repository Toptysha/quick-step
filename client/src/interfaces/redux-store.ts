import { ReactNode } from "react";

export interface ReduxStore{
    user: {
        id: string | null,
        login: string | null,
        roleId: string | null,
    },
    modal: {
        isOpen: boolean,
        content: ReactNode;
    },
    loader: {isLoad: boolean},
    authorize: {loginWindowState: 'close' | 'register' | 'login'},
    error: {error: string}
}