import useConversation from "@/zustand/useConversation";
import React from "react";

const EachConversation = ({ conversation }: { conversation: any }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const profilePicture = conversation?.profilePicture?.url || "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png";

  return (
    <div
      className={`d-flex justify-content-left p-2 gap-3 ${isSelected ? "confirm" : ""} `}
      onClick={() => setSelectedConversation(conversation)}
      style={{border: "1px solid #ccc", borderRadius: "10px"}}
    >
      <img
      className="rounded-circle"
        src={profilePicture}
        style={{ width: 50, height: 50 }}
        alt="Avatar"
      />
      <p className="pt-3">{conversation.name}</p>
    </div>
  );
};

export default EachConversation;