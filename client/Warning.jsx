import React from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';


var styles = {
    container:{
        position: 'relative',
        top: 0,
        margin: '0 auto',
        backgroundColor: '#FF073C',
        color: '#FFF',
        padding: '10px',
        width: '200px',
        fontSize: '12px'
    },
    haiku: {
        marginLeft: '5px',
        fontStyle: 'italic'
    },
    floatRight: {
        float: 'right'
    },
    link: {
        color: '#FFF'
    }
}

export default class Warning extends React.Component {
    state = {
        displayed: false
    }

    componentDidMount() {
        if (!Cookies.get('warned') || moment().diff(+Cookies.get('warned')) > 1000*60*60)
            this.setState({ displayed: true});
    }

    handleClick() {
        Cookies.set('warned', +moment());
        this.setState({ displayed: false });
    }

    render() {
        if (this.state.displayed)
            return (
            <div style={styles.container}>
                Haiku:
                <p style={styles.haiku}>
                    only a fool shall<br/>
                    find themselves try the lightning<br/>
                    strike mainnet fiercely<br/>
                </p>
                <a href="javascript:void(0)" onClick={() => this.handleClick()} style={styles.link}>Okay. I understand.</a>
                <a href="https://twitter.com/starkness/status/953434418948927488" style={{...styles.floatRight,...styles.link}}>No, I don't!</a>
            </div>
            );
        else
            return (
                <div></div>
            );
    }
}
