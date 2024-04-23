import React from "react";

import "./App.css";

interface IEntries {
  entries: any;
}

const DisplayEntries = (props: IEntries) => (
    <table className="table">
      <tbody>
        <tr className="tableHeader">
          <td className="tableItem">Name</td>
          <td className="tableItem">Location</td>
        </tr>
        {[...props.entries.keys()].map((name, index) => {
          return (
            <tr
              key={name}
              style={
                index % 2 === 0
                  ? { backgroundColor: "#ffffff", color: "#000000" }
                  : { backgroundColor: "#D3D3D3", color: "#000000" }
              }
            >
              <td className="tableItem">{name}</td>
              <td className="tableItem">{props.entries.get(name)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );


export default DisplayEntries;
