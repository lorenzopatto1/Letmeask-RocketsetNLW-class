import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "./pages/home/index";
import { NewRoom } from "./pages/newRoom/index";

import { AuthContextProvider } from './contexts/AuthContexts';
import { Room } from './pages/room/index';

export function App() {
  return (

    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
        <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

