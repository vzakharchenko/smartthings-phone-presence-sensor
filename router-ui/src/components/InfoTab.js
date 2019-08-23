import React from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'react-bootstrap';
import Loading from './Loading';

export default
@inject('componentStateStore')
@observer
class InfoTab extends React.Component {
  render() {
    const {
      asus,
      tpLink,
      mikrotik,
      status,
      routerMessage,
      smartThingMessage,
      isLoading, routerError, smartThingError,
    } = this.props.componentStateStore;
    let routerName = 'Unknown';
    if (asus) {
      routerName = 'Asus Router';
    } else if (tpLink) {
      routerName = 'TpLink Router';
    } else if (mikrotik) {
      routerName = 'Mikrotik Router';
    }
    return (
      isLoading ? <Loading />
        : (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <tr key="router">
                <td>
                  {routerName}
                </td>
                <td>
                  {!routerError
                    ? <p style={{ color: 'green' }}>OK</p>
                    : <p style={{ color: 'red' }}>{status}</p>}
                </td>
                <td>
                  {!routerError
                    ? <p style={{ color: 'green' }}>{routerMessage}</p>
                    : <p style={{ color: 'red' }}>{routerMessage}</p>}
                </td>
              </tr>
              <tr key="smartThing">
                <td>
                  SmartThing SmartApp connection
                </td>
                <td>
                  {!smartThingError
                    ? <p style={{ color: 'green' }}>OK</p>
                    : <p style={{ color: 'red' }}>{status}</p>}
                </td>
                <td>
                  {!smartThingError
                    ? <p style={{ color: 'green' }}>{smartThingMessage}</p>
                    : <p style={{ color: 'red' }}>{smartThingMessage}</p>}
                </td>
              </tr>
            </tbody>
          </Table>
        )

    );
  }
}
