
import dbfReader from '../common/dbfReader';

const dbfMapping = {
    "LAKNUM": "key",
    "LAKFAMELLY": "lastName",
    "LAKNAME": "firstName",
    "LAKCITY": "city",
    "LAKSTREET": "street",
    "LAKZIP": "zip",
    "LAKPHONE1": "phone",
    "LAKPHONE2": "anotherPhone"
}


const handleGetCustomers = records => {
    return records.map((program) => {
        program.name = program.name && program['name'].split('').reverse().join('');
        program.lastName = program.lastName && program['lastName'].split('').reverse().join('');
        program.firstName = program.firstName && program['firstName'].split('').reverse().join('');
        program.city = program.city && program['city'].split('').reverse().join('');
        program.street = program.street && program['street'].split('').reverse().join('');
        return program;
    });
}

export default class CustomerReader {

    constructor(organizationKey) {
        const { DBPATH: dataPath } = process.env; 
        this.path = `${dataPath}\\${organizationKey}\\LAKOHOT.DBF`;
    }

    getCustomers() {
        return dbfReader.read(this.path, dbfMapping).then(data => {
            return handleGetCustomers(data.records);
        });
    }
}

