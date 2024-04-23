import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import DisplayEntries from "./DisplayEntries";
import { getLocations, isNameValid } from "./mock-api/apis";
import {
  FAILED_FETCH_LOCATIONS,
  FAILED_VALIDATE_NAME,
  NAME_ALREADY_TAKEN,
  INVALID_NAME,
} from "./constants";

import "./App.css";

const App = () => {
  const [name, setName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState(new Map());
  const [nameValidationError, setNameValidationError] = useState("");
  const [isAddTemporaryDisalbed, setIsAddTemporaryDisalbed] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await getLocations();
        setLocations(locations);
        setSelectedLocation(locations[0]);
      } catch {
        console.log(FAILED_FETCH_LOCATIONS);
      }
    };
    fetchLocations();
  }, []);

  const handleAdd = async () => {
    if (name !== "") {
      setEntries(new Map(entries.set(name, selectedLocation)));
      setName("");
      setDebouncedName('');
    }
  };

  const handleClear = () => {
    setEntries(new Map());
    setName("");
    setDebouncedName('');
    setSelectedLocation(locations[0]);
    setNameValidationError("");
    setIsAddTemporaryDisalbed(false);
  };

  const displayLocations = () =>
    locations?.map((value) => {
      return <option key={value}>{value}</option>;
    });

  // NOTE: Not sure if I like that at all - the idea of isNameValid to check for invalid name
  // I think just to check for some knowledge for  debouncing and throttling.
  // As isNameValid could be changed, I just decided to make a check for taken there and send updatedName there.
  // Not sure if this is expected
  // Personally, I prefer checking right away as all data is in memory - entries - so we really don't need debounce and etc.
  // Also, there is still a problem if we click Add very fast, so we need to add another state: isAddTemporaryDisalbed.
  // It could be more edge cases that should be tested - adding tests could help here.
  useEffect(() => {
    const validateName = async () => {
      if (debouncedName) {
        try {
          const updatedName = !entries.has(debouncedName)
            ? debouncedName
            : INVALID_NAME;
          const isNameAvailable = await isNameValid(updatedName);
          if (isNameAvailable) {
            setNameValidationError("");
          } else {
            setNameValidationError(NAME_ALREADY_TAKEN);
          }
          setDebouncedName("");
          setIsAddTemporaryDisalbed(false)
        } catch {
          console.log(FAILED_VALIDATE_NAME);
        }
      }
    };
    validateName();
  }, [debouncedName, entries]);

  const debounced = useDebouncedCallback((text) => {
    setDebouncedName(text);
  }, 1000);

  // We could use Form here and Submit for Form, but for this app, there is not much difference.
  // I just started like that, using controlled component ( mostly for name).
  // More cleaning may be needed. 
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
                onChange={(event) => {
                  const text = event.target.value;
                  setNameValidationError("");
                  setName(text);
                  setIsAddTemporaryDisalbed(true); // wait till we finish validation process for name
                  debounced(text);
                }}
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
                  disabled={!!nameValidationError || isAddTemporaryDisalbed}
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
