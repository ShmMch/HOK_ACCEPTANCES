
import dbfReader from '../common/dbfReader';

import dateForamt from 'dateFormat';

const dbfMapping = {
    "SHEKEL": "sum",
    "PAYDATE": "date",
    "PAYNUM": "programKey",
}

const handleGetPrograms = records => {
    return records.map((program) => {
        return program;
    });
}

export default class CollectionReader {

    constructor(organizationKey, date) {
        const { DBPATH: dataPath } = process.env; 
        this.path = `${dataPath}\\${organizationKey}\\hok_bank\\GV${dateForamt(new Date(date), 'ddmmyy')}.IDK`;
    }

    getPrograms() {
        return dbfReader.read(this.path, dbfMapping).then(data => {
            return handleGetPrograms(data.records);
        });
    }
}

