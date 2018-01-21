
function FormatCapacity(cap, usdbtc)
{
    if (usdbtc)
    {
        var capusd = cap*usdbtc/Math.pow(10,8);
        return `${cap} sat (${capusd.toFixed(2)} USD)`;
    }
    else
        return `${cap} sat`;
}

// Converts uint8 json array to hex string
function RHashArrayToHexString(rhash)
{
    return rhash.map(function(i) {
        return ('0' + i.toString(16)).slice(-2);
    }).join('');
}

function ParseAxiosError(error)
{
    if (error.response)
        // Server responded
        return error.response.data;
    else
        // Server did not respond
        return error.message;
}

export {
    FormatCapacity,
    RHashArrayToHexString,
    ParseAxiosError
}
