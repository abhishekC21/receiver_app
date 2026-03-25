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




server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let latestMessage = null;

app.post("/api/usb-message", (req, res) => {
  latestMessage = {
    payload: req.body?.payload ?? null,
    forwardedAt: req.body?.forwardedAt ?? Date.now(),
    receivedAt: Date.now(),
  };

  console.log("USB message received:", latestMessage);
  res.json({ ok: true });
});

app.get("/api/usb-message", (_req, res) => {
  res.json(latestMessage);
});

app.listen(3001, "0.0.0.0", () => {
  console.log("USB receiver server running on http://0.0.0.0:3001");
});









dell@dell-Vostro-15-3568:~$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: enp2s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 54:48:10:aa:7e:c6 brd ff:ff:ff:ff:ff:ff
3: wlp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether fc:01:7c:7c:c3:6d brd ff:ff:ff:ff:ff:ff
    inet 192.168.0.160/24 brd 192.168.0.255 scope global noprefixroute wlp1s0
       valid_lft forever preferred_lft forever
    inet6 2406:7400:51:bb93:91b5:ede2:f0dd:ef07/64 scope global temporary dynamic 
       valid_lft 298sec preferred_lft 298sec
    inet6 2406:7400:51:bb93:b08a:b330:9e2d:f46c/64 scope global dynamic mngtmpaddr noprefixroute 
       valid_lft 298sec preferred_lft 298sec
    inet6 fe80::3dc2:6d1f:57d2:f726/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
4: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 96:ae:9e:19:b7:c5 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::94ae:9eff:fe19:b7c5/64 scope link 
       valid_lft forever preferred_lft forever
5: veth1775f9e@if2: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master docker0 state UP group default 
    link/ether ca:a9:79:d5:bd:39 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet6 fe80::c8a9:79ff:fed5:bd39/64 scope link 
       valid_lft forever preferred_lft forever
11: enx1adfbe31f75f: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN group default qlen 1000
    link/ether 1a:df:be:31:f7:5f brd ff:ff:ff:ff:ff:ff
    inet 192.168.42.166/24 brd 192.168.42.255 scope global dynamic noprefixroute enx1adfbe31f75f
       valid_lft 2700sec preferred_lft 2700sec
    inet6 fe80::8532:e0c1:e4a7:745c/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
dell@dell-Vostro-15-3568:~$ 


