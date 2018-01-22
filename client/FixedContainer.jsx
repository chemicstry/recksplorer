import React from 'react';

var styles = {
    container:{
        position: 'fixed'
    },
}

const border = '1px solid #891AFF';

// Capitalizes first letter
function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class FixedContainer extends React.Component {
    render() {
        var customStyle = {};

        // Transforms "top-left" into {top: 0, left: 0}
        if (this.props.position) {
            customStyle = this.props.position.split('-').reduce((style, position) => {
                style[position] = 0;
                return style;
            }, customStyle);
        }

        if (this.props.border) {
            customStyle = this.props.border.split('-').reduce((style, position) => {
                style['border' + jsUcfirst(position)] = border;
                return style;
            }, customStyle);
        }

        return (
        <div style={{...styles.container,...customStyle}}>
            {this.props.children}
        </div>
        );
    }
}
