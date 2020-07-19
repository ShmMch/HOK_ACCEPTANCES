import iconv from 'iconv-lite'
import { readAllBytes } from "./fileAsync";

const resources = {
    fieldDescriptionByteLength: 32,
    byteIndex: {
        fieldDescription: 32,
        headerLength: 8,
        recordLength: 10,
        recordCount: 4
    }

};


var fieldTypesForamt = function () {

    function fieldNumber(d) {
        return isNaN(d = +d) ? null : d;
    }

    function fieldString(d) {
        return d.trim() || null;
    }

    function fieldDate(d) {
        return new Date(+d.substring(0, 4), d.substring(4, 6) - 1, +d.substring(6, 8));
    }

    function fieldBoolean(d) {
        return /^[nf]$/i.test(d) ? false
            : /^[yt]$/i.test(d) ? true
                : null;
    }
    return {
        B: fieldNumber,
        C: fieldString,
        D: fieldDate,
        F: fieldNumber,
        L: fieldBoolean,
        M: fieldNumber,
        N: fieldNumber
    };
}();



function fieldName(string) {
    var i = string.indexOf("\0");
    return i < 0 ? string : string.substring(0, i);
}

const splitBySize = (arr, size) => {
    const splitedArr = [];
    for (var i = 0; i < arr.length; i += size) {
        splitedArr.push(arr.slice(i, i + size));
    }
    return splitedArr;
}

const foramtFieldDescription = (fieldDescriptionByte, index, mapping) => {

    return {
        name: fieldName(iconv.decode(fieldDescriptionByte.slice(0, 11), 'CP862')),
        type: fieldDescriptionByte.toString("ascii", 11, 12),
        length: fieldDescriptionByte.readUInt8(16),
        index: index
    }
}

const foramtRecord = (headers, recordsByte) => {
    var currentIndex = 1;

    return headers.reduce((accumulator, header) => {

        accumulator[header.name] = fieldTypesForamt[header.type](iconv.decode(recordsByte.slice(currentIndex, currentIndex += header.length), 'CP862'));
        return accumulator;
    }, {});
}

var readHeader = (fieldsDescriptionByte, mapping) => {
    var index = 0;
    return splitBySize(fieldsDescriptionByte, resources.fieldDescriptionByteLength)
        .map(fieldDescriptionByte => {
            const header = foramtFieldDescription(fieldDescriptionByte, index);
            header.name = mapping[header.name];
            index += header.length;
            return header;
        });
}

var readRecords = (headers, recordCount, recordsByte) => {
    const recordLength = recordsByte.length / recordCount;
    return splitBySize(recordsByte, recordLength).map((recordByte) => {
        return foramtRecord(headers, recordByte);
    })
}
const read = (file, mapping) => {
    var { fieldDescriptionByteLength, byteIndex } = resources

    return readAllBytes(file).then((data) => {
        const
            recordCount = data.readUInt32LE(byteIndex.recordCount),
            headerLength = data.readUInt16LE(byteIndex.headerLength),
            fieldsDescriptionBytes = data.slice(byteIndex.fieldDescription, headerLength - 2),
            recordsByte = data.slice(headerLength, data.length);

        const headers = readHeader(fieldsDescriptionBytes, mapping);
        const records = readRecords(headers, recordCount, recordsByte);
        return {
            headers, records
        }

    })
};

export default { read };