export type strOrNum = string | number;
export const evaluateWithOperator = {
	'>=': (a: strOrNum, b: strOrNum) => a >= b,
	'>': (a: strOrNum, b: strOrNum) => a > b,
	'<=': (a: strOrNum, b: strOrNum) => a <= b,
	'<': (a: strOrNum, b: strOrNum) => a < b,
	'==': (a: strOrNum, b: strOrNum) => a == b,
	'===': (a: strOrNum, b: strOrNum) => a === b,
	'!=': (a: strOrNum, b: strOrNum) => a != b,
	'!==': (a: strOrNum, b: strOrNum) => a !== b
};

export const colorPalette = [
	'#e6194B',
	'#3cb44b',
	'#ffe119',
	'#4363d8',
	'#f58231',
	'#42d4f4',
	'#f032e6',
	'#fabed4',
	'#469990',
	'#dcbeff',
	'#9A6324',
	'#fffac8',
	'#800000',
	'#aaffc3',
	'#000075',
	'#a9a9a9'
];
