import React, { useEffect } from "react";

interface JitsiMeetProps {
  roomName: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

const JitsiMeetComponent: React.FC<JitsiMeetProps> = ({
  roomName,
  userName,
  userEmail,
  onClose,
}) => {
  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName,
      width: "100%",
      height: 600,
      parentNode: document.getElementById("jitsi-container"),
      userInfo: {
        email: userEmail,
        displayName: userName,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
      },
    };
    const api = new (window as any).JitsiMeetExternalAPI(domain, options);

    api.addEventListener("readyToClose", () => {
      onClose();
    });

    return () => api.dispose(); // Cleanup on unmount
  }, [roomName, userName, userEmail, onClose]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Video Consultation</h1>
        <div id="jitsi-container" />
      </div>
    </div>
  );
};

export default JitsiMeetComponent;
