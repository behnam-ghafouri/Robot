
"use client";
import { useEffect, useState, useCallback } from "react";

interface location {
  x: number,
  y: number,
  facing: string
}

export default function Home() {
  const [robot, setRobot] = useState<location | null>(null);
  const [report, setReport] = useState<string>("");
  const [history, setHistory] = useState<location[] | null>(null);
  const API_URL = "http://localhost:3000/robot";

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.x !== undefined) {
          setRobot(data);
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setHistory(data)
        }
        console.log('BEHNAM', data)
      })
  }, [robot])


  const sendCommand = useCallback(async (action: string, extras = {}) => {
    try {
      console.log('COMMAND', action, extras)
      const res = await fetch(`${API_URL}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action:action, ...extras }),
      });
      const data = await res.json();

      if (data && data.x !== undefined) {
        setRobot(data);
        if (action === "REPORT") {
          setReport(`${data.x},${data.y},${data.facing}`);
        } else {
          setReport("");
        }
      }
    } catch (err) {
      console.error("Backend error",err);
    }
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") sendCommand("MOVE");
      if (e.key === "ArrowLeft") sendCommand("LEFT");
      if (e.key === "ArrowRight") sendCommand("RIGHT");
    };
    window.addEventListener("keydown", handleKeyDown);

  }, [sendCommand]);


  const rows = [4, 3, 2, 1, 0];
  const cols = [0, 1, 2, 3, 4];

  return (
    <div className="flex items-center gap-3 justify-center min-h-screen bg-slate-100 p-4 font-sans">
      <div>

        <div className="grid grid-cols-5 border bg-white shadow-xl">
          {rows.map((y) =>
            cols.map((x) => (
              <div
                key={`${x}-${y}`}
                onClick={() => sendCommand("PLACE", { x, y, facing: "NORTH" })}
                className="w-20 h-20 border flex items-center justify-center relative"
              >
                <span>{x},{y}</span>

                {robot?.x === x && robot?.y === y && (
                  <div className={`
                  ${robot.facing === 'NORTH' ? 'rotate-0' : ''}
                  ${robot.facing === 'EAST' ? 'rotate-90' : ''}
                  ${robot.facing === 'SOUTH' ? 'rotate-180' : ''}
                  ${robot.facing === 'WEST' ? '-rotate-90' : ''}`}>
                    <div className="text-3xl font-bold text-blue-600">
                      &#8593;
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {report && (<span className="font-bold text-slate-600">Output:{report}</span>)}
        <div className="mt-8 flex justify-center gap-3">
          <button className="px-6 py-2 bg-black" onClick={() => sendCommand("LEFT")}>LEFT</button>
          <button className="px-6 py-2 bg-black" onClick={() => sendCommand("MOVE")}>MOVE</button>
          <button className="px-6 py-2 bg-black" onClick={() => sendCommand("RIGHT")}>RIGHT</button>
          <button className="px-6 py-2 bg-black" onClick={() => sendCommand("REPORT")}>REPORT</button>
        </div>

      </div>

      <div className="flex flex-col justify-center text-slate-600"><h3 className="font-bold mb-2">HISTORY</h3>
        <div className="text-center">
          {history && history.map((h, i) => (
            <div key={`${h.x}-${h.y}-${i}`}>X: {h.x}, Y:{h.y}</div>
          ))}
        </div>
      </div>
    </div>
  );
}