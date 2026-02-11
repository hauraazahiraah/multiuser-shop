"use client";

import { useEffect, useState } from "react";

export default function CartPage(){

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const load = async ()=>{
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data);

    let t = 0;
    data.forEach(i=>{
      t += i.product.price * i.quantity;
    });
    setTotal(t);
  };

  useEffect(()=>{ load(); },[]);

  const checkout = async ()=>{
    const res = await fetch("/api/transaction",{
      method:"POST"
    });

    alert(await res.text());
    load();
  };

  return (
    <div>
      <h1>Your Cart</h1>

      {items.length === 0 && <p>Cart is empty</p>}

      {items.map(i=>(
        <div key={i.id}>
          {i.product.name} — Qty: {i.quantity} — Price: {i.product.price}
        </div>
      ))}

      <h2>Total: {total}</h2>

      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
