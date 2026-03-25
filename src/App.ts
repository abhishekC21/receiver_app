import { useEffect, useState } from "react";

type UsbMessage = {
  payload: string | null;
  forwardedAt: number;
  receivedAt: number;
};

function App() {
  const [data, setData] = useState<UsbMessage | null>(null);
  const [status, setStatus] = useState("Waiting for USB data...");

  useEffect(() => {
    const loadLatestMessage = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/usb-message");
        const result = await response.json();

        if (result) {
          setData(result);
          setStatus("USB data received");
        }
      } catch {
        setStatus("Receiver server not reachable");
      }
    };

    loadLatestMessage();
    const intervalId = setInterval(loadLatestMessage, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>USB Receiver App</h2>
      <p>{status}</p>

      {data ? (
        <div>
          <p><b>Payload:</b> {data.payload}</p>
          <p><b>Forwarded At:</b> {new Date(data.forwardedAt).toLocaleString()}</p>
          <p><b>Received At:</b> {new Date(data.receivedAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>No USB message received yet.</p>
      )}
    </div>
  );
}

export default App;
