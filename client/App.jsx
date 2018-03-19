import React from 'react';
import FixedContainer from './FixedContainer.jsx';
import VisGraphMap from './VisGraphMap.jsx';
import VivaGraphMap from './VivaGraphMap.jsx';
import ObjectInfo from './ObjectInfo.jsx';
import NodeInfo from './NodeInfo.jsx';
import ChannelInfo from './ChannelInfo.jsx';
import NetworkInfo from './NetworkInfo.jsx';
import Credits from './Credits.jsx';
import Search from './Search.jsx';
import Title from './Title.jsx';
import Cookies from 'js-cookie';
import { ObjectTypes } from './DataStore.js';
import { observer } from 'mobx-react';
import styles from './App.css';
import 'typeface-roboto';

@observer
export default class App extends React.Component {
    state = {
        map: 'viva'
    }

    constructor() {
        super();

        var map = Cookies.get('map');
        if (map)
            this.state.map = map;
    }

    componentDidMount() {
        this.props.store.fetchData();
        this.props.store.fetchPrice();
    }

    onMapChange(e)
    {
        this.setState({map: e.target.value});
        Cookies.set('map', e.target.value);
    }

    render() {
        const store = this.props.store;
        const selectedObject = store.selectedObjectData;

        var map;
        switch (this.state.map)
        {
            case 'vis':
                map = (<VisGraphMap store={store}/>);
                break;
            case 'viva':
                map = (<VivaGraphMap store={store} key="vivafixed"/>);
                break;
            case 'vivaphys':
                map = (<VivaGraphMap store={store} key="vivaphys" physics={true}/>);
                break;
        }

        return (
        <div className={styles.app}>
            {map}

            <FixedContainer position='bottom-left' border='top-right'>
                {selectedObject ? (
                    <ObjectInfo>
                        {selectedObject.type == ObjectTypes.NODE ? (
                            <NodeInfo data={selectedObject} />
                        ) : (
                            <ChannelInfo data={selectedObject} store={store} />
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
                <select value={this.state.map} onChange={(e) => this.onMapChange(e)} className={styles.mapselect}>
                    <option value="vis">Vis.js (old)</option>
                    <option value="viva">Viva (fixed)</option>
                    <option value="vivaphys">Viva (physics)</option>
                </select>
            </FixedContainer>
            <FixedContainer position='bottom-right' border='top-left'>
                <Credits />
            </FixedContainer>
        </div>
        );
    }
}
