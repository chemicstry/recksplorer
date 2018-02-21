import React from 'react';
import AppStyles from './App.css';
import Axios from 'axios';
import { RHashArrayToHexString, ParseAxiosError } from './Utils.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const PaymentState = {
    PAYMENT_STATE_WAITING_FOR_INPUT: 'PAYMENT_STATE_WAITING_FOR_INPUT',
    PAYMENT_STATE_WAITING_FOR_INVOICE: 'PAYMENT_STATE_WAITING_FOR_INVOICE',
    PAYMENT_STATE_WAITING_FOR_PAYMENT: 'PAYMENT_STATE_WAITING_FOR_PAYMENT',
    PAYMENT_STATE_COMPLETED: 'PAYMENT_STATE_COMPLETED',
    PAYMENT_STATE_ERROR: 'PAYMENT_STATE_ERROR',
}

var styles = {
    input: {
        fontSize: '11px',
        margin: 0,
        padding: '0 2px 0 2px',
        border: 'none',
        backgroundColor: '#ddd',
        width: '85px'
    },
    button: {
        fontSize: '11px',
        margin: 0,
        padding: '0 2px 0 2px',
        border: 'none',
        backgroundColor: '#891AFF',
        color: '#FFF',
        cursor: 'pointer'
    }
}

export default class LNTips extends React.Component {
    state = {
        paymentState: PaymentState.PAYMENT_STATE_WAITING_FOR_INPUT,
        value: 0,
        invoice: '',
        rhash: '',
        error: '',
        copied: false
    }

    onCreateInvoice(event)
    {
        var value = parseInt(this.state.value);

        Axios.get('/getinvoice', {
            params: {
                value: value
            }
        }).then(result => {
            var hexString = result.data.r_hash;
            if (typeof(hexString)!=="string"){
                hexString = RHashArrayToHexString(result.data.r_hash.data);
            }
            this.setState({
                paymentState: PaymentState.PAYMENT_STATE_WAITING_FOR_PAYMENT,
                invoice: result.data.payment_request,
                rhash: hexString
            });

            // Poll for completed payment
            this.WaitForPayment();
        }).catch(error => {
            this.setState({
                paymentState: PaymentState.PAYMENT_STATE_ERROR,
                error: ParseAxiosError(error)
            })
        });
    }

    WaitForPayment()
    {
        Axios.get('/invoicestatus', {
            params: {
                rhash: this.state.rhash
            }
        }).then(result => {
            if (JSON.parse(result.data) == true)
                this.setState({paymentState: PaymentState.PAYMENT_STATE_COMPLETED});
            else
                setTimeout(() => this.WaitForPayment(), 2000);
        }).catch(error => {
            this.setState({
                paymentState: PaymentState.PAYMENT_STATE_ERROR,
                error: ParseAxiosError(error)
            })
        });
    }

    onValueChange(event)
    {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        switch (this.state.paymentState)
        {
            case PaymentState.PAYMENT_STATE_WAITING_FOR_INPUT:
                return (
                    <span style={styles.container}>
                        <input type="text" placeholder="Amount (satoshi)" style={styles.input} onChange={event => this.onValueChange(event)}/>
                        <button style={styles.button} onClick={event => this.onCreateInvoice(event)}>Get Invoice</button>
                    </span>
                );
            case PaymentState.PAYMENT_STATE_WAITING_FOR_INVOICE:
                return (
                    <span style={styles.container}>"Generating invoice..."</span>
                );
            case PaymentState.PAYMENT_STATE_WAITING_FOR_PAYMENT:
                return (
                    <span style={styles.container}>
                        PayReq: 
                        <input type="text" value={this.state.invoice} readOnly={true} style={styles.input} />
                        <CopyToClipboard text={this.state.invoice} onCopy={() => this.setState({copied: true})}>
                            { this.state.copied ? (
                                <button style={styles.button} onMouseEnter={() => this.setState({copied: false})}>Copied!</button>
                            ) : (
                                <button style={styles.button}>Copy</button>
                            ) }
                        </CopyToClipboard>
                    </span>
                );
            case PaymentState.PAYMENT_STATE_COMPLETED:
                return (
                    <span style={styles.container}>
                        Got it! Thanks! 
                        <a href="javascript:void(0)" onClick={event => this.setState({paymentState: PaymentState.PAYMENT_STATE_WAITING_FOR_INPUT})}>Repeat?</a>
                    </span>
                );
            case PaymentState.PAYMENT_STATE_ERROR:
                return (
                    <span style={styles.container}>
                        Error: {this.state.error}
                        <a href="javascript:void(0)" onClick={event => this.setState({paymentState: PaymentState.PAYMENT_STATE_WAITING_FOR_INPUT})}>Retry</a>
                    </span>
                );
        }
    }
}
