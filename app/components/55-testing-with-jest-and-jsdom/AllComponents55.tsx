import React from 'react';
import { MyTestComponent } from './components/MyTestComponent';
import { Counter } from './components/Counter';
import { DisplayData } from './components/DisplayData';
import { InputForm } from './components/InputForm';
import { ItemList } from './components/ItemList';
import { ConditionalMessage } from './components/ConditionalMessage';
import { DataFetcher } from './components/DataFetcher';

export const App55: React.FC = () => {
  return (
    <>
      <h3>MyTestComponent Example:</h3>
      <MyTestComponent message="Hello from MyTestComponent!" />
      <hr className="my-4" />

      <h3>Counter Example:</h3>
      <Counter />
      <hr className="my-4" />

      <h3>DisplayData Example:</h3>
      <DisplayData name="John Doe" age={25} />
      <DisplayData name="Jane Smith" />
      <hr className="my-4" />

      <h3>InputForm Example:</h3>
      <InputForm onSubmit={(value) => console.log('Form Submitted:', value)} />
      <hr className="my-4" />

      <h3>ItemList Example:</h3>
      <ItemList items={['Item 1', 'Item 2', 'Item 3']} />
      <ItemList items={[]} />
      <hr className="my-4" />

      <h3>ConditionalMessage Example:</h3>
      <ConditionalMessage message="This message is visible!" isVisible={true} />
      <ConditionalMessage message="This message is hidden!" isVisible={false} />
      <hr className="my-4" />

      <h3>DataFetcher Example:</h3>
      <h4>Successful Fetch:</h4>
      <DataFetcher shouldFetchSuccessfully={true} />
      <h4 className="mt-4">Failed Fetch:</h4>
      <DataFetcher shouldFetchSuccessfully={false} />
      <hr className="my-4" />
    </>
  );
};
