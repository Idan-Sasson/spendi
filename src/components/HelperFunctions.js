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