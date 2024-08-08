'use client';
import { useEffect, useState } from "react";

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found in localStorage");
                }
                console.log("Token retrieved:", token); // Debug log

                const res = await fetch("http://localhost:5000/api/chat/currentChats", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, []);

    return { loading, conversations };
};

export default useGetConversations;