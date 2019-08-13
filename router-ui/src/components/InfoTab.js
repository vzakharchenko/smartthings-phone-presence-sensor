import React from 'react';
import { inject, observer } from 'mobx-react';

export default
@inject('componentStateStore')
@observer
class InfoTab extends React.Component {
  render() {
    const {
      asus,
    } = this.props.componentStateStore;
    return (
      <h1>
        {asus ? 'Asus Router Configuration' : 'Unknown'}
      </h1>
    );
  }
}
