import React from 'react';
import moment from 'moment';

function FormatCapacity(cap)
{
    /*if (usdbtc)
    {
        var capusd = cap*usdbtc/Math.pow(10,8);
        return `${cap} sat (${capusd.toFixed(2)} USD)`;
    }
    else*/
        return `${cap} sat`;
}

const styles = {
    indent: {
        paddingLeft: '10px'
    }
}

export default class ChannelInfo extends React.Component {
    render() {
        var ch = this.props.data;

        return (
            <tbody>
                <tr>
                    <td>Channel ID</td>
                    <td>{ch.channel_id}</td>
                </tr>
                <tr>
                    <td>Capacity</td>
                    <td>{FormatCapacity(ch.capacity)}</td>
                </tr>
                <tr>
                    <td>Channel Point</td>
                    <td><a href="https://www.smartbit.com.au/tx/${ch.chan_point.split(':')[0]}" target="_blank">{ch.chan_point}</a></td>
                </tr>
                <tr>
                    <td>Last Update</td>
                    <td>{moment(ch.last_update*1000).format('MMMM Do YYYY, h:mm:ss a')}</td>
                </tr>
                <tr>
                    <td>Node1</td>
                    <td>{ch.node1_pub}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Time Lock Delta</td>
                    <td>{ch.node1_policy.time_lock_delta}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Minimum HTLC</td>
                    <td>{ch.node1_policy.min_htlc}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Base Fee</td>
                    <td>{ch.node1_policy.fee_base_msat} msat</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Fee Rate</td>
                    <td>{ch.node1_policy.fee_rate_milli_msat} msat</td>
                </tr>
                <tr>
                    <td>Node2</td>
                    <td>{ch.node2_pub}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Time Lock Delta</td>
                    <td>{ch.node2_policy.time_lock_delta}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Minimum HTLC</td>
                    <td>{ch.node2_policy.min_htlc}</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Base Fee</td>
                    <td>{ch.node2_policy.fee_base_msat} msat</td>
                </tr>
                <tr>
                    <td style={styles.indent}>- Fee Rate</td>
                    <td>{ch.node2_policy.fee_rate_milli_msat} msat</td>
                </tr>
            </tbody>
        );
    }
}
