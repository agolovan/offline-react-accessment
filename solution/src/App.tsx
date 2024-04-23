import React, { useState, useEffect } from "react";

import DisplayEntries from "./DisplayEntries";
import { getLocations } from "./mock-api/apis";
import { FAILED_FETCH_LOCATIONS, NAME_ALREADY_TAKEN } from "./constants";

import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState(new Map());
  const [nameValidationError, setNameValidationError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocations();
        setLocations(locations);
        setSelectedLocation(locations[0]);
      } catch {
        alert(FAILED_FETCH_LOCATIONS);
      }
    };
    fetchLocations();
  }, []);

  const handleAdd = async () => {
    if (name !== "") {
      setEntries(new Map(entries.set(name, selectedLocation)));
      setName("");
    }
  };

  const handleClear = () => {
    setEntries(new Map());
    setName("");
    setSelectedLocation(locations[0]);
    setNameValidationError("");
  };

  const displayLocations = () =>
    locations?.map((value) => {
      return <option key={value}>{value}</option>;
    });

  const enterValidateName = async (event) => {
    const inputValue = event.target.value;
    if (entries.has(inputValue)) {
      setNameValidationError(NAME_ALREADY_TAKEN);
    } else {
      setNameValidationError("");
    }
    setName(inputValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="mainContainer">
          <div className="container">
            <span className="containerItem" style={{ width: "15%" }}>
              Name
            </span>
            <div className="containerItem" style={{ width: "75%" }}>
              <input
                type="text"
                name="Name"
                className="item"
                value={name}
                onChange={enterValidateName}
              />
            </div>
          </div>

          <div className="container">
            <div className="containerItem" style={{ width: "15%" }}></div>
            <div className="containerMessage">
              <span>{nameValidationError}</span>
            </div>
          </div>

          <div className="container">
            <span className="containerItem" style={{ width: "15%" }}>
              Location
            </span>
            <div className="containerItem" style={{ width: "75%" }}>
              <select
                name="Location"
                className="item"
                onChange={(event) => {
                  setSelectedLocation(event.target.value);
                }}
              >
                {displayLocations()}
              </select>
            </div>
          </div>

          <div className="space" />

          <div className="container">
            <div className="containerItem" style={{ width: "15%" }}></div>
            <div className="containerItem" style={{ width: "75%" }}>
              <div className="buttonContainer">
                <input
                  type="button"
                  className="button"
                  value="Clear"
                  onClick={handleClear}
                />
                <input
                  type="button"
                  className="button"
                  disabled={!!nameValidationError}
                  value="Add"
                  onClick={handleAdd}
                />
              </div>
            </div>
          </div>
          <DisplayEntries entries={entries} />
        </div>
      </header>
    </div>
  );
};

export default App;
