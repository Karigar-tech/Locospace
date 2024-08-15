'use client';
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAuthContext } from "./authContext";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
}

interface SocketContextProviderProps {
    children: ReactNode;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
    return useContext(SocketContext);
};

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, 
                {
                    query:{
                        userId : localStorage.getItem("userID"),
                    }
                }
            );
            setSocket(newSocket);
            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};