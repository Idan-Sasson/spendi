export function setAlpha(rgba, newAlpha) {
    // Remove the 'rgba(' prefix and ')' suffix
    const values = rgba.slice(5, -1).split(',').map(v => v.trim());

    // If there are only 3 values (i.e., "rgb(...)"), push alpha
    if (values.length === 3) {
        values.push(newAlpha);
    } else {
        values[3] = newAlpha;
    }

    return `rgba(${values.join(', ')})`;
}

export async function ConvertCurrencies(amount, baseCurrency, endCurrency) {  // BaseCurrency - Expense's currency, endCurrency - Display currency
    // 15$ - 15*3.5
    const reqUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`;
    const response = await fetch(reqUrl);
    const data = await response.json();
    const rate = data[baseCurrency][endCurrency];
    return amount * rate;
}
