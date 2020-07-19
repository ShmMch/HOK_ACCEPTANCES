
import dbfReader from '../common/dbfReader';


const dbfMapping = {
    "COMPANY": "key",
    "COMPANYHEB": "name",
    "CODNOSE": "code",
    "ADRRES": "address",
    "YOMGVIA": 'collectionDate',
    "EMAIL": 'email',  
}

const handleGetOrganizations = records => {
    return records.map((company) => {
        company.name = company.name && company['name'].split('').reverse().join('').replace(/([^a-z0-9א-ת ]+)/gi, '-');
        company.address = company.address && company['address'].split('').reverse().join('');
        company.isActive = company.collectionDate !== '88';
        return company;
    }).filter(org=>org.isActive);
}


export default class OrganizationReader {

    constructor() {
        const { DBPATH: dataPath } = process.env; 
        this.path = `${dataPath}\\CONFIG.DBF`;
    }

    getOrganizations() {
        return dbfReader.read(this.path, dbfMapping).then(data => {
            return handleGetOrganizations(data.records);
        });
    }

    getOrganization(key) {
        
        return this.getOrganizations()
            .then(organizations => {
        
                return organizations.find(organization => organization.key == key)
            });
    }
}

