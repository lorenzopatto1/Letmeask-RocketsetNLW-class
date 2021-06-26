import { BrowserRouter, Route } from 'react-router-dom';

import { Home } from "./pages/home";
import { NewRoom } from "./pages/newRoom";

import { AuthContextProvider } from './contexts/AuthContexts';

export function App() {
  return (

    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

