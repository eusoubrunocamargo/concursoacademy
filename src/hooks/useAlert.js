import { createContext, useContext, useEffect, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {

    const [alert, setAlert] = useState({
        isVisible: false,
        text: '',
        type: '',
    });

    const showAlert = (text, type) => {
        setAlert({
            isVisible: true,
            text,
            type,
        })
    };

    useEffect(() => {
        if (alert.isVisible) {
            setTimeout(() => {
                setAlert({
                    isVisible: false,
                    text: '',
                    type: '',
                })
            }, 3000);
        }
    }, [alert]);

    const renderAlert = () => {
        if (!alert.isVisible) return null;

        return (
            <div style={{
                position: 'absolute',
                bottom: 0,
                top: 0,
                right: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                // backgroundColor: '#F8F9FA',
                color: '#1e1e1e',
            }}>
                <div style={{
                    minWidth: '30rem',
                    height: '5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '0.5rem',
                    border: '1px solid #1e1e1e',
                    margin: '4rem',
                    fontSize: 'small',
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
            </div>
        )
    }

    return (
        <AlertContext.Provider value={{ alert, showAlert, setAlert }}>
            {children}
            {renderAlert()}
        </AlertContext.Provider>
    )
}