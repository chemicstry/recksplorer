import React from 'react';
import FixedContainer from './FixedContainer.jsx';
import GraphMap from './GraphMap.jsx';
import ObjectInfo from './ObjectInfo.jsx';
import NodeInfo from './NodeInfo.jsx';
import ChannelInfo from './ChannelInfo.jsx';
import NetworkInfo from './NetworkInfo.jsx';
import Credits from './Credits.jsx';
import Warning from './Warning.jsx';
import Search from './Search.jsx';
import Title from './Title.jsx';
import { ObjectTypes } from './DataStore.js';
import { observer } from 'mobx-react';
import styles from './App.css';
import 'typeface-roboto';

@observer
export default class App extends React.Component {
    state = {}

    componentDidMount() {
        this.props.store.fetchData();
        this.props.store.fetchPrice();
    }

    render() {
        const store = this.props.store;
        const selectedObject = store.selectedObjectData;

        return (
        <div className={styles.app}>
            <div className={styles.map}>
                <GraphMap store={store}/>
            </div>

            <FixedContainer position='bottom-left' border='top-right'>
                {selectedObject ? (
                    <ObjectInfo>
                        {selectedObject.type == ObjectTypes.NODE ? (
                            <NodeInfo data={selectedObject} />
                        ) : (
                            <ChannelInfo data={selectedObject} />
                        )}
                    </ObjectInfo>
                ) : ''}
            </FixedContainer>
            <FixedContainer position='top-left' border='bottom-right'>
                <NetworkInfo store={store} />
                <Search store={store} />
            </FixedContainer>
            <FixedContainer position='top-right'>
                <Title>#recksplorer</Title>
            </FixedContainer>
            <FixedContainer position='bottom-right' border='top-left'>
                <Credits />
            </FixedContainer>
            <Warning />
        </div>
        );
    }
}
