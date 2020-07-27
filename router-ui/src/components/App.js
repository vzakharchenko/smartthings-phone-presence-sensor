import React from 'react';
import { inject, observer } from 'mobx-react';
import Panel from 'react-bootstrap/lib/Panel';
import Loading from './Loading';
import RouterTabs from './Tabs';

// const staticServerUrl = process.env.STATIC_SERVER_URL;

export default @inject('componentStateStore')

 @observer
class App extends React.Component {
  componentDidMount() {
    if (!this.props.componentStateStore.isLoading) {
      this.props.componentStateStore.load();
    }
  }

  render() {
    const { isLoading } = this.props.componentStateStore;
    return (
      <Panel>
        <Panel.Heading />
        <Panel.Body style={{
          height: 'auto',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
        }}
        >
          {isLoading ? <Loading /> : <RouterTabs /> }

        </Panel.Body>
      </Panel>
    );
  }
}
