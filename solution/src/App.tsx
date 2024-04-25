import React, { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import Entries from "./Entries";
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

  // NOTE: It is OK to leave selected location as is. Another approach could be to add first option Select Location.
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

  // Note: It would be a great idea to confirm requirements:
  // Name input should be validated using the provided mock API to check whether the chosen name is taken or not.
  // Name input should be validated as the user is typing.

  // 1. Could the same name be used for different locations?
  // 2. There are two levels of validation: validating using isNameValid and checking
  //    if the name is already added to the table. In this scenario, why not include names like 'Tom' and 'Paul' in
  //    isNameValid to validate first using those names? What does 'invalid name' actually mean? 
  //    Is it just a name to check for, or is it a message?
  // 3. Is it necessary to check for both cases when typing a name, or could some validation be done when the "Add" button is pressed?
  // 4. If 'invalid name' is just a name, like 'Paul' or 'Tom', and we need to check for both validations when typing,
  //    I would approach it differently. I would first check if the name is used in the table,
  //    and if it is, there would be no need to check for isNameValid.
  // 5. It's like in real work, you always check with the project manager to ensure that business rules are understood correctly. In this code, I assumed that 'invalid name' is just a message, and the isValidName code is not yet finished.

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
          <Entries entries={entries} />
        </div>
      </header>
    </div>
  );
};

export default App;
