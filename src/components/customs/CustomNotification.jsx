import { useEffect, useState } from 'react';
import "./CustomNotification.css";
import { AppOptions } from '../constants';
import { setAlpha } from '../HelperFunctions';

export default function CustomNotification({ children, duration, setIsOpen, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false)
        }, (duration || 3000) - 300);

        const timer = setTimeout(() => {
            setIsOpen(false);
        }, duration || 3000);

        return () => {clearTimeout(timer); // Cleanup
            clearTimeout(fadeOutTimer);}
    }, [])

    
    return (
    <div className={`notification-overlay ${className} ${isVisible ? 'fade-in' : 'fade-out'}`}>
        {children}
        <div className='progress-bar'
        style={{animation: `progressBar ${(duration || 3000) - 300}ms linear forwards`, backgroundColor: setAlpha(AppOptions["backgroundColor"], 1)}} />
    </div>
    
  )
}
