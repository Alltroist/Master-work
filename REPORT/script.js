const ogt = require('./functions/functions')
const constants = require('./functions/constants')
const patient = require("./functions/patient")
const report = require("./functions/report")

const language = "ru"

const returnDebug = (item) => {
    console.log(item);
    return item;
};

var fonts = {
    Bold: {
        normal: 'fonts/bold.otf',
        italics: 'fonts/bold-italica.otf'
    },
    Extralight: {
        normal: 'fonts/extra-light.otf',
        italics: 'fonts/extra-light-italica.otf',
        bold: 'fonts/med.otf',
        bolditalics: 'fonts/med-italica.otf'
    },
    Heavy: {
        normal: 'fonts/heavy.otf',
        italics: 'fonts/heavy-italica.otf'
    },
    Light: {
        normal: 'fonts/light.otf',
        italics: 'fonts/light-italica.otf'
    },
    Med: {
        normal: 'fonts/med.otf',
        italics: 'fonts/med-italica.otf'
    },    
    Reg: {
        normal: 'fonts/reg.otf',
        italics: 'fonts/reg-italica.otf'
    },       
    Thin: {
        normal: 'fonts/thin.otf',
        italics: 'fonts/thin-italica.otf'
    },
};
  
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');

var data = fs.readFileSync('json/OGT-61_prod_ver1.json', 'utf8');
//var data = fs.readFileSync('json/ogt52-test.json', 'utf8');
var words = JSON.parse(data);


function addTags(text) {
    //if (typeof text != "undefined") {
    //    text = text.replace(/\r\n/g, '<br/>')
    //}
    return text
}



var htmlToPdfmake = require("html-to-pdfmake");
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var { window } = new JSDOM("");

const fetch = require("node-fetch")
const cheerio = require('cheerio')

function addReferenceToList(text, dict_of_reference) {
    $ = cheerio.load(text);
    links = $('a')
    $(links).each(function(i, link){
        if ($(link).attr('href').includes("pubmed")) {
            dict_of_reference[Number($(link).text())] = $(link).attr('href')
        }
    });
    return dict_of_reference
}


async function queryPubmed(pid, pid_list) {
    biblio = []
    let response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pid}&retmode=json`)
    let json  = await response.json()
    return json;
}

async function addBibliography() {
    dict_of_reference = addReferenceToList(report["report"], {})
    list_of_keys = Object.keys(dict_of_reference).sort()
    str_of_reference = ""
    for (let key in list_of_keys) {
        str_of_reference += String(list_of_keys[key]) + ","
    }
    biblio = []
    return queryPubmed(str_of_reference)
        .then(json => {
            for (index in list_of_keys) {
                cur_id = list_of_keys[index]
                authors = json["result"][cur_id]["authors"][0]["name"]
                title = json["result"][cur_id]["title"]
                year = json["result"][cur_id]["pubdate"]
                journal = json["result"][cur_id]["source"]
                biblio.push({
                    text: [{
                        text: "PMID: " + String(cur_id) + " ",
                        style: "boldText", 
                            //link: d[String(cur_id)]
                    },
                    {
                        text: authors + "et al, " + title + ", ",
                        style: "text"
                    },
                    {
                    text: journal + ", " + year,
                        style: "text",
                        italics: true,
                    }],
                        margin: [0, 0, 0, 10]
                })    
            }
            return biblio
        });
}



function addHeader(content, is_break, image) {
    return [
        { 
            text: content, 
            style: 'header', 
            pageBreak: is_break ? 'before' : '',
            tocItem: true, 
            tocMargin: [30, 10, 0, 0]
        },
        { 
            svg: fs.readFileSync(image, "utf8"), 
            absolutePosition: { x: 30, y: 82}, 
            width: 19, 
            height: 19
        },
    ]
}

function addSubHeader(content, is_break, image) {
    return [
        { 
            text: content, 
            style: 'subHeader', 
            pageBreak: is_break ? 'before' : '', 
            tocItem: true, 
            tocMargin: [60, 5, 0, 0]
        },
        { 
            svg: fs.readFileSync(image, "utf8"), 
            absolutePosition: is_break ? { x: 30, y: 82} : { x: 30, y: 114 }, 
            width: 19, 
            height: 19
        },
    ]
}

function addSubSubHeader(content, is_break, image) {
    return [
        { 
            text: content, 
            style: 'subSubHeader', 
            pageBreak: is_break ? 'before' : '', 
            tocItem: true, 
            tocMargin: [90, 5, 0, 0]
        },
        { 
            svg: fs.readFileSync(image, "utf8"), 
            absolutePosition: is_break ? { x: 30, y: 82} : { x: 30, y: 114 },
            width: 19, 
            height: 19
        },
    ]
}

function addLineAfterHeader() {
    return { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 595-2*30, y2: 10, lineWidth: 1.5, lineColor: "#3577FF" }], margin: [0, 11, 0, 10] }
};

function makeContentIcons() {
    return {}
};

function addConclusion() {
    return htmlToPdfmake(report["report"], {window:window}) 

}


function findGeneById(id) {
    for (let index in words.Genes) {
        if (words.Genes[index].json_id == id) {
            return {
                symbol: words.Genes[index].symbol,
                description: words.Genes[index].description,
            }
        }
    }
}

function findDrugById(id) {
    for (let index in words.Drugs) {
        if (words.Drugs[index].json_id == id) {
            return {
                drug_name: words.Drugs[index].drug_name,
                approved_in_this_disease: words.Drugs[index].approved_in_this_disease
            }
        }
    }
}

function findMarkerById(id, bio_type) {
    if (bio_type == "gv") {
        for (let index in words.GeneticVariants) {
            if (words.GeneticVariants[index].json_id == id) {
                return words.GeneticVariants[index].variant_name
            }
        }
    }
    else {
        for (let index in words.StructuredOtherAssays) {
            if (words.StructuredOtherAssays[index].json_id == id) {
                return words.StructuredOtherAssays[index].assay_result_name
            }
        }
    }
}



function getTMB() {
    for (index in words.StructuredOtherAssays) {
        if (words.StructuredOtherAssays[index].technique == "STR_ASSAY_TMB") {
            return [{
                text: htmlToPdfmake(words.StructuredOtherAssays[index].description, {window: window}),
                leadingIndent: 10, 
                alignment: "justify",
                margin: [0, 10, 0, 10]
            },
            {
                image: "img/tmb-ru.png",
                width: 300,
                //height: 120,
                alignment: "center",
            }]
        }
    }
}

function getGeneticVariants(variant_class) {
    let result = []
    for (let index in words.GeneticVariants) {
        let gv = words.GeneticVariants[index]
        if (variant_class == "STR_CLIN_SIGNIF") {
            condition = gv.variant_class == "STR_CLIN_SIGNIF"
        }
        else {
            condition = (gv.variant_class == variant_class) && (gv.comment != "")
        }
        if (condition) {
            let gene = findGeneById(gv.gene)
            if (gene.symbol == "HACK_DUMMY_GENE") continue;
            result.push(
                {
                    text: gene.symbol,
                    style: "gvGene",
                    margin: [0, 0, 0, 10]
                },
                {
                    text: htmlToPdfmake(addTags(gene.description), {window:window}),
                    style: "text",
                    leadingIndent: 10,
                    margin: [0, 0, 0, 10]
                },
                {
                    text: constants[language]["result"]["ngs"]["geneticVariants"]["variant"] + gv.aa_change,
                    style: "headerInFrame"
                },
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["depth"], style: "boldText"},
                    { text: gv.alt_depth + gv.ref_depth, style: "text" }
                ], style: "margin"},
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["type"], style: "boldText"},
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["translations"][gv.variant_type] + ", " + gv.impact_so, style: "text" }
                ], style: "margin" },
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["allelic_frequency"], style: "boldText"},
                    { text: gv.allelic_frequency, style: "text" }
                ], style: "margin"},
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["germline_somatic"], style: "boldText"},
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["translations"][gv.germline_somatic], style: "text" }
                ], style: "margin"},
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["population_frequency"], style: "boldText"},
                    { text: gv.population_frequency, style: "text" }
                ], style: "margin"},
                { text: [
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["biolog_impact"], style: "boldText"},
                    { text: constants[language]["result"]["ngs"]["geneticVariants"]["translations"][gv.biolog_impact], style: "text" }
                ],  margin: [0, 7, 0, 15] },
                {
                    text: constants[language]["result"]["ngs"]["geneticVariants"]["comment"],
                    style: "headerInFrame"
                },
                htmlToPdfmake(gv.biolog_impact_summary, {window:window}),
                htmlToPdfmake(gv.comment, {window:window}),

            )
        }
    }
    if (result.length == 0) 
        return { 
            text: [
                constants[language]["result"]["ngs"]["geneticVariants"]["no_data"],
                {
                    text: "YourOncoHelp",
                    link: "https://youroncohelp.oncogenotest.com/media/report/OGT-61_report_24-12-2019.pdf",
                    decoration: 'underline'
                }],
            fontSize: 18, 
            alignment: "center"
        }
    return result
}

function createDrugs() {
    let effective_in_this_disease = [
        [{
            colSpan: 4,
            alignment: "center",
            text: [
                { text: constants[language]["therapy"]["tableNames"]["effectiveInThisDisease"]["header"], fontSize: 14,},
                { text: constants[language]["therapy"]["tableNames"]["effectiveInThisDisease"]["subHeader"], fontSize: 12,}
            ]
            
        },
        {}, {}, {}],
        [{
           text: constants[language]["therapy"]["drug"],
           fontSize: 13,
           alignment: "center", 
        },
        {
            text: constants[language]["therapy"]["approved"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["marker"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["level"],
            fontSize: 13,
            alignment: "center",
        }]
    ]

    let effective_in_other_disease = [
        [{
            colSpan: 4,
            alignment: "center",
            text: [
                { text: constants[language]["therapy"]["tableNames"]["effectiveInOtherDisease"]["header"], fontSize: 14,},
                { text: constants[language]["therapy"]["tableNames"]["effectiveInOtherDisease"]["subHeader"], fontSize: 12,}
            ]
        },
        {}, {}, {}],
        [{
           text: constants[language]["therapy"]["drug"],
           fontSize: 13,
           alignment: "center", 
        },
        {
            text: constants[language]["therapy"]["approved"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["marker"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["level"],
            fontSize: 13,
            alignment: "center",
        }]
    ]  

    let noneffective = [
        [{
            colSpan: 4,
            alignment: "center",
            text: [
                { text: constants[language]["therapy"]["tableNames"]["noneffective"]["header"], fontSize: 14,},
                { text: constants[language]["therapy"]["tableNames"]["noneffective"]["subHeader"], fontSize: 12,}
            ]
        },
        {}, {}, {}],
        [{
           text: constants[language]["therapy"]["drug"],
           fontSize: 13,
           alignment: "center", 
        },
        {
            text: constants[language]["therapy"]["approved"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["marker"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["level"],
            fontSize: 13,
            alignment: "center",
        }]
    ]

    let toxic = [
        [{
            colSpan: 4,
            alignment: "center",
            text: [
                { text: constants[language]["therapy"]["tableNames"]["toxic"]["header"], fontSize: 14,},
                { text: constants[language]["therapy"]["tableNames"]["toxic"]["subHeader"], fontSize: 12,}
            ]
        },
        {}, {}, {}],
        [{
           text: constants[language]["therapy"]["drug"],
           fontSize: 13,
           alignment: "center", 
        },
        {
            text: constants[language]["therapy"]["approved"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["marker"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["level"],
            fontSize: 13,
            alignment: "center",
        }]
    ]
    
    let other = [
        [{
            colSpan: 4,
            alignment: "center",
            text: [
                { text: constants[language]["therapy"]["tableNames"]["other"]["header"], fontSize: 14,},
                { text: constants[language]["therapy"]["tableNames"]["other"]["subHeader"], fontSize: 12,}
            ]
        },
        {}, {}, {}],
        [{
           text: constants[language]["therapy"]["drug"],
           fontSize: 13,
           alignment: "center", 
        },
        {
            text: constants[language]["therapy"]["approved"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["marker"],
            fontSize: 13,
            alignment: "center",
        },
        {
            text: constants[language]["therapy"]["level"],
            fontSize: 13,
            alignment: "center",
        }]
    ]

    for (let index in words.Evidences) {
        let result = []
        let evidence = words.Evidences[index]
        if ((evidence.evidence_type != "STR_EVID_TYPE_PREDICTIVE") || (typeof evidence.drugs[0] == "undefined")) continue;
        let marker = evidence.variant_id.length == 0 ? findMarkerById(evidence.assay_id[0], "soa") : findMarkerById(evidence.variant_id[0], "gv");
        marker = marker == "HACK_DUMMY-" ? "-" : marker 
        let number_of_drugs = evidence.drugs.length
        approved = number_of_drugs == 1 ? constants[language]["therapy"]["drugApprovedReplace"][findDrugById(evidence.drugs[0]).approved_in_this_disease] : constants[language]["therapy"]["drugCombinationApprovedReplace"][evidence.approved_combination]
        result.push([
            {
                text: typeof evidence.drugs[0] == "undefined" ? "" : findDrugById(evidence.drugs[0]).drug_name,
                alignment: "center",
                fontSize: 13,
                border: [true, true, true, number_of_drugs == 1]
            },
            {
                rowSpan: number_of_drugs,
                fontSize: 13,
                text: approved,
                alignment: "center"
            },
            {
                rowSpan: number_of_drugs,
                fontSize: 13,
                text: marker,
                alignment: "center"
            },
            {
                rowSpan: number_of_drugs,
                fontSize: 13,
                text: constants[language]["therapy"]["evidenceLevelReplace"][evidence.evidence_level],
                alignment: "center",
                link: evidence.link,
                decoration: 'underline',
            }
        ])
        for (let i = 1; i < number_of_drugs; ++i) {
            result.push([
                {
                    text: findDrugById(evidence.drugs[i]).drug_name,
                    alignment: "center",
                    fontSize: 13,
                    border: [true, false, true, i == number_of_drugs - 1]
                },
                {},
                {},
                {} 
            ])
        } 
        switch(evidence.drug_type) {
            case "STR_DRUG_EFFECTIVE_IN_THIS_DISEASE":
                for (let row in result) {
                    effective_in_this_disease.push(result[row])
                }
                break
            case "STR_DRUG_EFFECTIVE_IN_OTHER_DISEASE":
                for (let row in result) { 
                    effective_in_other_disease.push(result[row])
                }
                break
            case "STR_DRUG_NONEFFECTIVE":
                for (let row in result) {
                    noneffective.push(result[row])
                }
               break
            case "STR_DRUG_TOXIC":
                for (let row in result) {   
                    toxic.push(result[row])
                }
                break
            case "STR_DRUG_OTHER":
                for (let row in result) {
                    other.push(result[row])
                }
                break
            default:
                break
        }
    }

    if (effective_in_this_disease.length == 2) {
        effective_in_this_disease.push([{colSpan: 4, text: constants[language]["therapy"]["not_found"], alignment: "center"},{},{},{}])
    }
    if (effective_in_other_disease.length == 2) {
        effective_in_other_disease.push([{colSpan: 4, text: constants[language]["therapy"]["not_found"], alignment: "center"},{},{},{}])
    }
    if (noneffective.length == 2) {
        noneffective.push([{colSpan: 4, text: constants[language]["therapy"]["not_found"], alignment: "center"},{},{},{}])
    }
    if (toxic.length == 2) {
        toxic.push([{colSpan: 4, text: constants[language]["therapy"]["not_found"], alignment: "center"},{},{},{}])
    }
    if (other.length == 2) {
        other.push([{colSpan: 4, text: constants[language]["therapy"]["not_found"], alignment: "center"},{},{},{}])
    }

    let a = [{
        table: {
            body: effective_in_this_disease,
            heights: 15,
            //dontBreakRows: true
        },
        margin: [0, 0, 0, 30],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#A2FBA9"
                if (rowIndex == 1) return "#CFCFCF"
                return "#F6F6F6"
                //return (rowIndex % 2 === 0) ? '#CCCCCC' : "#EBEBEB";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },
        }
        
    },
    {
        table: {
            body: effective_in_other_disease,
            heights: 15,
            //dontBreakRows: true
        },
        margin: [0, 0, 0, 30],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#D6FBA2"
                if (rowIndex == 1) return "#CFCFCF"
                return "#F6F6F6"
                //return (rowIndex % 2 === 0) ? '#CCCCCC' : "#EBEBEB";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },
        }        
    },
    {
        table: {
            body: noneffective,
            heights: 15,
            //dontBreakRows: true
        },
        margin: [0, 0, 0, 30],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#FBD6A2"
                if (rowIndex == 1) return "#CFCFCF"
                return "#F6F6F6"
                //return (rowIndex % 2 === 0) ? '#CCCCCC' : "#EBEBEB";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },

        }        
    },
    {
        table: {
            body: toxic,
            heights: 15,
            //dontBreakRows: true
        },
        margin: [0, 0, 0, 30],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#FBA2A9"
                if (rowIndex == 1) return "#CFCFCF"
                return "#F6F6F6"
                //return (rowIndex % 2 === 0) ? '#CCCCCC' : "#EBEBEB";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },

        }        
    },
    {
        table: {
            body: other,
            heights: 15,
            //dontBreakRows: true
        },
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#A2A2FB"
                if (rowIndex == 1) return "#CFCFCF"
                return "#F6F6F6"
                //return (rowIndex % 2 === 0) ? '#CCCCCC' : "#EBEBEB";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },

        } 
    },
    {
        text: constants[language]["therapy"]["levelDescription"]["title"],
        style: "genePanelHeader",
        margin: [0, 15, 0, 5]
    },
    {
        ol: [
            {text: constants[language]["therapy"]["levelDescription"]["a"]},
            {text: constants[language]["therapy"]["levelDescription"]["b1"]},
            {text: constants[language]["therapy"]["levelDescription"]["b2"]},
            {text: constants[language]["therapy"]["levelDescription"]["b3"]},
            {text: constants[language]["therapy"]["levelDescription"]["b4"]},
            {text: constants[language]["therapy"]["levelDescription"]["c"]},
            {text: constants[language]["therapy"]["levelDescription"]["d"]},
            {text: constants[language]["therapy"]["levelDescription"]["e"]},
            {text: constants[language]["therapy"]["levelDescription"]["recommendation"], margin: [0, 5, 0, 0], fontSize: 13}
        ],
        type: 'none',
        style: {
            font: "Extralight",
            fontSize: 14,
            lineHeight: 1.2,
        },
    }
    ]
    return a

}


function createClinicalTrails() {
    intro = {
        text: constants[language]['clinicalTrail']["intro"],
        leadingIndent: 10,
        alignment: "justify",
        margin: [0, 0, 0, 10]
    }
    let arr = []
    arr.push(
        [
            { 
                text: constants[language]['clinicalTrail']["id"],
                style: "text",
                alignment: "center",
            },
            { 
                text: constants[language]['clinicalTrail']["phase"],
                style: "text",
                alignment: "center",
            },
            { 
                text: constants[language]['clinicalTrail']["title"],
                style: "text",
                alignment: "center",
            },
            { 
                text: constants[language]['clinicalTrail']["place"],
                style: "text",
                alignment: "center",
            },
            { 
                text: constants[language]['clinicalTrail']["contact"],
                style: "text",
                alignment: "center",
            },
        ]
    )
    for (let trail in words.ClinicalTrials) {
        arr.push(
            [
                { 
                    text: words.ClinicalTrials[trail].nct_id,
                    link: words.ClinicalTrials[trail].link,
                    decoration: 'underline',
                    style: "text",
                    alignment: "center",
                },
                { 
                    text: words.ClinicalTrials[trail].phase,
                    style: "text",
                    alignment: "center",
                },
                { 
                    text: words.ClinicalTrials[trail].name,
                    style: "text",
                    alignment: "center",
                },
                { 
                    text: words.ClinicalTrials[trail].location,
                    style: "text",
                    alignment: "center",
                },
                { 
                    text: words.ClinicalTrials[trail].contacts,
                    style: "text",
                    alignment: "center",
                },
            ]
        )
    }
    return [intro, {
        table: {
            widths: [68, 32, 140, 90, 150],
            headerRows: 1,
            body: arr,
            dontBreakRows: true
        },
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#9F9F9F"
                return (rowIndex % 2 === 0) ? '#dddddd' : "#EFEFEF";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },

        }
    }] 
};

function createSOA(soa_type) {
    let arr = []
    let desc = []
    arr.push(
        [
            { 
                text: constants[language]["result"]["soa"]["marker"],
                style: "text",
                alignment: "center",
            },
            { 
                text: constants[language]["result"]["soa"]["result"],
                style: "text",
                alignment: "center",
            },
        ]
    )
    for (let index in words.StructuredOtherAssays) {
        if (words.StructuredOtherAssays[index].technique == soa_type) {
            arr.push(
                [
                    { 
                        text: words.StructuredOtherAssays[index].assay,
                        style: "text",
                        alignment: "center",
                        linkToDestination: "soa_" + words.StructuredOtherAssays[index].assay,
                        decoration: 'underline',
                    },
                    { 
                        text: words.StructuredOtherAssays[index].value,
                        style: "text",
                        alignment: "center",
                    },
                ]
            )
            desc.push(
                [
                    {
                        text: words.StructuredOtherAssays[index].assay,
                        style: "gvGene",
                        id: "soa_" + words.StructuredOtherAssays[index].assay,
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: constants[language]["result"]["soa"]["description"],
                        style: "headerInFrame",
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: htmlToPdfmake(addTags(words.StructuredOtherAssays[index].description), {window: window}),
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: constants[language]["result"]["soa"]["comment"],
                        style: "headerInFrame",
                        margin: [0, 10, 0, 0]
                    },
                    {
                        text: htmlToPdfmake(addTags(words.StructuredOtherAssays[index].comment), {window: window}),
                        margin: [0, 10, 0, 0]
                    }
                ]
            )
        }
    }
    return [{
        table: {
            widths: ["25%", "75%"],
            headerRows: 1,
            body: arr,
        },
        margin: [0, 0, 0, 15],
        layout: {
            fillColor: function (rowIndex, node, columnIndex) {
                if (rowIndex == 0) return "#9F9F9F"
                return (rowIndex % 2 === 0) ? '#dddddd' : "#EFEFEF";
            },
            hLineWidth: function (i, node) {
                return 3;
            },
            vLineWidth: function (i, node) {
                return 3;
            },
            hLineColor: function (i, node) {
                return "white";
            },
            vLineColor: function (i, node) {
                return "white";
            },

        }
    }, desc] 
}


function createGenePanel() {
    types = ["STR_CLIN_SIGNIF", "STR_POLYMORPHISM", "STR_VUS", "STR_NO_MUTATIONS"]
    intro = {
        text: constants[language]["result"]["ngs"]["panel"]["intro"],
        alignment: "justify",
        leadingIndent: 10,
        margin: [0, 10, 0, 0]
    }

    gene_panel = [intro]
    for (let k=0; k < 4; k++) {
        gene_panel.push({
            text: constants[language]["result"]["ngs"]["geneticVariants"]["translations"][types[k]],
            style: "genePanelHeader"
        })
        let arr = [];
        for (let index in words.Genes) { 
            if ((words.Genes[index].gene_type == types[k]) && (words.Genes[index].symbol != "HACK_DUMMY_GENE")) { 
                arr.push(words.Genes[index].symbol)
            }
        }
        arr.sort()
        let len = arr.length
        let numberOfRow = Math.ceil(len / 8)
        // create table with numberOfRow rows and 8 columns
        let bodyTable = []

        for (let i = 0; i < numberOfRow; ++ i) {
            let rowContent = []
            for (let j = 0; j < 8; ++ j) {
                curLen = 8*i + j 
                if (curLen < len) {
                    rowContent.push(
                    { 
                        text: arr[8*i + j], 
                        style: "text",
                        alignment: "center",
                        fillColor: constants[language]["result"]["ngs"]["panel"]["color"][types[k]],  
                        //border: [false, false, false, false],
                        margin: [0, 0, 0, 0],
                    })
                }
                else rowContent.push( { text: "",  border: [false, false, false, false], style: "text",})
            }
            bodyTable.push(rowContent)
        }
        gene_panel.push({
            table: {
                headerRows: 0,
                widths: [ "12.125%", "12.125%", "12.125%", "12.125%", "12.125%", "12.125%", "12.125%", "12.125%"],
                heights: 15,
                body: bodyTable,
                dontBreakRows: true
            },
            layout: {
                hLineWidth: function (i, node) {
                    return 3;
                },
                vLineWidth: function (i, node) {
                    return 3;
                },
                hLineColor: function (i, node) {
                    return "white";
                },
                vLineColor: function (i, node) {
                    return "white";
                },
                // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // paddingLeft: function(i, node) { return 4; },
                // paddingRight: function(i, node) { return 4; },
                 paddingTop: function(i, node) { return 10; },
                // paddingBottom: function(i, node) { return ; },
            }
        })
    }
    return gene_panel
} 


const  makeDocDefinition = (data) => {
    const libs = data.libs;

    return {
        pageMargins: [ 30, 85, 35, 80],
        pageSize: 'A4',

        
        header: function (currentPage) {
            return currentPage > 1 ? {
                table: {
                    widths: [ "45%", "18%", '37%' ],
                    body: [
                        [{rowSpan: 4, svg: fs.readFileSync("img/Logo.svg", "utf8"), width: 200}, { text: constants[language]["header"]["patient"], style: "headerColontitle",}, { text: patient["fio"], style: "headerColontitle",alignment: "right"}],
                        ["", { text: constants[language]["header"]["ogt_id"], style: "headerColontitle"}, { text: patient["ogt_id"], style: "headerColontitle", alignment: "right"}],
                        ["", { text: constants[language]["header"]["diagnosis"], style: "headerColontitle",}, { text: patient["diagnosis"], style: "headerColontitle", alignment: "right"}],
                        ["", { text: constants[language]["header"]["report_created"], style: "headerColontitle",}, { text: patient["report_created"], alignment: "right", style: "headerColontitle",}],
                    ],
                },
                layout: "noBorders",
                margin: [30, 20, 30, 0],
                fontSize: 8
            } : {};
        },
        //pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //    return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
        //},
        footer: function (currentPage, pageCount) {
            return currentPage > 1 ? [
                { 
                    canvas: [
                        { 
                            type: 'line', 
                            x1: 30, 
                            y1: 0, 
                            x2: 595-30, 
                            y2: 0, 
                            lineWidth: 1.5, 
                            lineColor: "#3577FF" 
                        }], 
                        margin: [0, 0, 0, 5] 
                    },
                {
                    text: [
                        {text: "www.oncogenotest.com \n", link: "www.oncogenotest.com", style: "footerColontitle", alignment: "justify", },
                        {text: "info@oncogenotest.com \n", style: "footerColontitle", alignment: "justify"},
                        {text: "8-(800)-201-15-69 ", style: "footerColontitle", alignment: "justify"},
                    ],   
                    absolutePosition: {
                        x: 30,
                        y: 10
                    },
                },
                { 
                    text: "Данный отчет предназначен для интерпретации\nсертифицированными специалистами в области\nклинической онкологии.", 
                    style: "footerColontitle", 
                    alignment: "justify",
                    absolutePosition: {
                        x: 200,
                        y: 10
                    },
                    width: 220,
                },
                { 
                    text: currentPage, 
                    alignment: "center", 
                    style: "pageNumber",
                    absolutePosition: {
                        x: 0,
                        y: 50
                    },
                },        
                {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 70,
                            h: 20,
                            r: 4,
                            lineColor: 'blue',
                            color: '#3577FF',
                            opacity: 0.8,
                        },
                    ],
                    absolutePosition: {
                        x: 45, 
                        y: 45
                    }
                },
                { 
                    canvas: [
                        { 
                            type: 'line', 
                            x1: 0, 
                            y1: 0, 
                            x2: 0,
                            y2: 60, 
                            lineWidth: 1.5, 
                            lineColor: "#3577FF" 
                        }
                    ], 
                    absolutePosition: {
                        x: 508, 
                        y: 0
                    }},
                { 
                    text: constants[language]["footer"]["to_content"], 
                    font: "Med", 
                    italics: true, 
                    fontSize: 12, 
                    color: "#ffffff",
                    absolutePosition: {
                        x: 50, 
                        y: 50
                    }, 
                    linkToPage: 2
                },
                {
                    qr: "https://youroncohelp.oncogenotest.com/media/report/OGT-61_report_24-12-2019.pdf", 
                    fit: 70,
                    alignment: "center", 
                    absolutePosition: {
                        x: 480, 
                        y: 10
                    },
                } 

            ] : {};
        },

        background: function(currentPage, pageSize) { 
            if (currentPage == 1) {
                return [
                    {
                        table: {
                            widths: [ 70, 250 ],
                            body: [
                                [{ text: constants[language]["header"]["patient"], style: "patientInfoTitle",}, { text: patient["fio"], style: "patientInfoTitle",alignment: "right"}],
                                [{ text: constants[language]["header"]["ogt_id"], style: "patientInfoTitle"}, { text: patient["ogt_id"], style: "patientInfoTitle", alignment: "right"}],
                                [{ text: constants[language]["header"]["diagnosis"], style: "patientInfoTitle",}, { text: patient["diagnosis"], style: "patientInfoTitle", alignment: "right"}],
                                [{ text: constants[language]["header"]["report_created"], style: "patientInfoTitle",}, { text: patient["report_created"], alignment: "right", style: "patientInfoTitle",}],
                            ],
                        },
                        absolutePosition: { x: 210, y: 40},
                        layout: {
                            fillColor: function (rowIndex, node, columnIndex) {
                                return "#CEF2F2";
                            },
                            hLineWidth: function (i, node) {
                                return 3;
                            },
                            vLineWidth: function (i, node) {
                                return 3;
                            },
                            hLineColor: function (i, node) {
                                return "white";
                            },
                            vLineColor: function (i, node) {
                                return "white";
                            },
                        }
                    },
                //{
                //    image: "img/ogt_back.svg", width: pageSize.width, height: pageSize.height, opacity: 0.5, absolutePosition: {x: 0, y: 0}   
                //},
                {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 564,
                            w: pageSize.width,
                            h: pageSize.height - 564,
                            color: "#0077FE",
                        },
                    ]
                },
                { 
                    text: constants[language]["titlePage"]["package_name_1"], style: "titleONCO", absolutePosition: {x: 0, y: 533} },
                { 
                    text: constants[language]["titlePage"]["package_name_2"], style: "titleMAX",  absolutePosition: { x: 80, y: 674 }, 
                },
                ]
            }
            if (currentPage == 2) {
                return [
                    {
                        svg: fs.readFileSync("img/lens.svg", "utf8"), width: 18, height: 18, margin: [30, 125, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/info.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/hiring.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 17]
                    },
                    //{
                    //    svg: fs.readFileSync("img/monitor.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    //},
                    {
                        svg: fs.readFileSync("img/stethoscope.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 14]
                    },
                    {
                        svg: fs.readFileSync("img/pills.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/test-tube.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/microscope.svg", "utf8"), width: 15, height: 15, margin: [60, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/fish.svg", "utf8"), width: 15, height: 15, margin: [60, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/msi.svg", "utf8"), width: 15, height: 15, margin: [60, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/dna.svg", "utf8"), width: 15, height: 15, margin: [60, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/clin_sign.svg", "utf8"), width: 15, height: 15, margin: [90, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/polymorphism.svg", "utf8"), width: 15, height: 15, margin: [90, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/vus.svg", "utf8"), width: 15, height: 15, margin: [90, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/no_mut.svg", "utf8"), width: 15, height: 15, margin: [90, 0, 0, 12]
                    },
                    {
                        svg: fs.readFileSync("img/sanger.svg", "utf8"), width: 15, height: 15, margin: [90, 0, 0, 14]
                    },
                    {
                        svg: fs.readFileSync("img/red.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/abc.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 13]
                    },
                    {
                        svg: fs.readFileSync("img/books.svg", "utf8"), width: 18, height: 18, margin: [30, 0, 0, 16]
                    },
                ]
            }
        },

        content: [
            { svg: fs.readFileSync("img/Logo.svg", "utf8"), width: 520, alignment: "center", margin: [0, 150, 0 ,50]},
            { text: constants[language]["titlePage"]["report_name_1"], style: "titleReport", margin: [0, 0, 0, 10]},
            { text: constants[language]["titlePage"]["report_name_2"], style: "titleReport", margin: [0, 0, 0, 10]},
            { text: constants[language]["titlePage"]["report_name_3"], style: "titleReport", margin: [0, 0, 0, 10], pageBreak: "after"},
            { 
                toc: {
                    title: 
                    {   stack: [
                        { text: constants[language]["sectionNames"]["content"], style: "header", leadingIndent: 0 },
                        addLineAfterHeader(),
                        ] 
                    }    , 
                    //margin: [0, 20, 0, 20],
                    numberStyle: "",
                    textStyle: "toc"
                },
                
            },

            addHeader(constants[language]["sectionNames"]["glossary"], true, "img/lens.svg"),
            addLineAfterHeader(),
            ogt.addDictTerm(language),

            addHeader(constants[language]["sectionNames"]["notation_list"], true, "img/info.svg"), 
            addLineAfterHeader(),
            ogt.addAbbreviation(language),

            addHeader(constants[language]["sectionNames"]["research_info"], true, "img/hiring.svg"),
            addLineAfterHeader(),
            ogt.addResearchInfo(language),

            //addHeader(constants[language]["sectionNames"]["result_interpretation"], true, "img/monitor.svg"),
            //addLineAfterHeader(),
            

            addHeader(constants[language]["sectionNames"]["conclusion"], true, "img/stethoscope.svg", ),
            addLineAfterHeader(),
            addConclusion(),

            addHeader(constants[language]["sectionNames"]["therapy"], true, "img/pills.svg"),
            addLineAfterHeader(),
            createDrugs(),

            addHeader(constants[language]["sectionNames"]["result"], true, "img/test-tube.svg",),
            addLineAfterHeader(),
            addSubHeader(constants[language]["sectionNames"]["ihc"], false, "img/igh.svg"),
            addLineAfterHeader(),
            createSOA("STR_ASSAY_IHC"),

            addSubHeader(constants[language]["sectionNames"]["fish"], true, "img/fish.svg"),
            addLineAfterHeader(),
            createSOA("STR_ASSAY_FISH"),

            addSubHeader(constants[language]["sectionNames"]["msi"], true, "img/msi.svg"),
            addLineAfterHeader(),
            createSOA("STR_ASSAY_MSI"),

            addSubHeader(constants[language]["sectionNames"]["sequence"], true, "img/dna.svg"),
            addLineAfterHeader(),

            addSubSubHeader(constants[language]["sectionNames"]["clinical_significant"], false, "img/clin_sign.svg"),
            addLineAfterHeader(),
            getGeneticVariants("STR_CLIN_SIGNIF"),

            addSubSubHeader(constants[language]["sectionNames"]["polymorphism"], true, "img/polymorphism.svg"),
            addLineAfterHeader(),
            getGeneticVariants("STR_POLYMORPHISM"),

            addSubSubHeader(constants[language]["sectionNames"]["vus"], true, "img/vus.svg"),
            addLineAfterHeader(),
            getGeneticVariants("STR_VUS"),

            addSubSubHeader(constants[language]["sectionNames"]["tmb"], true, "img/no_mut.svg"),
            addLineAfterHeader(),
            getTMB(),

            addSubSubHeader(constants[language]["sectionNames"]["panel"], true, "img/sanger.svg"),
            addLineAfterHeader(),
            createGenePanel(),

            addHeader(constants[language]["sectionNames"]["clinical_trail"], true, "img/red.svg"),
            addLineAfterHeader(),
            createClinicalTrails(),

            addHeader(constants[language]["sectionNames"]["additional_information"], true, "img/abc.svg"),
            addLineAfterHeader(),
            ogt.addAdditionalInfo(language),

            addHeader(constants[language]["sectionNames"]["bibliography"], true, "img/books.svg"),
            addLineAfterHeader(),
            returnDebug(libs),
            //list_of_reference,
            //addBibliography(),
        ],
        defaultStyle: {
            font: "Extralight",
            fontSize: 12,
        },
        styles: {
            // Любой текст
            text: {
                font: "Extralight",
                fontSize: 12,
                margin: [0, 10, 0, 0],
                alignment: "justify"
            },
            italicaText: {
                font: "Extralight",
                italics: true,
                fontSize: 12,
            },
            boldText: {
                font: "Med",
                fontSize: 12,
                //margin: [0, 15, 0, 0]
            },
            // header - заголовки (напр., Препараты, заключение)
            header: {
                font: "Med",
                fontSize: 19,
                lineHeight: 0,
                leadingIndent: 30
            },
            // Подзаголовок (напр., игх и фиш)
            subHeader: {
                font: "Med",
                fontSize: 17,
                lineHeight: 0,
                leadingIndent: 30 
            },
            subSubHeader: {
                font: "Med",
                fontSize: 17,
                lineHeight: 0,
                leadingIndent: 30 
            },
            pageNumber: {
                font: "Reg",
                fontSize: 20
            },
            headerInFrame: {
                font: "Reg",
                fontSize: 14,
                background: "#3577FF",
                color: "#FFFFFF",
                margin: [0, 5, 0, 0]
            },
            titleONCO: {
                font: "Heavy",
                fontSize: 239,
                alignment: "center", 
                characterSpacing: -23,
                color: "#FFFFFF",
                lineHeight: 0,
            },
            titleMAX: {
                font: "Heavy",
                fontSize: 239,
                alignment: "center", 
                characterSpacing: -20,
                color: "#FFFFFF",
                alignment: "justify",
                lineHeight: 0,
            },
            titleReport: {
                font: "Light",
                fontSize: 36,
                color: "#FFFFFF",
                background: "#3577FF"
            },
            toc: {
                font: "Extralight",
                fontSize: 18,
            },
            headerColontitle: {
                font: "Extralight",
                fontSize: 10
            },
            footerColontitle: {
                font: "Extralight",
                fontSize: 10,
            },
            patientInfoTitle: {
                font: "Med",
                fontSize: 16,
            },
            margin: {
                margin: [0, 7, 0, 0]
            },
            dictTerm: {
                font: "Reg",
                fontSize: 12,
                italics: true,
            },
            genePanelHeader: {
                font: "Med",
                //italics: true,
                fontSize: 16,
                margin: [0, 15, 0, 0]
            },
            gvGene: {
                font: "Med",
                italics: true,
                fontSize: 30,
                color: "#FFFFFF",
                background: "#0077FE",
            }
        }
    };
}

async function main() {

    const libs = await addBibliography(); //1sec
    const docDefinition = makeDocDefinition({
        libs,
    });
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('OGT-61_report.pdf'));
    pdfDoc.end();
}

main();


 