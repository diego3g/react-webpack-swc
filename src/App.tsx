import React, { Suspense, lazy, useState, useEffect } from 'react';

const Lazy = lazy(() => import('./Lazy'));

const App: React.FC = () => {
  const [shouldShowLazy, setShouldShowLazy] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShouldShowLazy(true);
    }, 2000);
  }, []);
    
  return <div>
    <Suspense fallback={<p>Loading</p>}>
      { shouldShowLazy && <Lazy /> }
    </Suspense>
  </div>;
}

export default App;