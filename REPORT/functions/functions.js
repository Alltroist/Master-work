var constants = require('./constants')
var patient = require('./patient')

module.exports = {
    addAdditionalInfo: function (language) {
        return (language == "ru") ? [
            { 
                text: `Приведенные результаты носят исключительно информационный характер и не являются методом диагностики, профилактики или лечения. Сведения о потенциальной эффективности препаратов при данном молекулярном профиле взяты из опубликованных данных (научные статьи, клинические руководства, результаты клинических исследований и т.д.). Онко Генотест отказывается от каких-либо заявлений или гарантий относительно опубликованных данных и научной литературы, включая информацию и выводы об эффективности/неэффективности терапевтических агентов, которые включены или исключены из настоящего отчета. Всю ответственность за принятие итоговых клинических решений по терапии несет лечащий врач.`,
                alignment: "justify",
                leadingIndent: 10,
                margin: [0, 0, 0, 10]
            },
            {
                text: `Результаты основаны на секвенировании следующего поколения (NGS) ряда участков для 409 генов (панель Ion AmpliSeq™ Comprehensive Cancer Panel). Варианты, присутствующие в других областях обнаружены не будут. В анализируемых участках также могут находится генетические варианты, которые не детектируются из-за технологических ограничений. Cредняя глубина покрытия для панели Ion AmpliSeq™ Comprehensive Cancer Panel составила 832x. Варианты с глубиной покрытия менее 50х не рассматривали. `,
                leadingIndent: 10,
                alignment: "justify",
                margin: [0, 0, 0, 10]
            },
            {
                text: `Координаты обнаруженных генетических вариантов приведены для версии референсного генома hg19. Биоинформатический анализ проводился с помощью программного обеспечения Онко Генотест. По результатам секвенирования не определяли слившиеся гены и хромосомные перестройки, изменения копийности, тандемные дупликации, микросателлитную нестабильность, области потери гетерозиготности, эпигенетические изменения. `,
                leadingIndent: 10,
                alignment: "justify",
                margin: [0, 0, 0, 10]                
            },
            {
                text: `Большинство вариантов с неизвестной клинической значимостью и генетических полиморфизмов в отчете не указаны и доступны через платформу YourOncoHelp. Классификация обнаруженных вариантов как герминативных/соматических может быть недостоверна. Уровни доказательности сформированы как адаптированые рекомендации AMP/ASCO/CAP. Данные об активных клинических испытаниях взяты с сайта www.clinicaltrials.gov. Указанные клинические испытания могут не подходить для пациента, и врач пациента должен самостоятельно исследовать информацию о клинических испытаниях. Онко Генотест не гарантирует, что какое-либо конкретное клиническое испытание будет эффективным при лечении любого конкретного состояния.`,
                leadingIndent: 10,
                alignment: "justify"
            }
        ] : 
        [
            { 
                text: `These results are for informational purposes only and do not present a method of diagnosis, prevention, or treatment. Information about the potential ecacy of drugs in this molecular prole are taken from published data (scientic articles, clinical guidelines, results of clinical studies, etc.). Onco Genotest disclaims any representations or warranties regarding published data and scientic literature, including information and conclusions about the effectiveness/ineffectiveness of therapeutic agents that are included or excluded from this report. All responsibility for the nal clinical decisions on therapy lies with the attending physician.`,
                alignment: "justify",
                leadingIndent: 10,
                margin: [0, 0, 0, 10]
            },
            {
                text: `The results are based on the next-generation sequencing (NGS) of a number of sites for 409 genes (Ion AmpliSeq™ Comprehensive Cancer Panel). Options present in other areas will not be detected. Genetic variants that are not detected due to technological limitations may also be found in the analyzed areas. The median depth of coverage - 553х (average depth of coverage 610 x). Options with a depth of coverage less than 120x were not considered.`,
                leadingIndent: 10,
                alignment: "justify",
                margin: [0, 0, 0, 10]
            },
            {
                text: `The coordinates of the detected genetic variants are given for the hg19 reference genome version. Bioinformatic analysis was performed using Onco Genotest software. According to the results of sequencing, fused genes and chromosomal rearrangements, copy number changes, tandem duplications, microsatellite instability, areas of loss of heterozygosity, epigenetic changes were not determined.`,
                leadingIndent: 10,
                alignment: "justify",
                margin: [0, 0, 0, 10]
            },
            {
                text: `Most variants with unknown clinical signicance and genetic polymorphisms are not listed in the report and are available through YourOncoHelp platform. Due to the sequencing of only the tumor sample, the classication of the detected variants as germinative/somatic may be unreliable. Levels of evidence are formed as adapted AMP/ASCO/CAP recommendations. Data on active clinical trials obtained from the resource www.clinicaltrials.gov. These clinical trials may not be suitable for the patient, and the attending physician should independently investigate the clinical trial information. Onco Genotest does not guarantee that any clinical trial will be effective in treating any particular condition.`,
                leadingIndent: 10,
                alignment: "justify",
            }

        ]
    },

    addResearchInfo: function(language) {
        return [
            { text: constants[language]["researchInfo"]["information_about_patient"], style: "headerInFrame"},

            { text: [
                { text: constants[language]["researchInfo"]["patient"], style: "boldText"},
                { text: patient["fio"], style: "text" }
            ], style: "margin"},
            
            { text: [
                { text: constants[language]["researchInfo"]["diagnosis"], style: "boldText"},
                { text: patient["diagnosis"], style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["anamnesis"], style: "boldText"},
                { text: patient["anamnesis"], style: "text"}
            ], style: "margin"},

            { text: constants[language]["researchInfo"]["information_about_sample"], style: "headerInFrame"},



            { text: [
                { text: constants[language]["researchInfo"]["sample_type"], style: "boldText"},
                { text: patient["sample_type"], style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["sample_date"], style: "boldText"},
                { text: patient["sample_date"], style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["sample_origin"], style: "boldText"},
                { text: patient["sample_origin"], style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["sample_proportion"], style: "boldText"},
                { text: patient["sample_proportion"], style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["sample_histology"], style: "boldText"},
                { text: patient["sample_histology"],  style: "text"}
            ], style: "margin"},

            { text: [
                { text: constants[language]["researchInfo"]["photo_sample"], style: "boldText"},
                //{ text: "описание того, как происходило окрашивание", style: "text"}
            ], style: "margin"},

            { image: "img/OGT-61_histology.png", width: 534, height: 300, margin: [0, 0, 0, 20]},

            { text: "Состав исследования ONCOMAX ", style: "headerInFrame"},

            { text: "Проведен ряд тестов:", style: "text"},
            {
    			ol: [
                    {
                        text: 'Иммуногистохимическое исследование материала первичной опухоли',
                        style: "text"
                    },
                    {
                        text: 'Высокопроизводительное секвенирование ДНК с использованием панели Ion Ion AmpliSeq™ Comprehensive Cancer Panek (409 гена)',
                        style: "text"
                    }
                ], 
                margin: [0, 0, 0, 10],
                style: "text",  
            },
            
            { 
                text: `Результаты тестов были обработаны биоинформатиками и проанализированы генетиками и клиническими онкологами с целью нахождения биомаркеров, связанных с потенциальной эффективностью/неэффективностью или токсичностью противоопухолевых препаратов. Интерпретация результатов анализов проведена с учетом актуальных клинических рекомендаций по терапии онкологических заболеваний (NCCN, ESMO, АОР, RUSSCO) и основана на сведениях о клинической значимости обнаруженных биомаркеров, опубликованных в научных статьях, клинических руководствах и результатах клинических исследований. Уровни доказательности сформированы как адаптированные рекомендации AMP/ASCO/CAP.`,
                style: "text",
                leadingIndent: 10,
            },
            { 
                text: `Онко Генотест отказывается от каких-либо заявлений или гарантий относительно опубликованных данных и научной литературы, включая информацию и выводы об эффективности/неэффективности терапевтических агентов, которые включены или исключены из настоящего отчета. Всю ответственность за принятие итоговых клинических решений по терапии несет лечащий врач.`,
                style: "text",
                leadingIndent: 10,
            },
            { 
                text: `Приведенные результаты носят исключительно информационный характер и не являются методом диагностики, лечения или профилактики.`,
                style: "text",
                leadingIndent: 10,
            },
        ]
    },

    addDictTerm: function(language) {
        return (language == "ru") ? [
            { 
                text: [
                    {
                        text: "Генетический вариант",
                        style: "dictTerm",
                    },
                    { 
                        text: " – вариант последовательности ДНК, отличающийся от референсной последовательности генома человека.",
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Полиморфизм",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – генетический вариант, который встречается в популяции чаще чем 1 на 100 индивидуумов (т.е. частота в популяции превышает 1%), и не ассоциирован с фенотипом какого-либо заболевания (не является потенциально патогенным) `,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Мутация ",
                        style: "dictTerm",
                    },
                    { 
                        text: " – генетический вариант, который достоверно связан с фенотипом какого-либо заболевания.",
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [ 
                    "Приведенные выше термины употребляются согласно значениям, принятым Human Genome Variation Society, ",
                    { text: "HGVC", link: "http://varnomen.hgvs.org/bg-material/glossary/", decoration: 'underline'},
                ],
                style: "boldText", 
                margin: [0, 7, 0, 0]
            },

            { 
                text: [
                    {
                        text: "Аллельная частота",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – доля данного аллеля в заданном генном локусе. С помощью высокопроизводительного секвенирования аллельная частота оценивается как доля прочтений (reads), несущих аллель. Например, если всего данный сайт покрыт 20 прочтениями, и 8 из них несут интересующий вариант, то аллельная частота составит 8/20=40%. Для герминативного генетического варианта находящимся в гетерозиготном состоянии аллельная частота составляет около 50%. Для герминативного и гомозиготного варианта аллельная частота составляет около 100%. В случае соматических вариантов из- за наличия опухолевой гетерогенности аллельная частота может принимать любые значения в диапазоне 0-100%. `, 
                        style: "text",
                        alignment: "justify"},
                ], 
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Вариант с неизвестной значимостью",
                        style: "dictTerm",
                    },
                    { 
                        text: `(англ. “variants of unknown signifcance, VUS”) – в настоящий момент для данного генетического варианта отсутствуют сведения о его терапевтической или прогностической значимости. Однако такие сведения могут быть опубликованы в дальнейшем.`,
                        style: "text",
                        alignment: "justify"},
                ],
                style: "margin"
            },

            { 
                text: [
                    {
                        text: "Клинически значимый вариант",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – генетический вариант, ассоциированный с определенными клинически важными нарушениями функции гена или кодируемого им белка, которые охарактеризованы в научной литературе и других авторитетных источниках. Для данного генетического варианта существуют свидетельства о его прогностической или диагностической ценности.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Уровень доказательности",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – степень достоверности опубликованных сведений о клинической значимости биомаркера. В настоящем исследовании уровни доказательности сформированы как адаптированные рекомендации AMP/ASCO/CAP. Максимальный уровень доказательности (уровень “A”) соответствует одобрению FDA или рекомендации NCCN, ASCO, ESMO, МинЗдрава, RUSSCO и т.д. Минимальный уровень доказательности (уровень “E”) соответствует вычислительному предсказанию (компьютерному прогнозу) и не подкреплен экспериментальными и клиническими данными.`, 
                        alignment: "justify",
                        style: "text"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Частота в популяции",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – доля конкретного генетического варианта среди всех имеющихся в популяции. Генетические варианты с высокой популяционной частотой (обычно больше 1%) обычно считаются непатогенными.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },
        ] : 
        [
            { 
                text: [
                    {
                        text: "Genetic variant",
                        style: "dictTerm",
                    },
                    { 
                        text: " – a variant of DNA sequence that differs from the reference sequence of the human genome.",
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Polymorphism",
                        style: "dictTerm",
                    },
                    { 
                        text: ` –  a genetic variant that occurs more often than 1 per 100 population individuals (i.e., the frequency in the population exceeds 1%) and is not associated with the phenotype of any disease (non pathogenic).`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Mutation",
                        style: "dictTerm",
                    },
                    { 
                        text: " – a genetic variant that is reliably associated with the phenotype of any disease.",
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [ 
                    "The terms above are used according to the values adopted by the Human Genome Variation Society, ",
                    { text: "HGVC", link: "http://varnomen.hgvs.org/bg-material/glossary/", decoration: 'underline'},
                ],
                style: "boldText", 
                margin: [0, 7, 0, 0]
            },

            { 
                text: [
                    {
                        text: "Allele frequency",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – the proportion of specic allele in a given gene locus. Using high-throughput sequencing, the allelic frequency is estimated as the fraction of reads carrying the allele. For example, if the whole site is covered with 20 readings and 8 of them carry the variant that presents interest, the allele frequency for this case is 8/20 = 40%. For the germinative genetic variant in the heterozygous state, the allele frequency is about 50%. For the germinative and homozygous variant, the allele frequency is about 100%. In case of somatic variants, due to the presence of tumor heterogeneity, the allele frequency can take any values in the range of 0-100%.`, 
                        style: "text",
                        alignment: "justify"},
                ], 
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Variants of unknown signicance (VUS)",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – there is no information about therapeutic or prognostic signicance for this genetic variant at the moment. However, such information may be published in the future.`,
                        style: "text",
                        alignment: "justify"},
                ],
                style: "margin"
            },

            { 
                text: [
                    {
                        text: "Clinically signicant variant",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – is a genetic variant associated with certain clinically important dysfunctions of a gene or a protein encoded by it, which are described in scientic literature and other reliable sources. For this genetic variant, there is evidence of its predictive or diagnostic value.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Level of evidence",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – the degree of reliability of published information about the clinical signicance of the biomarker. In this study, the levels of evidence are formed as an adapted AMP/ASCO/CAP recommendation. The maximum level of evidence (level “A”) corresponds to the FDA approval or NCCN, ASCO, ESMO, Ministry of Health, RUSSCO recommendations etc. The minimum level of evidence (“E” level) corresponds to the computational prediction (computer prediction) and is not supported by experimental and clinical data.`, 
                        alignment: "justify",
                        style: "text"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "Population Frequency",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – the proportion of a particular genetic variant among all available in thepopulation. Genetic variants with a high population frequency (usually more than 1%) are usually considered to be non-pathogenic.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },
        ]
    },

    addAbbreviation: function(language) {
        return (language == "ru") ? [
            { 
                text: [
                    {
                        text: "ВБП",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “progression-free survival, PFS”) – выживаемость без прогрессирования.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "ДИ",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “confidence interval, CI”) – доверительный интервал, представляет собой числовой интервал с высокой вероятностью (чаще всего 95%) содержащий истинное значение переменной.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "НМРЛ",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – немелкоклеточный рак легкого.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "ОВ",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “overall survival, OS”) – общая выживаемость.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "ОР",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “hazard ratio, HR”) – отношение рисков.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "FFPE",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “Formalin-fixed, Paraffin-embedded”) – образец ткани фиксированный в формалине и заключенный в парафиновые блоки. Качество ДНК, выделенной из FFPE-образцов может повлиять на последующее выполнение генетических анализов.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },
            
            { 
                text: [
                    {
                        text: "WT",
                        style: "dictTerm",
                    },
                    { 
                        text: ` (англ. “wild type”) – аллель дикого типа, т.е. данный участок генома не содержит мутаций или вероятно патогенных вариантов.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            }, 
        ] : 
        [
            { 
                text: [
                    {
                        text: "PFS",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – progression-free survival.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "CI (Condence Interval)",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – a numerical interval with a high probability (more often reaches about 95%) containing the true value of the variable.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "НМРЛ",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – немелкоклеточный рак легкого.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "OS",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – overall survival level.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "HR (Hazard Ratio)",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – represents the risk ratio.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "ORR (Objective Response Rate_",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – the frequency of the objective response.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },

            { 
                text: [
                    {
                        text: "FFPE (Formalin-Fixed Paran-Embedded)",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – stands for a tissue sample xed in formalin and enclosed in paran blocks. The quality of DNA extracted from FFPE samples may inuence the subsequent execution of genetic analyzes.`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            },
            
            { 
                text: [
                    {
                        text: "WT (Wild Type)",
                        style: "dictTerm",
                    },
                    { 
                        text: ` – a genome segment which does not contain mutations or likely pathogenic variants`,
                        style: "text",
                        alignment: "justify"
                    },
                ],
                style: "margin" 
            }, 
        ]
    }
}