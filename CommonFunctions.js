function objectToXml(obj, rootElement = 'root') {
    let xml = `<${rootElement}>`;

    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach(item => {
                if (typeof item === 'object') {
                    xml += objectToXml(item, key);
                } else {
                    xml += `<${key}>${(typeof value === "string") ? escapeXmlSpecialCharacters(value) : value}</${key}>`;
                }
            });
        } else if (typeof value === 'object' && value !== null) {
            xml += objectToXml(value, key);
        } else {
            xml += `<${key}>${(typeof value === "string") ? escapeXmlSpecialCharacters(value) : value}</${key}>`;
        }
    }
    xml += `</${rootElement}>`;
    return xml;
}

function escapeXmlSpecialCharacters(inputString) {
    return inputString.replace(/[<>&'"]/g, function(match) {
        switch (match) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case "'":
                return '&apos;';
            case '"':
                return '&quot;';
            default:
                return match;
        }
    });
}

function formatXml(xml) {
    const PADDING = ' '.repeat(4); // インデントのスペース数
    const reg = /(>)(<)(\/*)/g;
    let formatted = '';
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');
    xml.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        formatted += PADDING.repeat(pad) + node + '\r\n';
        pad += indent;
    });
    return formatted;
}

function removeEmptyStringProperties(obj) {
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            removeEmptyStringProperties(obj[key]);
        }
        else {
            if (obj[key] === "" || obj[key] === 0) {
                delete obj[key];
            }
        }
    }
    return obj;
}

function stringToDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // 月は0〜11の数値で指定するため、1を引いて調整
}

function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0〜11の数値で指定されているため、1を足して調整
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function daysBetween (date1, date2) {
    const ONE_DAY = 1000 * 60 * 60 * 24; // 1日のミリ秒数
    const differenceMs = date1 - date2;
    return Math.round(differenceMs / ONE_DAY);
}

function xmlToJson(xml) {
    let obj = {}; // ここを修正
    if (xml.nodeType === 1) { // element
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj = xml.nodeValue; // ここで再代入が必要
    }

    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof(obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}