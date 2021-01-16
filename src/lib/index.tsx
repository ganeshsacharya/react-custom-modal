import React, {
    createContext,
    useContext,
    useReducer
} from "react";
import {ModalRoot} from "./component";
import Dialog from "./Dialog";
import {ToastPosition} from "./Toast";

export enum AnimationType {
    FADE_IN = 'fadeIn',
    FADE_IN_UP = 'fadeInUp',
    FLASH = 'flash',
    HEART_BEAT = 'heartBeat',
    SLIDE_IN_LEFT = 'slideInLeft',
    SLIDE_IN_RIGHT = 'slideInRight',
    SLIDE_IN_UP = 'slideInUp',
    SWING = 'swing',
    ZOOM_IN = 'zoomIn'
}

export enum OutAnimationType {
    FADE_OUT = 'fadeOut',
    SLIDE_OUT_LEFT = 'slideOutLeft',
    SLIDE_OUT_RIGHT = 'slideOutRight',
    SLIDE_OUT_UP = 'slideOutUp',
    ZOOM_OUT = 'zoomOut'
}

export enum DialogType {
    WARNING = 'warning',
    INFO = 'info',
    DANGER = 'danger',
    SUCCESS = 'success'
}

export interface OptionDialogButton {
    name: string;
    onClick: () => void;
    color?: string;
}

interface OptionDialogOptions {
    animationType?: AnimationType;
    outAnimationType?: OutAnimationType;
    cancelText?: string;
    confirmText?: string;
    containerStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    headerTextStyle?: React.CSSProperties;
    onCancel?: () => void;
    onConfirm?: () => void;
    optionButtons?: Array<OptionDialogButton>;
    showCloseButton?: boolean;
    text?: string;
    textStyle?: React.CSSProperties;
    title?: string,
    type?: DialogType;
    bodyComponent?: JSX.Element;
    allowOutsideClick?: boolean;
}

export interface InputProps {
    default?: string;
    inputType: 'text' | 'file' | 'number' | 'image' | 'textarea' | 'date';
    label?: string;
    multiple?: boolean;
    name: string;
    placeholder?: string;
}

export interface DynamicObject {
    [key: string]: Object;
}

interface InputDialogOptions {
    animationType?: AnimationType;
    outAnimationType?: OutAnimationType;
    cancelText?: string;
    confirmText?: string;
    containerStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    headerTextStyle?: React.CSSProperties;
    input?: InputProps;
    inputs?: Array<InputProps>;
    onCancel?: () => void;
    onConfirm?: (result?: DynamicObject) => void;
    onDismissed?: () => void;
    options?: Array<OptionDialogButton>;
    showCloseButton?: boolean;
    text?: string;
    textStyle?: React.CSSProperties;
    title?: string;
    type?: DialogType;
    allowOutsideClick?: boolean;
}

interface AlertOptions {
    animationType?: AnimationType;
    outAnimationType?: OutAnimationType;
    confirmText?: string;
    containerStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    headerTextStyle?: React.CSSProperties;
    showCloseButton?: boolean;
    text?: string;
    textStyle?: React.CSSProperties;
    title?: string;
    type?: DialogType;
    bodyComponent?: JSX.Element;
    allowOutsideClick?: boolean;
}

export interface ToastOptions {
    containerStyle?: React.CSSProperties;
    customComponent?: JSX.Element;
    position?: ToastPosition;
    text: string;
    textStyle?: React.CSSProperties,
    timeoutDuration?: number;
    type: DialogType;
}

export type IToast = ToastOptions & { id: string };

interface PopupContext {
    component?: () => JSX.Element;
    componentJSX?: JSX.Element;
    componentProps?: React.ComponentProps<any>;
    toasts?: Array<IToast>;
    showModal: (component: JSX.Element, animationType?: AnimationType, outAnimationType?: OutAnimationType) => void;
    hideModal: () => void;
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
    showOptionDialog: (options: OptionDialogOptions) => void;
    showInputDialog: (options: InputDialogOptions) => void;
    showToast: (options: ToastOptions) => void;
    hideToast: (toastId: string) => void;
}

let DefaultPopupActions: PopupContext = {
    showModal: (_component: JSX.Element, _animationType?: AnimationType, _outAnimationType?: OutAnimationType) => null,
    hideModal: () => null,
    showAlert: (_options: AlertOptions) => null,
    hideAlert: () => null,
    showOptionDialog: (_options: OptionDialogOptions) => null,
    showInputDialog: (_options: InputDialogOptions) => null,
    showToast: (_options: ToastOptions) => null,
    hideToast: (_toastId: string) => null,
}

let ExportedPopupActions: Omit<PopupContext, 'componentProps' | 'component' | 'componentJSX' | 'toasts'> = {
    ...DefaultPopupActions
}

const ModalContext = createContext<PopupContext>(DefaultPopupActions);

const {Provider, Consumer: ModalConsumer} = ModalContext;

const reducer = (state: any, {
    type,
    component,
    componentProps,
    componentJSX,
    toast,
    id
}: { type: 'openModal' | 'hideModal' | 'showToast' | 'hideToast', componentJSX?: JSX.Element, component?: any, componentProps?: any, toast?: IToast, id?: string }) => {
    switch (type) {
        case "openModal":
            return {...state, component, componentProps, componentJSX};
        case "hideModal":
            return {...state, component: null, modalProps: {}, componentJSX: null};
        case "showToast":
            return {...state, toasts: [...state.toasts, toast], componentProps};
        case "hideToast":
            const index = state.toasts.findIndex((t: { id: string | undefined; }) => t.id === id);
            return {...state, toasts: [...state.toasts.slice(0, index), ...state.toasts.slice(index + 1)]};
        default:
            throw new Error("Unspecified reducer action");
    }
};

const PopupProvider = ({children}: { children: any }) => {

    const initialState: PopupContext = {
        componentJSX: undefined,
        component: undefined,
        componentProps: {},
        toasts: [],
        showModal: (componentJSX: JSX.Element, animationType?: AnimationType, outAnimationType?: OutAnimationType) => {
            dispatch({type: "openModal", componentJSX, componentProps: {animationType, outAnimationType}});
        },
        hideModal: () => {
            dispatch({type: "hideModal"});
        },
        showAlert: (options: AlertOptions) => {
            dispatch({
                    type: 'openModal',
                    component: Dialog, componentProps: {isAlert: true, isInputDialog: false, ...options}
                }
            )
        },
        hideAlert: () => {
            dispatch({type: "hideModal"})
        },
        showOptionDialog: (options: OptionDialogOptions) => {
            dispatch({
                type: "openModal",
                component: Dialog,
                componentProps: {
                    isAlert: false,
                    isInput: false,
                    ...options
                }
            });
        },
        showInputDialog: (options: InputDialogOptions) => {
            dispatch({
                type: "openModal",
                component: Dialog,
                componentProps: {
                    isAlert: false,
                    isInput: true,
                    ...options
                }
            });
        },
        showToast: (options: ToastOptions) => {
            dispatch({
                type: 'showToast',
                toast: {...options, id: Math.random().toString(36).substring(7)},
                componentProps: {...options}
            })
        },
        hideToast: (toastId?: string) => {
            dispatch({
                type: 'hideToast',
                id: toastId
            })
        }
    };

    ExportedPopupActions = initialState;

    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <div>
            <Provider value={state}>
                <ModalRoot/>
                {children}
            </Provider>
        </div>
    );
};

const usePopup = () => useContext(ModalContext);


export {ModalConsumer, PopupProvider, usePopup, ExportedPopupActions as PopupActions};