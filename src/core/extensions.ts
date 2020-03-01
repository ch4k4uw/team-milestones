interface Number {
    toShortMonthName(): string;
}

const MonthsNames = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ'
];
Number.prototype.toShortMonthName = function(): string {
    return MonthsNames[this];
};