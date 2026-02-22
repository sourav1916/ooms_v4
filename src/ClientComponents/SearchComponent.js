import React, { useState } from 'react';
import Select from 'react-select';
import { colourOptions } from '../data';
import { LocalSearch, SearchableDropdown } from './LocalSearch';

const Checkbox = ({ children, ...props }) => (
  <label style={{ marginRight: '1em' }}>
    <input type="checkbox" {...props} />
    {children}
  </label>
);

export default () => {
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  // Sample data for local search
  const sampleItems = [
    { id: 1, name: 'Apple', category: 'Fruit' },
    { id: 2, name: 'Banana', category: 'Fruit' },
    { id: 3, name: 'Carrot', category: 'Vegetable' },
    { id: 4, name: 'Dates', category: 'Fruit' },
    { id: 5, name: 'Eggplant', category: 'Vegetable' },
  ];

  return (
    <>
      {/* Your original React Select */}
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={colourOptions[0]}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isRtl={isRtl}
        isSearchable={isSearchable}
        name="color"
        options={colourOptions}
      />

      {/* New Local Search Component */}
      <div style={{ marginTop: '20px' }}>
        <h3>Local Search Example</h3>
        <LocalSearch
          data={sampleItems}
          searchFields={['name', 'category']}
          placeholder="Search items..."
          onItemSelect={(item) => console.log('Selected:', item)}
          highlightMatches={true}
        />
      </div>

      {/* Searchable Dropdown Example */}
      <div style={{ marginTop: '20px' }}>
        <h3>Searchable Dropdown Example</h3>
        <SearchableDropdown
          data={sampleItems}
          valueField="id"
          displayField="name"
          placeholder="Select an item..."
          onSelect={(item) => console.log('Dropdown selected:', item)}
        />
      </div>

      <div
        style={{
          color: 'hsl(0, 0%, 40%)',
          display: 'inline-block',
          fontSize: 12,
          fontStyle: 'italic',
          marginTop: '1em',
        }}
      >
        <Checkbox
          checked={isClearable}
          onChange={() => setIsClearable((state) => !state)}
        >
          Clearable
        </Checkbox>
        <Checkbox
          checked={isSearchable}
          onChange={() => setIsSearchable((state) => !state)}
        >
          Searchable
        </Checkbox>
        <Checkbox
          checked={isDisabled}
          onChange={() => setIsDisabled((state) => !state)}
        >
          Disabled
        </Checkbox>
        <Checkbox
          checked={isLoading}
          onChange={() => setIsLoading((state) => !state)}
        >
          Loading
        </Checkbox>
        <Checkbox checked={isRtl} onChange={() => setIsRtl((state) => !state)}>
          RTL
        </Checkbox>
      </div>
    </>
  );
};