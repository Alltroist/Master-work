module.exports = {
	ru: {
		titlePage: {
			report_name_1: "ОТЧЕТ",
			report_name_2: "О МОЛЕКУЛЯРНО-ГЕНЕТИЧЕСКОМ",
			report_name_3: "ТЕСТИРОВАНИИ",
			package_name_1: "ONCO",
			package_name_2: "MAX"
		},
		header: {
			patient: "Пациент",
			ogt_id: "Код",
			diagnosis: "Диагноз",
			report_created: "Отчет составлен",
		},
		footer: {
			cite: "www.oncogenotest.com",
			email: "info@oncogenotest.com",
			phone: "8-(800)-201-15-69",
			info: "Данный отчет предназначен для интерпретации\nсертифицированными специалистами в области\nклинической онкологии.",
			to_content: "к оглавлению"
		},
		sectionNames: {
			content: "Оглавление",
			glossary: "Словарь терминов",
			notation_list: "Список обозначений",
			research_info: "Информация об исследовании",
			result_interpretation: "Интерпретация результатов",
			conclusion: "Заключение",
			therapy: "Препараты",
			result: "Результаты молекулярно-генетических исследований",
			ihc: "Иммуногистохимический анализ",
			fish: "Флуоресцентная гибридизация",
			msi: "Определение микросателлитной нестабильности",
			sequence: "Результаты секвенирования",
			clinical_significant: "Клинически значимые варианты",
			polymorphism: "Полиморфизмы",
			vus: "Варианты с неизвестной значимостью",
			tmb: "Мутационная нагрузка опухоли",
			panel: "Состав генетической панели",
			clinical_trail: "Активные клинические исследования",
			additional_information: "Дополнительная информация, методология и ограничения",
			bibliography: "Литература"
		},
		researchInfo: {
			information_about_patient: "Информация о пациенте",
			patient: "Пациент: ",
			diagnosis: "Диагноз при обращении: ",
			anamnesis: "Анамнез: ",
			information_about_sample: "Информация об образце",
			sample_type: "Тип образца: ",
			sample_date: "Дата забора образца: ",
			sample_origin: "Происхождение образца: ",
			sample_proportion: "Доля опухолевых клеток в образце: ",
			sample_histology: "Гистологический тип: ",
			photo_sample: "Микрофотография гистологического препарата: "
		},
		therapy: {
			tableNames: {
				effectiveInThisDisease: {
					header: "Потенциально эффективные препараты *\n",
					subHeader: "* опубликованы данные об эффективности препарата в случае обнаружения специфического биомаркера при этом заболевании",
				},
				effectiveInOtherDisease: {
					header: "Потенциально эффективные препараты при других заболеваниях *\n",
					subHeader: "* опубликованы данные об эффективности препарата в случае обнаружения специфического биомаркера при ином заболевании (опухоль другой локализации или гистологического типа)",
				},
				noneffective: {
					header: "Потенциально неэффективные препараты *\n",
					subHeader: "* опубликованы данные об эффективности препарата в случае обнаружения специфического биомаркера при этом или другом заболевании",
				},
				toxic: {
					header: "Потенциально токсичный препараты *\n",
					subHeader: "*  опубликованы данные о большей вероятности развития нежелательных явления в случае обнаружения специфического биомаркера",
				},
				other: {
					header: "Другие препараты *\n",
					subHeader: "* опубликованы данные об эффективности препарата в случае обнаружения специфического биомаркера отсутствуют или противоречивы; препарат одобрен при другом заболевании",
				}
			},
			drug: "Препарат",
			approved: "Одобрен",
			marker: "Маркер",
			level: "Уровень доказательности**",
			not_found: "Препаратов не найдено",
			levelDescription: {
				title: "Уровни доказательности:",
				a: "A: Одобрение FDA, рекомендации NCCN, ASCO, ESMO, МинЗдрава, RUSSCO",
				b1: "B1: Клинические исследования поздних фаз (III/IV фазы)",
				b2: "B2: Клинические исследования ранних фаз (I/II фазы)",
				b3: "B3: Мета-анализ",
				b4: "B4: Когортное исследование",
				c: "C: Отдельные клинические случаи",
				d: "D: Доклинические исследования (клеточные линии, животные модели)",
				e: "E: Исследования in silico (вычислительные предсказания).",
				recommendation: "**Уровни доказательности сформированы как адаптированные рекомендации AMP/ASCO/CAP."
			},
			evidenceLevelReplace: {
			    STR_EVID_LEVEL_A: 'A: Подтверждено',
			    STR_EVID_LEVEL_B: 'B: Клин. данные',
			    STR_EVID_LEVEL_B1: 'B1: Клин. испытания, поздняя фаза',
			    STR_EVID_LEVEL_B2: 'B2: Клин. испытания, ранняя фаза',
			    STR_EVID_LEVEL_B3: 'B3: Мета-анализ',
			    STR_EVID_LEVEL_B4: 'B4: Когортное исследование',
			    STR_EVID_LEVEL_C: 'C: Отд. клин. случаи',
			    STR_EVID_LEVEL_D: 'D: Доклин. исследования',
			    STR_EVID_LEVEL_E: 'E: Косвенные данные',				
			},
			drugApprovedReplace: {
			    STR_APPROVED_FOR_THIS_DISEASE: "Одобрен при данном заболевании",
			    STR_APPROVED_FOR_OTHER_DISEASE: "Одобрен при другом заболевании",
			    STR_IN_RND: "Находится в процессе исследований"
			},
			drugCombinationApprovedReplace: {
				STR_APPROVED_FOR_THIS_DISEASE: "Комбинация одобрена при данном заболевании",
    			STR_APPROVED_FOR_OTHER_DISEASE: "Комбинация одобрена при другом заболевании"
			}
		},
		result: {
			soa: {
				marker: "Маркер",
				result: "Результат",
				description: "Описание",
				comment: "Комментарий"
			},
			ngs: {
				geneticVariants: {
					variant: 'Вариант - ',	
					depth: 'Глубина покрытия: ',
					type: 'Тип: ',
					allelic_frequency: 'Аллельная частота: ',
					germline_somatic: 'Класс варианта: ',
					population_frequency: 'Частота в популяции: ',
					biolog_impact: 'Предполагаемый эффект варианта: ',
					biolog_impact_summary: 'Клиническое и функциональное значение варианта: ',
					comment: 'Комментарий',
					no_data: "Полный список вариантов доступен в онлайн-версии\n",
					//Gene: 'Ген',
					translations: {
						STR_CLIN_SIGNIF: 'Клинически значимые варианты',
					    STR_POLYMORPHISM: 'Полиморфизмы',
					    STR_VUS: 'Варианты с неизвестной значимостью',
					    STR_NO_MUTATIONS: "Нет генетических вариантов",
					    STR_LIKELY_BENIGN: 'Вероятно безвредная',
					    STR_WILDTYPE: 'Дикий тип',
					    STR_UNKNOWN_BIOL_SIGNIF: 'С неизвестной биологической значимостью',
					    STR_UNKNOWN: 'Неизвестно',
					    STR_PATHOGENIC: 'Возможно патогенная',
					    STR_GERMLINE: 'Герминативная',
					    STR_SOMATIC: 'Соматическая',
					    STR_MUTATION_AFFECTS_PROTEIN_FUNCTION: 'Вариант с большой вероятностью нарушает функцию белка',
					    STR_IN_RND: 'Находится в процессе исследований',
					    STR_WEBLINK: 'Ссылка',
					    STR_AFFECTED_FUNC_REGIONS: 'Затронутые функциональные участки',
					    STR_SNV: 'Замена',
					    STR_INDEL: 'Индел',
					    STR_SUBSTITUTION: 'Замена',
					    UNKNOWN: 'Неизвестно',
					    STR_EVID_TYPE_PREDICTIVE: 'Предиктивный',
					    STR_EVID_TYPE_DIAGNOSTIC: 'Диагностический',
					    STR_EVID_TYPE_PREDISPOSING: 'Предрасполагающий',
					    STR_EVID_TYPE_PROGNOSTIC: 'Прогностический',
					}
				},
				panel: {
					intro: `Приведен список всех генов, которые были проанализированы методом таргетного секвенирования
            			ДНК опухоли. Отмечены гены, в которых обнаружены клинически значимые варианты, полиморфизмы
            			и варианты с неизвестной клинической значимостью.`,
        			color: {
        				//STR_CLIN_SIGNIF: "#A8FFDF", 
        				//STR_POLYMORPHISM: "#B5FFBA",
        				//STR_VUS: "#DEFFA8",
        				//STR_NO_MUTATIONS: "#B5E2FF",
        				STR_CLIN_SIGNIF: "#A8AFFF", 
        				STR_POLYMORPHISM: "#B5FFC9",
        				STR_VUS: "#B5E1FF",
        				STR_NO_MUTATIONS: "#BDFFB5", //!!!!
        			} 
				}
			}
		},
		clinicalTrail: {
			intro: `В настоящее время идут следующие клинические исследования, участие в которых может  
	            рассматриваться пациентом. Клинические испытания не ранжируются в порядке потенциальной или 
	            прогнозируемой эффективности. Информация о клинических испытаниях может включать не все
	            соответствующие исследования.`,
	        id: "ID",
	        phase: "Фаза",
	        title: "Название",
	        place: "Место проведения",
	        contact: "Контакты"
		}
	},
	en: {
		titlePage: {
			report_name_1: "ОТЧЕТ",
			report_name_2: "О МОЛЕКУЛЯРНО-ГЕНЕТИЧЕСКОМ",
			report_name_3: "ТЕСТИРОВАНИИ",
			package_name_1: "ONCO",
			package_name_2: "MAX"
		},
		header: {
			patient: "Patient",
			ogt_id: "ID",
			diagnosis: "Diagnosis",
			report_created: "Report generated",
		},
		footer: {
			cite: "www.oncogenotest.com",
			email: "info@oncogenotest.com",
			phone: "8-(800)-201-15-69",
			info: "Данный отчет предназначен для интерпретации\nсертифицированными специалистами в области\nклинической онкологии.",
			to_content: "to content"
		},
		sectionNames: {
			content: "Content",
			glossary: "List of terms",
			notation_list: "Abbreviations",
			research_info: "Информация об исследовании",
			result_interpretation: "Интерпретация результатов",
			conclusion: "Conclusion",
			therapy: "Therapy",
			result: "Результаты молекулярно-генетических исследований",
			ihc: "Immunohistochemistry",
			fish: "Fluorescent in situ hybridization",
			msi: "Microsatellite instability",
			sequence: "Next Generation Sequencing",
			clinical_significant: "Clinically Actionable Variants",
			polymorphism: "Genetic Polymorphisms",
			vus: "Variants with unknown significance",
			tmb: "Tumor mutational burden",
			panel: "Состав генетической панели",
			clinical_trail: "Active Clinical Trials",
			additional_information: "Additional information, methodology, and limitations",
			bibliography: "Bibliography"
		},
		researchInfo: {
			information_about_patient: "Patient info",
			patient: "Patient: ",
			diagnosis: "Diagnosis: ",
			anamnesis: "Anamnesis: ",
			information_about_sample: "Specimen info",
			sample_type: "Specimen type: ",
			sample_date: "Specimen collected: ",
			sample_origin: "Specimen site: ",
			sample_proportion: "Percent of tumor cells: ",
			sample_histology: "Histology: ",
			photo_sample: "Microphoto: "
		},
		therapy: {
			tableNames: {
				effectiveInThisDisease: {
					header: "Therapies Associated with Potential Benefit *\n",
					subHeader: "* evidences of the effectiveness of the therapy in this disease in case of detection of a specic biomarker",
				},
				effectiveInOtherDisease: {
					header: "Therapies Associated with Potential Benefit (Other Disease) *\n",
					subHeader: "* evidences of the effectiveness of the therapy in case of detection of a specic biomarker in other disease (tumor of other origin or histological type)",
				},
				noneffective: {
					header: "Therapies Associated with Potential Lack of Benefit *\n",
					subHeader: "* evidences of the non-effectiveness of the therapy in case of detection of a specic biomarker in this or other disease",
				},
				toxic: {
					header: "Therapies Associated with Potential Toxicity *\n",
					subHeader: "* evidences of the more likely development of adverse effects in case of detection of a specific biomarker in this or other disease",
				},
				other: {
					header: "Therapies Associated with Indeterminate Benefit *\n",
					subHeader: "* evidences for the therapy eciency are absent, but drug is approved for this disease; evidences are either weak or contradicting",
				}
			},
			drug: "Therapy",
			approved: "Approvement",
			marker: "Marker",
			level: "Evidence level**",
			not_found: "No therapies here",
			levelDescription: {
				title: "Evidence levels:",
				a: "A: FDA approvement, recommendations of NCCN, ASCO,ESMO, MinZdrav, RUSSCO",
				b1: "B1: Late clinical trials (III/IV phases)",
				b2: "B2: Early clinical trials (I/II phases)",
				b3: "B3: Meta-analysis",
				b4: "B4: Cohort study",
				c: "C: Case studies",
				d: "D: Preclinical studies (cell lines, animal models)",
				e: "E: Indirect evidences (in silico studies)",
				recommendation: "**Уровни доказательности сформированы как адаптированные рекомендации AMP/ASCO/CAP."
			},
			evidenceLevelReplace: {
				STR_EVID_LEVEL_A: 'A: Validated',
				STR_EVID_LEVEL_B: 'B: Clinical evidence',
				STR_EVID_LEVEL_B1: 'B1: Clinical evidence: late trials',
				STR_EVID_LEVEL_B2: 'B2: Clinical evidence: early trials',
				STR_EVID_LEVEL_B3: 'B3: Meta-analysis',
				STR_EVID_LEVEL_B4: 'B4: Cohort study',
				STR_EVID_LEVEL_C: 'C: Case study',
				STR_EVID_LEVEL_D: 'D: Preclinical evidence',
				STR_EVID_LEVEL_E: 'E: Indirect evidence',			
			},
			drugApprovedReplace: {
			    STR_APPROVED_FOR_THIS_DISEASE: "Therapies approved for this disease",
			    STR_APPROVED_FOR_OTHER_DISEASE: "Therapies approved for other disease",
			    STR_IN_RND: "In R&D phase"
			},
			drugCombinationApprovedReplace: {
				STR_APPROVED_FOR_THIS_DISEASE: "Combination approved for this disease",
    			STR_APPROVED_FOR_OTHER_DISEASE: "Combination approved for other disease"
			}
		},
		result: {
			soa: {
				marker: "Marker",
				result: "Result",
				description: "Description",
				comment: "Comment"
			},
			ngs: {
				geneticVariants: {
					variant: 'Variant - ',	
					depth: 'Coverage depth: ',
					type: 'Type: ',
					allelic_frequency: 'Allelic frequency: ',
					germline_somatic: 'Variant class: ',
					population_frequency: 'Population frequency: ',
					biolog_impact: 'Predicted variant effect: ',
					//biolog_impact_summary: 'Клиническое и функциональное значение варианта',
					comment: 'Comment',
					no_data: "Full list of genetic variants is available at\n",
					//Gene: 'Ген',
					translations: {
						STR_CLIN_SIGNIF: 'Clinically Actionable Variants',
						STR_POLYMORPHISM: 'Genetic Polymorphisms',
						STR_VUS: 'Variants with unknown significance',
						STR_NO_MUTATIONS: "No genetic variants",
						STR_LIKELY_BENIGN: 'Likely benign',
						STR_WILDTYPE: 'Wild type',
						STR_UNKNOWN_BIOL_SIGNIF: 'With unknown biolog significance',
						STR_UNKNOWN: 'Unknown',
						STR_PATHOGENIC: 'Likely pathogenic',
						STR_GERMLINE: 'Germline',
						STR_SOMATIC: 'Somatic',
						STR_MUTATION_AFFECTS_PROTEIN_FUNCTION: 'Variant with high probabilty affects protein function',
						STR_IN_RND: 'Currently is being investigated',
						STR_WEBLINK: 'Ref',
						STR_AFFECTED_FUNC_REGIONS: 'Affected functional regions',
						STR_SNV: 'SNV',
						STR_INDEL: 'Indel',
						STR_SUBSTITUTION: 'Substitution',
						UNKNOWN: 'Unknown',
						STR_EVID_TYPE_PREDICTIVE: 'Predictive',
						STR_EVID_TYPE_DIAGNOSTIC: 'Diagnostic',
						STR_EVID_TYPE_PREDISPOSING: 'Predisposing',
						STR_EVID_TYPE_PROGNOSTIC: 'Prognostic',
					}
				},
				panel: {
					intro: `Приведен список всех генов, которые были проанализированы методом таргетного секвенирования
            			ДНК опухоли. Отмечены гены, в которых обнаружены клинически значимые варианты, полиморфизмы
            			и варианты с неизвестной клинической значимостью.`,
            		color: {
        				STR_CLIN_SIGNIF: "#A8AFFF", 
        				STR_POLYMORPHISM: "#B5FFC9",
        				STR_VUS: "#B5E1FF",
        				STR_NO_MUTATIONS: "#BDFFB5",
        			} 
				}
			}
		},
		clinicalTrail: {
			intro: `Currently, the following clinical trials are recruiting participants and may be considered by the patient. Clinical trials are not ranked in terms of potential or predicted patient benet. Information on clinical trials may not include all relevant studies.`,
	        id: "ID",
	        phase: "Phase",
	        title: "Title",
	        place: "Location",
	        contact: "Contacts"
		}
	}
}