import useConversation from "@/zustand/useConversation";
import { useState } from "react";

const useCreateConversation = (id:string) => {
	const [loading, setLoading] = useState(false);
	const createConversation = async (message: string) => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/createChat/${id}`, {
				method: "POST",	
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return { createConversation, loading };
};
export default useCreateConversation;