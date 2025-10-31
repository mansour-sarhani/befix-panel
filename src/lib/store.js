import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "@/features/users/usersSlice";

// Import other slices here as we create them
// import companiesReducer from "@/features/companies/companiesSlice";
// import transactionsReducer from "@/features/transactions/transactionsSlice";
// import packagesReducer from "@/features/packages/packagesSlice";
// import paymentsReducer from "@/features/payments/paymentsSlice";
// import promotionsReducer from "@/features/promotions/promotionsSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            users: usersReducer,
            // Add other reducers here as we create them
            // companies: companiesReducer,
            // transactions: transactionsReducer,
            // packages: packagesReducer,
            // payments: paymentsReducer,
            // promotions: promotionsReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    // Ignore these action types for non-serializable values
                    ignoredActions: [],
                },
            }),
        devTools: process.env.NODE_ENV !== "production",
    });
};

// Infer the type of makeStore
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export const selectUsers = (state) => state.users;
export const selectCompanies = (state) => state.companies;
export const selectTransactions = (state) => state.transactions;
export const selectPackages = (state) => state.packages;
export const selectPayments = (state) => state.payments;
export const selectPromotions = (state) => state.promotions;

