import React from "react";
import { IEntry } from "./types";

import "./App.css";

interface IEntries {
  entries: Array<IEntry>;
}

const Entries = (props: IEntries) => (
  <table className="table">
    <tbody>
      <tr className="tableHeader">
        <td className="tableItem">Name</td>
        <td className="tableItem">Location</td>
      </tr>
      {props.entries.map((entry, index) => {
        return (
          <tr
            key={entry.name}
            style={
              index % 2 === 0
                ? { backgroundColor: "#ffffff", color: "#000000" }
                : { backgroundColor: "#D3D3D3", color: "#000000" }
            }
          >
            <td className="tableItem">{entry.name}</td>
            <td className="tableItem">{entry.location}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default Entries;
