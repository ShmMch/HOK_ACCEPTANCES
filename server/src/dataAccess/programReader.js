
import dbfReader from '../common/dbfReader';
import dateForamt from 'dateFormat';

const dbfMapping = {
    "PAYNUM": "key",
    "LAKNUM": "customerKey",
    "PAYHESH": "bankAccount",
    "DATEJOIN": "joinDate",
    "DATEOPEN": "openDate",
    "DATECLOSE": "closeDate",
    "PAYSHEKEL": "sumShekel",
    "PAYDOLAR": "sumDollar",
    "PAYDESTENY": "projectKey",
}

//PAYNUM	LAKNUM	PAYHESH	DATEJOIN	DATEOPEN	DATECLOSE	DATECANCEL	CANCELCOSE	PAYSHEKEL	PAYDOLAR	
//MCHNUM	PAYCOSE	PAYDESTENY	PAYSTATUS	PAYREM	PAYNAME	PAYMAKAV	NORMALLATE	ISHURBANK	PAYPLACE	DATEMAKAV	PAYZACAUT2	PAYCITY	PAYKESHER



const handleGetPrograms = records => {
    return records.map((program) => {
        return Object.assign({}, program, {
            bankAccount: program.bankAccount && program.bankAccount.split(" ").reverse().join(" ")
        })
    });
}

export default class ProgramReader {

    constructor(organizationKey) {
        const { DBPATH: dataPath } = process.env;
        this.path = `${dataPath}\\${organizationKey}\\PAY.DBF`;
    }

    getPrograms() {
        return dbfReader.read(this.path, dbfMapping).then(data => {
            return handleGetPrograms(data.records);
        });
    }

    getFinishedPrograms(date) {
        return this.getPrograms()
            .then(prgs => prgs.filter(prg => dateForamt(new Date(prg.closeDate), "ddmmyyyy") === dateForamt(new Date(date), "ddmmyyyy")));
    }

    getProjectPrograms(projectKey) {
        return this.getPrograms()
            .then(prgs => prgs.filter(prg => prg.projectKey === projectKey));
    }
}

