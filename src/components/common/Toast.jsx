import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 2000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColors = {
        success: 'bg-green-600 border-green-700 text-white',
        error: 'bg-red-600 border-red-700 text-white',
        info: 'bg-blue-600 border-blue-700 text-white',
    };

    return (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-down">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 shadow-2xl ${bgColors[type] || bgColors.success}`}>
                {type === 'success' && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <p className="font-bold uppercase tracking-wider text-sm">
                    {message}
                </p>
                <button 
                    onClick={onClose}
                    className="ml-4 hover:opacity-75 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
