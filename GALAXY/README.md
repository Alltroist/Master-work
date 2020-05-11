## Описание
Цель данного скрипта - это визуализация связей в json файле между различными сущностями. 


## Использование
```
usage: galaxy.py [-h] [--json JSON_FILE] [--interactive]
               [--output_path OUTPUT_PATH] [--config INSTRUCTIONS]
               [--removeinfo] [--addgene]

Graph visualisation of json file

optional arguments:
  -h, --help            show this help message and exit
  --json JSON_FILE      Json file
  --interactive         Automatically open in browser all graphs
  --output_path OUTPUT_PATH
                        Output directory
  --config INSTRUCTIONS
                        Configuration file
  --removeinfo          Add DRUG_TYPES and EVIDENCE_LEVEL in description
  --addgene             Show class GENE in Evidences plot
```                        

## Аргументы коммандной строки
- Обязательные:
	- **--json** Входной json файл
	- **--output_path** Выходная директория
  - **--config** Конфигурационный файл, который служит для настройки параметром вывода (*clin_signif.png*). Файл состоит из двух колонок: *НАЗВАНИЕ* и *ЗНАЧЕНИЕ*.
    - НАЗВАНИЕ - название параметра
    - ЗНАЧЕНИЕ - его значение
- Необязательные:
	- **--interactive** Если флаг активен, то полученные графы автоматически открываются в браузере.
	- **--addinfo** Если флаг активен, то добавлются *drug_types* и *evidence_level* в описание 
	- **--addgene** Если флаг активен, то отображаются гены на графе

## Выходные файлы
В выходной директории создаются 4 файла:
- *plot_links.txt* - файл, в котором содержатся 3 ссылки на изображения
- *clin_signif.png* - граф с изображениями всех ЭВИДЕНСЕВ
- *polymorphism.png* - граф с изображением всех пар ГЕН-ВАРИАНТ (*variant_class* = *STR_POLYMORPHISM*)
- *vus.png* - граф с изображением всех пар ГЕН-ВАРИАНТ (*variant_class* = *STR_VUS*)
