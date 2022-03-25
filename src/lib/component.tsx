import React from "react";

import "./index.scss";
import "./animate.css";
import { usePopup } from "./index";
import Toast from "./Toast";
import Modal from "./Modal";

export const ModalRoot = () => {

    let {
        componentJSX: ComponentJSX,
        component: Component,
        toasts,
        componentProps,
        hideModal,
        hideToast,
    } = usePopup();

    componentProps = { ...componentProps }

    return (
        <>
            <Modal componentProps={componentProps} Component={Component} ComponentJSX={ComponentJSX}
                hideModal={hideModal} />
            <Toast hideToast={hideToast} toasts={toasts} />
        </>
    )

};
