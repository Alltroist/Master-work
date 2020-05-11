# CACAO
Цель данной утилиты получить представление об уровне покрытия интересующих нас участков ДНК (с известной клиничеакой значимостью) на основе результатов выравнивания. Если большая доля клинически-значимых участоков покрыта с малой глубиной прочтения, то файл может быть признан нецелесообразным для дальнейшего анализа.

Выделили 4 группы в соответствии с глубиной покрытия.  
- **NO_COVERAGE** 0
- **LOW_COVERAGE** [0, 50)
- **MEDIUM_COVERAGE** [50, 200)
- **HIGH_COVERAGE** >200

#### Input:
- Пациент (.bam файл)
- Evidences database (DB23.xlsx)
- Клинически значимые участки
	- Точечные (hotspots) (final.vсf). Каждый hotspot расширяется вправо и влево на **MARGIN**.
	- Интервалы (final.bed). Также расширяем регион на значение **MARGIN**
- Панель (mgnc_panel409_hg19.bed)

#### Optional input:
- Размер сдвига регионов (**MARGIN**)

#### Output:
- **extended_regions.bed** Объединенный файл (входные vcf и bed) с расширенными интервалами.
- **merge_panel.bed** Результат объединения входной панели (*bedtools merge*)
- **intersect.bed** Объединение *extended_regions.bed* и *merge_panel.bed* (*bedtools intersect*)
- **mosdepth** Побочные файлы утилиты *mosdepth* 
- **final_result.bed** Конечный файл. Имеет 7 колонок:
	- **CHR** Хромосома
	- **START** Начало региона
	- **END** Конец региона
	- **EVIDENCE_ID** Идентификатор эвиденса
	- **COVERAGE** Уровень покрытия
	- **GENE SYMBOL** Название гена
	- **CLINICAL_SIGNIFICANCE** Уровень значимости
- **unique_regions.pdf** Распределение по уровню покрытия при фиксированном уровне значимости в каждом гене и суммарно (фиксируются только уникальные регионы).
- **unique_evidences.pdf** Распределение по уровню покрытия при фиксированном уровне значимости в каждом гене и суммарно (фильтрация по регионам отсутствует). 

#### Usage:
```
usage: cacao.py [-h] [--alignment_file ALIGNMENT_FILE]
                [--evidence_base EVIDENCE_BASE] [--hotspot_file HOTSPOT_FILE]
                [--regions_file REGIONS_FILE] [--panel_file PANEL_FILE]
                [--output_path OUTPUT_PATH] [-m MARGIN]

The CACAO framework will provide software and data to assess sequencing depth
for clinically loci in cancer for a given sequence alignment (BAM/CRAM).

optional arguments:
  -h, --help            show this help message and exit
  --alignment_file ALIGNMENT_FILE
                        Alignment file (BAM/CRAM)
  --evidence_base EVIDENCE_BASE
                        Data base with evidences (XLSX, or tab separated)
  --hotspot_file HOTSPOT_FILE
                        Hotspot positions (VCF)
  --regions_file REGIONS_FILE
                        Regions (BED)
  --panel_file PANEL_FILE
                        Panel (BED)
  --output_path OUTPUT_PATH
                        Output directory with results
  -m MARGIN, --margin MARGIN
                        We extend POSITION to [POSITION - margin, POSITION +
                        margin] (by default 20)

```
