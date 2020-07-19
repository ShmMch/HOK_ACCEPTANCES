
import dbfReader from '../common/dbfReader';
import dateForamt from 'dateFormat';

const dbfMapping = {
    "DATEGVI": "date",
    "MOSADNAME": "organizationName",
    "CODNOSE": "organizationCode",
    "SCUMGVI": "sum",
    "CAMUTGVI": "amount",
    "SCUMNEW": "SCUMNEW",
    "CAMUTNEW": "CAMUTNEW",
    "AMLGVI": "AMLGVI",
    "AMLNEW": "AMLNEW",
    "DOLAR": "dollarRate"
}

const handleGetFees = records => records.map(fee => {
    return Object.assign({}, fee, { organizationName: fee.organizationName && fee['organizationName'].split('').reverse().join('') });
});

export default class FeeReader {

    constructor() {
        const { DBPATH: dataPath } = process.env; 
        this.path = `${dataPath}\\AMLOT.DBF`;
    }

    getFees(date) {
        return dbfReader.read(this.path, dbfMapping)
            .then(data => {
                return handleGetFees(data.records);
            })
            .then(fees => {
                return fees.filter(fee => dateForamt(fee.date, 'dd/mm/yyyy') === dateForamt(new Date(date), 'dd/mm/yyyy'));
            });
    }

    getCompanyFee(organizationCode, date) {
        return this.getFees(date)
            .then(fees => fees.find(fee => fee.organizationCode == organizationCode));
    }
}

