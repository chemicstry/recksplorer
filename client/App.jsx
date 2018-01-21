import React from 'react';
import GraphMap from './GraphMap.jsx';
import ObjectInfo from './ObjectInfo.jsx';
import NodeInfo from './NodeInfo.jsx';
import ChannelInfo from './ChannelInfo.jsx';
import { ObjectTypes } from './DataStore.js';
import { observer } from 'mobx-react';
import styles from './App.css';
import 'typeface-roboto';

@observer
export default class App extends React.Component {
    state = {}

    componentDidMount() {
        this.props.store.fetchData();
    }

    render() {
        const store = this.props.store;
        const selectedObject = store.selectedObjectData;

        return (
        <div className={styles.app}>
            <div className={styles.map}>
                <GraphMap store={store}/>
            </div>

            {selectedObject ? (
                <ObjectInfo>
                    {selectedObject.type == ObjectTypes.NODE ? (
                        <NodeInfo data={selectedObject} />
                    ) : (
                        <ChannelInfo data={selectedObject} />
                    )}
                </ObjectInfo>
            ) : ''}
        </div>
        );
    }
}
