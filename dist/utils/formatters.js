"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatForPie = formatForPie;
exports.formatForLine = formatForLine;
exports.formatForBar = formatForBar;
exports.formatByChartType = formatByChartType;
const date_fns_1 = require("date-fns");
function formatForPie(data) {
    const map = new Map();
    data.forEach(d => {
        map.set(d.category, (map.get(d.category) || 0) + d.value);
    });
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    return { type: 'pie', labels, values };
}
function formatForLine(data) {
    const map = new Map();
    data.forEach(d => {
        const day = (0, date_fns_1.format)(d.timestamp, 'yyyy-MM-dd');
        if (!map.has(day))
            map.set(day, []);
        map.get(day).push(d.value);
    });
    const labels = Array.from(map.keys()).sort();
    const datasets = labels.map(label => {
        const arr = map.get(label);
        return arr.reduce((s, v) => s + v, 0);
    });
    return {
        type: 'line',
        labels,
        datasets: [{ label: 'Soma por dia', data: datasets }]
    };
}
function formatForBar(data) {
    const map = new Map();
    data.forEach(d => {
        map.set(d.category, (map.get(d.category) || 0) + d.value);
    });
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    return { type: 'bar', labels, values };
}
function formatByChartType(type, data) {
    if (!Array.isArray(data))
        return { type, data };
    switch (type) {
        case 'pie': return formatForPie(data);
        case 'line': return formatForLine(data);
        case 'bar': return formatForBar(data);
        default: throw new Error(`Unsupported chart type: ${type}`);
    }
}
