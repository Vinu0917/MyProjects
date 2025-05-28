import React, { useState } from 'react';
import { BpkHeading, BpkButton } from '@skyscanner/backpack-web/bpk-component-react';
import BpkCalendar from '@skyscanner/backpack-web/bpk-component-calendar';
import '@skyscanner/backpack-web/bpk-styles/css/base.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <BpkHeading level="h1">Flight Schedule</BpkHeading>
      <BpkCalendar
        id="flight-calendar"
        date={selectedDate}
        onDateSelect={(date) => setSelectedDate(date)}
      />
      <BpkButton onClick={() => alert('Continue clicked!')}>
        Continue
      </BpkButton>
    </div>
  );
}

export default App;