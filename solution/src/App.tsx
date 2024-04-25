import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import DisplayEntries from "./DisplayEntries";
import { getLocations, isNameValid } from "./mock-api/apis";
import { IEntry } from "./types";
import {
  FAILED_FETCH_LOCATIONS,
  FAILED_VALIDATE_NAME,
  NAME_ALREADY_TAKEN,
  INVALID_NAME,
} from "./constants";

import "./App.css";

// Note: We could use Form, but for this app, there is not much difference.
// More cleaning may be needed.
const App = () => {
  const [name, setName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [locations, setLocations] = useState<Array<string>>([]);
  const [entries, setEntries] = useState<Array<IEntry>>([]);
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
    if (name.trim() !== "") {
      const newEntry: IEntry = {
        name,
        location: selectedLocation,
      };
      setEntries((prevState) => {
        const updatedEntries = [...prevState, newEntry];
        return updatedEntries;
      });
      setName("");
      setDebouncedName("");
    }
  };

  // NOTE: It is OK to leave selected location as is. Another approach could be ad first option Select Location:
  const handleClear = () => {
    setEntries([]);
    setName("");
    setDebouncedName("");
    setNameValidationError("");
    setIsAddTemporaryDisalbed(false);
  };

  const displayLocations = () =>
    locations?.map((value) => {
      return <option key={value}>{value}</option>;
    });

  // NOTE: I believe the purpose of isNameValid is simply to check for some understanding of debouncing and throttling.
  // Since isNameValid couldn't be altered, I decided to first verify if the name is already taken, and
  // then send the updatedName to isNameValid. I'm uncertain if this is the expected approach.
  // Personally, I prefer immediate validation since all the data is in memory (entries).
  // Therefore, there's no need for debounce or similar techniques. Moreover,
  // there's still an issue if the 'Add' button is clicked rapidly, so I added another state: isAddTemporarilyDisabled.
  // There may be additional edge cases that require testing - incorporating tests could be beneficial here.
  // In my previous applications, we performed a lot validations upon pressing the 'Add' button."
  // But when working with PlayFab, we needed to use throttling as it were some limits.
  useEffect(() => {
    const validateName = async () => {
      if (debouncedName) {
        try {
          const updatedName = !entries.some(
            (entry) => entry.name === debouncedName
          )
            ? debouncedName
            : INVALID_NAME;
          const isNameAvailable = await isNameValid(updatedName);
          if (isNameAvailable) {
            setNameValidationError("");
          } else {
            setNameValidationError(NAME_ALREADY_TAKEN);
          }
          setDebouncedName("");
          setIsAddTemporaryDisalbed(false);
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="mainContainer">
          <div className="container">
            <span className="containerItem" style={{ width: "15%" }}>
              <label className="label">Name</label>
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
              <label className="label">Location</label>
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
