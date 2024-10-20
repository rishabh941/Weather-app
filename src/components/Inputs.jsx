import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "./Api";
import { topCities } from "../constants"; // Import topCities

function Inputs({ onSearchChange }) {
    const [search, setSearch] = useState(null);
    const [defaultOptions, setDefaultOptions] = useState([]); // For default city suggestions

    const handleOnchange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    };

    const loadOptions = (inputValue) => {
        if (!inputValue) {
            // If there's no input, show the top cities
            return {
                options: topCities.map((city) => ({
                    value: city.value,
                    label: city.title,
                })),
            };
        }

        // Otherwise, search for cities based on user input
        return fetch(
            `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
            geoApiOptions
        )
            .then((response) => response.json())
            .then((response) => {
                return {
                    options: response.data.map((city) => ({
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name}, ${city.countryCode}`,
                    })),
                };
            })
            .catch((err) => console.error(err));
    };

    // Populate default suggestions (top cities) when input field is focused
    const handleFocus = () => {
        setDefaultOptions(
            topCities.map((city) => ({
                value: city.value,
                label: city.title,
            }))
        );
    };

    return (
        <div className="flex flex-row">
            <div className="flex flex-row items-center w-full justify-center px-2">
                <div className="flex flex-row space-x-4 items-center">
                    <AsyncPaginate
                        debounceTimeout={600}
                        onChange={handleOnchange}
                        loadOptions={loadOptions}
                        value={search}
                        onFocus={handleFocus} // Trigger city suggestions when the search bar is focused
                        defaultOptions={defaultOptions} // Show top cities when there's no input
                        type="text"
                        placeholder="Search for city..."
                        className="focus:outline-none font-light capitalize placeholder:lowercase placeholder:text-[#000000] text-black w-[250px] z-40"
                    />
                </div>
            </div>
        </div>
    );
}

export default Inputs;
