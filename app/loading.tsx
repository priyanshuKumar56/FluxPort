import React from "react";

// app/loading.tsx


export default function Loading() {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
            <span style={styles.text}>Loading...</span>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f5f6fa",
    },
    spinner: {
        width: 48,
        height: 48,
        border: "6px solid #e0e0e0",
        borderTop: "6px solid #0078d4",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: 16,
    },
    text: {
        color: "#333",
        fontSize: 18,
        fontWeight: 500,
    },
};

// Add global spinner animation
if (typeof window !== "undefined") {
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
        }
    `;
    document.head.appendChild(style);
}