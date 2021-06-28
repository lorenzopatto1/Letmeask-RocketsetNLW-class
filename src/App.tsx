import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "./pages/home/index";
import { NewRoom } from "./pages/newRoom/index";
import { Room } from './pages/room/index';
import { AdminRoom } from './pages/AdminRoom/index';

import { AuthContextProvider } from './contexts/AuthContexts';

export function App() {
  return (

    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
        <Route path="/rooms/:id" component={Room} />

        <Route path="/admin/rooms/:id" component={AdminRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

