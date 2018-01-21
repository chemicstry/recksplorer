import { autorun, observable, computed } from 'mobx';
import Axios from 'axios';

const ObjectTypes = {
    NODE: 'NODE',
    CHANNEL: 'CHANNEL'
}

class DataStore {
    // Holds all lightning network data
    @observable networkData = {
        nodes: [],
        edges: []
    };

    // Currently selected object on map (node or channel)
    @observable selectedObject;

    // Bitcoin price in usd
    @observable usdbtc;

    selectObject(object) {
        this.selectedObject = object;
    }

    // Finds selected object by pubkey or channel id and returns data
    @computed get selectedObjectData()
    {
        if (!this.selectedObject)
            return undefined;

        // Node pubkey is 66 chars
        if (this.selectedObject.length == 66)
        {
            return {
                ...this.networkData.nodes.find((node) => node.pub_key == this.selectedObject),
                type: ObjectTypes.NODE
            };
        }
        else
        {
            return {
                ...this.networkData.edges.find((edge) => edge.channel_id == this.selectedObject),
                type: ObjectTypes.CHANNEL
            };
        }

        return undefined;
    }

    @computed get nodeCount()
    {
        return this.networkData.nodes.length;
    }

    @computed get channelCount()
    {
        return this.networkData.edges.length;
    }

    @computed get totalCapacity()
    {
        return this.networkData.edges.reduce((sum, edge) => sum + parseInt(edge.capacity), 0);
    }

    fetchData() {
        Axios.get('/networkgraph').then((result) => {
            this.networkData = result.data;
        });
    }

    fetchPrice() {
        Axios.get('https://blockchain.info/ticker').then((result) => {
            this.usdbtc = result.data.USD.last;
        });
    }
}

export { ObjectTypes, DataStore }
