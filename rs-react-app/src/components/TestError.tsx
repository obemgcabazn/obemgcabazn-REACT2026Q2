import { useState } from 'react';

function Thrower(): never {
  throw new Error('Test Error');
}

export default function TestError() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    return <Thrower />;
  }

  return (
    <button className="button__main" onClick={() => setShouldThrow(true)}>
      Test Error
    </button>
  );
}
