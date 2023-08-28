import React, { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export function useRefresh() {
    return useContext(RefreshContext);
}

export function RefreshProvider({ children }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshTable = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const value = { refreshTable };

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    );
}
