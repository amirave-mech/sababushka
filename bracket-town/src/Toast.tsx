import { forwardRef, useImperativeHandle, useState } from "react";

interface ToastState {
    show: boolean,
    msg: string,
    timeoutId: number | null
}

const TOAST_DURATION = 5000;

const Toast = forwardRef((_props, ref) => {
    const [state, setState] = useState<ToastState>({ show: false, msg: '', timeoutId: null })

    useImperativeHandle(ref, () => ({
        showError
    }));

    const showError = (msg: string) => {
        if (state.timeoutId !== null)
            clearTimeout(state.timeoutId);

        const timeoutId = setTimeout(() => {
            setState({ show: false, msg: '', timeoutId: null })
        }, TOAST_DURATION);

        setState({ show: true, msg, timeoutId });
    }

    return (
        <>
            {state.show && (
                <div className='puzzle-toast' >
                    <div className='guess-wrong'>
                        {state.msg}
                    </div>
                </div>)}
        </>
    )
});

export default Toast;