import { useEffect, useRef, useState } from "react";

type ButtonData = {
  id: number;
  name: string;
  sentAt: number;
};

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [data, setData] = useState<ButtonData | null>(null);
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://192.168.1.10:8000/ws");

    socketRef.current.onopen = () => {
      console.log("Connected to server");
    };

    socketRef.current.onmessage = (event) => {
      const received = JSON.parse(event.data);

      const delay = performance.now() - received.sentAt;

      setData(received);
      setLatency(delay);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Receiver App</h2>

      {data ? (
        <div>
          <p><b>Button ID:</b> {data.id}</p>
          <p><b>Button Name:</b> {data.name}</p>
          <p><b>Latency:</b> {latency.toFixed(2)} ms</p>
        </div>
      ) : (
        <p>Waiting for button click...</p>
      )}
    </div>
  );
}

export default App;