import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import componentStateStore from './stores/ComponentStateStore';
import tabsStore from './stores/TabsStore';
import usersStore from './stores/UsersStore';
import devicesStore from './stores/DevicesStore';
import App from './components/App';

const stores = {
  tabsStore,
  componentStateStore,
  usersStore,
  devicesStore,
};

// For easier debugging
window._____APP_STATE_____ = stores; // eslint-disable-line no-underscore-dangle


const Index = () => (
  <Provider {...stores}>
    <App />
  </Provider>
);

ReactDOM.render(<Index />, document.getElementById('index'));
