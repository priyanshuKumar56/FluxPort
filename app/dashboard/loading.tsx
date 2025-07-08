import React from "react";

// app/dashboard/loading.tsx


const DashboardLoading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 animate-fadeIn">
            <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-xl">
                    FP
                </span>
            </div>
            <p className="text-gray-700 text-lg font-medium tracking-wide">
                Loading your dashboard...
            </p>
        </div>
    );
};

export default DashboardLoading;