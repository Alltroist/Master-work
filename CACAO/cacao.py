import subprocess
import os
import warnings
import argparse
import logging 
import sys
import glob
import shutil
import time
import pandas as pd
import gzip
import vcf
import toml
from PyPDF2 import PdfFileMerger


def merge_vcf_and_bed(margin, vcf_mutation_file, bed_mutation_file, merge_file):
    '''
        This function merge hotspot and region files in one -> extended_regions.bed.
        Also this function extends regions on margin value (by default 20) to both sides.

        input:
            margin: value for margin
            vcf_mutation_file: hotspot file
            bed_mutation_file: regions file
            merge_file: output file
    '''
    with gzip.open(vcf_mutation_file, 'rb') as f_in:
        with open(vcf_mutation_file[:-3], 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
    vcf_file = vcf.Reader(open(vcf_mutation_file[:-3], 'r'))
    f = open(merge_file, 'w')
    for record in vcf_file:
        chromosome = 'chr' + record.CHROM
        start = record.POS - margin
        end = record.POS + margin
        for reference in record.INFO['EVIDENCE_ID']:
            f.write(chromosome + '\t' + str(start) + '\t' + str(end) + '\t' + reference + '\n')
    bed_file = pd.read_csv(bed_mutation_file, sep='\t', names=['CHROM', 'START', 'END', 'ID'], 
                       usecols = [0, 1, 2, 3])
    for i in range(bed_file.shape[0]):
        f.write('chr' + bed_file.loc[i, 'CHROM'] + '\t' + str(bed_file.loc[i, 'START'] - margin) + '\t' +
                str(bed_file.loc[i, 'END'] + margin) + '\t' + bed_file.loc[i, 'ID'] + '\n')
    f.close()
    check_subprocess("rm %s" % (vcf_mutation_file[:-3]))

def error_message(message, logger):
    '''
        Break when error was happend

        input:
            message: message
            logger: logger
    '''
    logger.error('')
    logger.error(message)
    logger.error('')
    exit(0)

def get_logger(logger_name):
    '''
        Create logger for pretty output 

        input: logger_name: logger name
    '''
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.DEBUG)
    logger.addHandler(ch)
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s", "20%y-%m-%d %H:%M:%S")
    ch.setFormatter(formatter)
    return(logger)

def verify_arguments(args, logger):
    '''
        This function veryfy input arguments for correct format and existense

        input:
            args: list of input arguments
            logger: logger
    '''

    bam_file = args.alignment_file
    panel_bed = args.panel_file
    evidence_base = args.evidence_base
    vcf_mutation_file = args.hotspot_file
    bed_mutation_file = args.regions_file

    # Validate Alignment file

    if not bam_file is None:
        if not bam_file.endswith('.bam'):
            err_msg = "Query alignment file (" + str(bam_file) + ") should have a .bam  suffix (BAM)"
            error_message(err_msg,logger)
      
        if not os.path.exists(os.path.abspath(bam_file)):
            err_msg = "Query alignment file (" + str(bam_file) + ") does not exist"
            error_message(err_msg,logger)

        if not os.path.exists(bam_file + str('.bai')):
            err_msg = "BAM index file (" + str(bam_file) + ".bai) does not exist"
            error_message(err_msg,logger)
    else:
        err_msg = "Missed argument: Alignment file (BAM)"
        error_message(err_msg, logger)

    # Validate panel file

    if not panel_bed is None:
        if not (panel_bed.endswith('.bed') or panel_bed.endswith('.cover.txt')):
            err_msg = "Panel file (" + str(panel_bed) + ") should have a .bed or .cover.txt suffix (BED, COVER.TXT)"
            error_message(err_msg,logger)
      
        if not os.path.exists(os.path.abspath(panel_bed)):
            err_msg = "Panel file (" + str(panel_bed) + ") does not exist"
            error_message(err_msg,logger)
    else:
        err_msg = "Missed argument: Panel file (BED or COVER.TXT)"
        error_message(err_msg, logger)

    # Validate Eivdence base file

    if not evidence_base is None:
        if not os.path.exists(os.path.abspath(evidence_base)):
            err_msg = "Evidence base file (" + str(evidence_base) + ") does not exist"
            error_message(err_msg,logger)

    else:
        err_msg = "Missed argument: evidences base file"
        error_message(err_msg, logger)

    # Valideate hotspot file

    if not vcf_mutation_file is None:
        if not vcf_mutation_file.endswith('.vcf'):
            err_msg = "Hotspot file (" + str(vcf_mutation_file) + ") should have a .vcf  suffix (VCF)"
            error_message(err_msg,logger)
      
        if not os.path.exists(os.path.abspath(vcf_mutation_file)):
            err_msg = "Hotspot file (" + str(vcf_mutation_file) + ") does not exist"
            error_message(err_msg,logger)
    else:
        err_msg = "Missed argument: Hotspot file (BAM)"
        error_message(err_msg, logger)

    if not bed_mutation_file is None:
        if not bed_mutation_file.endswith('.bed'):
            err_msg = "Regions file (" + str(bed_mutation_file) + ") should have a .bed  suffix (BED)"
            error_message(err_msg,logger)
      
        if not os.path.exists(os.path.abspath(bed_mutation_file)):
            err_msg = "Regions file (" + str(bed_mutation_file) + ") does not exist"
            error_message(err_msg,logger)

    else:
        err_msg = "Missed argument: Regions file (BAM)"
        error_message(err_msg, logger)

def check_subprocess(command):
    '''
        Chech proccess with execute by command line.
        Return error and description.

        input: command line 
    '''

    try:
        output = subprocess.check_output(command, shell=True)
        #if len(output) > 0:
        #    print(str(output.decode()).rstrip())
    except:
        print('Error')
        exit(0)

def remove_file(directory, filename):
    if os.path.exists(os.path.join(directory, filename)):
        os.remove(os.path.join(directory, filename))

def create_dict_from_db(evidence_base):
    '''
        We read input evidence base and select the following columns:
        biomarker_symbol, evidence_direction, evidence_level, evidence_id.
        After we convert dataframe to dictionary with key = evidence_id and
        value = [symbol, level]. if directions = DOES_NOT_SUPPORT or empty we dont 
        add this pair to dictionary. 

        input: evidence base

        output: dictionary 
    '''

    clin_dict = {}
    if evidence_base.endswith('.xlsx'):
        evidence_db = pd.read_excel(evidence_base, usecols='A, N, O, AP', names=['biomarker_symbol', 'evidence_direction', 'evidence_level', 'evidence_id'])
    else:
        evidence_db = pd.read_csv(evidence_base, sep='\t', encoding="ISO-8859-1")
        evidence_db = evidence_db[['biomarker_symbol', 'evidence_direction', 'evidence_level', 'evidence_id']]  
    for i in range(evidence_db.shape[0]):
        if evidence_db.loc[i, 'evidence_direction'] == 'STR_SUPPORTS':
            clin_dict[evidence_db.loc[i, 'evidence_id']] = [evidence_db.loc[i, 'biomarker_symbol'], evidence_db.loc[i, 'evidence_level']]
    return clin_dict

def merge_pdf(output_path):
    '''
        We merge pdf files (different for each significant level) into one
        and we delete them. 

        input: 
            output_path: path with result 
    '''

    def merger(output_path, input_paths):
        pdf_merger = PdfFileMerger()
        file_handles = []
        for path in input_paths:
            pdf_merger.append(path)
        with open(output_path, 'wb') as fileobj:
            pdf_merger.write(fileobj)
     
    paths = glob.glob(os.path.join(output_path, 'cacao_regions/*.pdf'))
    paths.sort()
    merger(os.path.join(output_path, 'unique_regions.pdf'), paths)
    paths = glob.glob(os.path.join(output_path, 'cacao_evidences/*.pdf'))
    paths.sort()
    merger(os.path.join(output_path, 'unique_evidences.pdf'), paths)  
    try:
        shutil.rmtree(os.path.join(output_path, 'cacao_regions'))  
        shutil.rmtree(os.path.join(output_path, 'cacao_evidences'))
    except:
        pass

warnings.filterwarnings('ignore')

parser = argparse.ArgumentParser(description='The CACAO framework will provide software and data to access sequencing depth for clinically loci in cancer for a given sequence alignment (BAM/CRAM).')
parser.add_argument('--alignment_file', type=str, help='Alignment file (BAM/CRAM)')
parser.add_argument('--evidence_base', type=str, help='Data base with evidences (XLSX, or tab separated)')
parser.add_argument('--hotspot_file', type=str, help='Hotspot positions (VCF)')
parser.add_argument('--regions_file', type=str, help='Regions (BED)')
parser.add_argument('--panel_file', type=str, help='Panel (BED)')
parser.add_argument('--output_path', type=str, help='Output directory with results')
parser.add_argument('-m', '--margin', default=20, type=int, help='We extend POSITION to [POSITION - margin, POSITION + margin] (by default 20)')
parser.add_argument('--not_remove', action='store_true', help='If active, dont remove intermediate files')
parser.add_argument('--path_to_bedtools', required=True, help='Path to bedtools')
parser.add_argument('--path_to_mosdepth', required=True, help='Path to mosdepth')
parser.add_argument('--path_to_rscript', required=True, help='Path to Rscript')
#parser.add_argument('-f', '--filtration', action='store_false', help='If the flag is active we make unique regions')

args = parser.parse_args()

logger = get_logger('cacao.py')
logger.info('Start')
#verify_arguments(args, logger)
logger.info('Input arguments OK')
logger.info('')

script_path = os.path.dirname(os.path.abspath(__file__))


output_path = args.output_path

if not os.path.exists(output_path):
    os.makedirs(output_path)
if not os.path.exists(os.path.join(output_path, 'cacao_regions')):
    os.makedirs(os.path.join(output_path, 'cacao_regions'))
if not os.path.exists(os.path.join(output_path, 'cacao_evidences')):
    os.makedirs(os.path.join(output_path, 'cacao_evidences'))
margin = args.margin
bam_file = args.alignment_file
panel_bed = args.panel_file
evidence_base = args.evidence_base
vcf_mutation_file = args.hotspot_file
bed_mutation_file = args.regions_file
merge_panel_bed = os.path.join(output_path, 'merge_panel.bed')
merge_file = os.path.join(output_path, 'extended_regions.bed')
intersect_bed = os.path.join(output_path, 'intersect.bed')
output_prefix = os.path.join(output_path, 'mosdepth')
result_file = os.path.join(output_path, 'final_result.bed')


# Merge vcf and bed mutation files and write it in 'merge_file'

merge_vcf_and_bed(margin, vcf_mutation_file, bed_mutation_file, merge_file)

# Create dict of clinical significance based on evidence_base 

clin_dict = create_dict_from_db(evidence_base) 


# sort panel_bed 
sort_panel_cmd = 'sort -k1,1 -k2n,2 %s > sort.bed' % (panel_bed)
logger.info('Start: ' + sort_panel_cmd)
check_subprocess(sort_panel_cmd)
logger.info('OK')
logger.info('')

# merge panel_bed -> merge_panel.bed 

merge_panel_cmd = args.path_to_bedtools + ' merge -i sort.bed -c 4 -o distinct > ' + merge_panel_bed
logger.info('Start: ' + str(merge_panel_cmd))
check_subprocess(merge_panel_cmd)
logger.info('OK')
logger.info('')

check_subprocess("rm sort.bed")
# Intersect merge_file and panel     

bedtools_cmd = (args.path_to_bedtools + ' intersect -a ' + merge_file + ' -b ' +
                merge_panel_bed + ' -f 1.0 -wa -wb | cut -f "1,2,3,4,8" > ' + intersect_bed)   
logger.info('Start: ' + str(bedtools_cmd))
check_subprocess(bedtools_cmd)
logger.info('OK')
logger.info('')

mosdepth_cmd = args.path_to_mosdepth + ' -n -b ' + intersect_bed + ' ' + output_prefix + ' ' + bam_file
logger.info('Start: ' + str(mosdepth_cmd))
check_subprocess(mosdepth_cmd)
logger.info('OK')
logger.info('')


logger.info('Creating ' + str(result_file))
intersect_bed = pd.read_csv(output_prefix + '.regions.bed.gz' , sep='\t', names=['CHR', 'START', 'END', 'ID', 'COV']) 
for i in range(intersect_bed.shape[0]):
    if clin_dict.get(intersect_bed.loc[i, 'ID']) is not None:
        ref = clin_dict[intersect_bed.loc[i, 'ID']]
        intersect_bed.loc[i, 'SYMBOL'] = ref[0]
        intersect_bed.loc[i, 'LEVEL'] = ref[1]
    else:
        intersect_bed = intersect_bed.drop([i], axis=0)    
intersect_bed.to_csv(result_file, sep='\t', header=False, index=False)
logger.info('OK')  
logger.info('')


r_cmd = args.path_to_rscript + ' ' + os.path.join(script_path, 'script/cacao.R') + ' ' + output_path 
logger.info('Start: ' + str(r_cmd))
check_subprocess(r_cmd)
logger.info('OK')
logger.info('')
logger.info('Megre pdf files')
merge_pdf(output_path)
logger.info('OK')
logger.info('')
if not args.not_remove:
    remove_file(output_path, 'extended_regions.bed')
    remove_file(output_path, 'final_result.bed')
    remove_file(output_path, 'intersect.bed')
    remove_file(output_path, 'merge_panel.bed')
    remove_file(output_path, 'mosdepth.mosdepth.global.dist.txt')
    remove_file(output_path, 'mosdepth.mosdepth.region.dist.txt')
    remove_file(output_path, 'mosdepth.regions.bed.gz')
    remove_file(output_path, 'mosdepth.regions.bed.gz.csi')
logger.info('FINISH')
