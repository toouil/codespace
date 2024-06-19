import { useEffect, useRef, useState } from "react";

export default function useCountdown(duration) {
    const [isTimeOut, setIsTimeOut] = useState(false)
    const [countdown, setCountdown] = useState(null);
    const countdownId = useRef();

    const stopCountdown = () => {
        clearInterval(countdownId.current);
    };

    const startCountdown = () => {
        setIsTimeOut(false)
        countdownId.current = setInterval(() => {
            setCountdown((state) => state - 1);
        }, 1000);
    };

    const resetCountdown = () => {
        stopCountdown();
        setCountdown(duration);
        startCountdown();
    };

    const timeFormatter = (time) => {
        const addZero = (element) => (element < 10 ? `0${element}` : element);
        let min = addZero(Math.floor(time / 60));
        let sec = addZero(time % 60);
        return `${min}:${sec}`;
    };


    useEffect(() => {
        if (countdown <= 0) {
            setIsTimeOut(true)
            stopCountdown();
        }
    }, [countdown]);

    return {countdown, formattedCountdown: timeFormatter(countdown), isTimeOut, startCountdown, stopCountdown, resetCountdown};
}
