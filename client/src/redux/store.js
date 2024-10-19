import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './AuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['language', 'user'], // Include 'language' to be persisted along with 'user'
};

const persistedReducer = persistReducer(persistConfig, UserSlice);

const store = configureStore({
    reducer: {
        user: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
                ignoredPaths: ['user.someNonSerializableField'],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
