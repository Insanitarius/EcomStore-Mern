import React from "react";
import { API } from "../backend";
import "../styles.css";
import Base from "./Base";

export default function Home() {
  return (
    <Base title="Home page" description="Welcome to the Tshirt store">
      <h1 className="text-white">Hello Frontend</h1>
    </Base>
  );
}
