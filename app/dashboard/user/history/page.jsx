"use client";

import { useEffect, useState } from "react";

export default function History(){

  const [list,setList] = useState([]);

  const load = async ()=>{
    const res = await fetch("/api/transaction");
    setList(await res.json());
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h1>Transaction History</h1>

      {list.map(t=>(
        <div key={t.id}>
          ID: {t.id} — Total: {t.total} — Date: {new Date(t.createdAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
