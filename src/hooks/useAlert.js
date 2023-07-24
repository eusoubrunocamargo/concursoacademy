import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {

    const [alerts, setAlerts] = useState([]);

    const showAlert = (text, type) => {
        const id = Math.random().toString(36).substring(7);
        setAlerts((prevAlerts) => [...prevAlerts, { id, text, type }]);
    };

    const removeAlert = (id) => {
        setAlerts(alerts => alerts.filter(alert => alert.id !== id));
    };

    useEffect(() => {
        alerts.forEach(alert => {
            console.log(alert);
            const timer = setTimeout(() => {
                removeAlert(alert.id);
            }, 5000);   
            return () => clearTimeout(timer);
        });
    }, [alerts]);
    
    const renderAlert = () => {
        if (!alerts.length) return null;
    
        return (
            <div style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                padding: '1rem',
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                color: '#1e1e1e',
            }}>
                {alerts.map((alert, index) => (
                    <div key={alert.id} style={{
                        minWidth: '30rem',
                        height: '5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        backgroundColor: '#F8F9FA',
                        borderRadius: '0.5rem',
                        border: '1px solid #1e1e1e',
                        fontSize: 'small',
                        transition: 'all 0.3s ease',
                    }}>
                        <div style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '100%',
                            backgroundColor: alert.type === 'success' ? '#4BB543' : '#d26666',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#F8F9FA',
                        }}>!</div>
                        {alert.text}
                    </div>
                ))}
            </div>
        );
    }

    const value = useMemo(() => ({ alerts, showAlert }), [alerts]);


    return (
        <AlertContext.Provider value={value}>
            {children}
            {renderAlert()}
        </AlertContext.Provider>
    )
}