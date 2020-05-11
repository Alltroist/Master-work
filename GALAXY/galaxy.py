import igraph as ig
import argparse
import warnings
import json 
import os
import plotly
import plotly.plotly as py
import plotly.graph_objs as go
from plotly.offline import plot
import plotly.io as pio
import pandas as pd


def verify_arguments(args):
    json_file = args.json_file
    instructions = args.instructions
    output_path = args.output_path
    if not json_file is None:
        if not json_file.endswith('.json'):
            print("Json file (" + str(json_file) + ") should have a .json  suffix")
            exit(0)
        if not os.path.exists(os.path.abspath(json_file)):
            print("Json file (" + str(json_file) + ") does not exist")
            exit(0)
    else:
        print("Missed argument: json file")
        exit(0)
    if not instructions is None:
        if not os.path.exists(os.path.abspath(instructions)):
            print("Instructions file (" + str(instructions) + ") does not exist")
            exit(o)
    else:
        print("Missed argument: Instructions file (tab separated)")
        exit(0)
    if output_path is None:
        print('Missed argument: output path')
        exit(0)


#plotly.tools.set_credentials_file(username='alltroist', api_key='wU9VdCmQB1pMYPs4bLt3')
plotly.tools.set_credentials_file(username='qwertasdfg', api_key='5m0VqFFidbfS5Te74d3d')

warnings.filterwarnings('ignore')

parser = argparse.ArgumentParser(description='Graph visualisation of json file')
parser.add_argument('--json', dest='json_file', help='Json file')
parser.add_argument('--interactive', dest='browser', action='store_true', help='Automatically open in browser all graphs')
parser.add_argument('--output_path', dest='output_path', help='Output directory')
parser.add_argument('--config', dest='instructions', help='Configuration file')
parser.add_argument('--removeinfo', dest='removeinfo', action='store_true', help='Add DRUG_TYPES and EVIDENCE_LEVEL in description')
parser.add_argument('--addgene', dest='addgene', action='store_true', help='Show class GENE in Evidences plot')



args = parser.parse_args()

verify_arguments(args)

with open(args.json_file, 'r') as read_file:
	json_file = json.load(read_file)

output_path = args.output_path

if not os.path.exists(output_path):
    os.mkdir(output_path)

instructions = pd.read_csv(args.instructions, sep='\t', names=['FIELD', 'VALUE'])
instructions_dict = {}
for i in range(instructions.shape[0]):
    instructions_dict[instructions.loc[i, 'FIELD']] = instructions.loc[i, 'VALUE']


js_nodes = []
js_edges = []
js_style = []

browser = args.browser
removeinfo = args.removeinfo
addgene = args.addgene


drug_types = {
	'STR_DRUG_EFFECTIVE_IN_THIS_DISEASE': 'eff_this',
	'STR_DRUG_EFFECTIVE_IN_OTHER_DISEASE': 'eff_other',
	'STR_DRUG_NONEFFECTIVE': 'noneff',
	'STR_DRUG_TOXIC': 'tox',
	'STR_DRUG_OTHER': 'other'
}

genes = json_file['Genes'] if json_file.get('Genes') is not None else []
genes_dict = {}
drugs = json_file['Drugs'] if json_file.get('Drugs') is not None else []
drugs_dict = {}
structured_other_assays = json_file['StructuredOtherAssays'] if json_file.get('StructuredOtherAssays') is not None else []
assays_dict = {}
genetic_variants = json_file['GeneticVariants'] if json_file.get('GeneticVariants') is not None else []
variants_dict = {}
evidences = json_file['Evidences'] if json_file.get('Evidences') is not None else []

line_types = []
g = ig.Graph()
g_poly = ig.Graph()
g_vus = ig.Graph()
labels_gene = []
labels_gene_poly = []
labels_gene_vus = []
labels_drug = []
labels_assay = []
labels_variant = []
labels_variant_poly = []
labels_variant_vus = []
labels_pred_evidence = []
labels_evidence = []
group = []
group_poly = []
group_vus = []
list_of_drugs = []
list_of_genes = []
list_of_genes_poly = []
list_of_genes_vus = []
list_of_assays = []
list_of_variants = []
width_lines = []

for i in range(len(genes)):
    genes[i]['json_id'] = 'GENE' + str(genes[i]['json_id'])
    genes_dict[genes[i]['json_id']] = genes[i]['symbol']

for i in range(len(drugs)):
    drugs[i]['json_id'] = 'DRUG' + str(drugs[i]['json_id'])
    drugs_dict[drugs[i]['json_id']] = drugs[i]['drug_name']
	
for i in range(len(genetic_variants)):
	genetic_variants[i]['json_id'] = 'VARIANT' + str(genetic_variants[i]['json_id'])
	genetic_variants[i]['gene'] = 'GENE' + str(genetic_variants[i]['gene'])
	variants_dict[genetic_variants[i]['json_id']] = [genetic_variants[i]['variant_name'], genetic_variants[i]['gene']]
	if genetic_variants[i]['variant_class'] == 'STR_POLYMORPHISM':
		if not genetic_variants[i]['gene'] in list_of_genes_poly:
			list_of_genes_poly.append(genetic_variants[i]['gene'])
			g_poly.add_vertex(genetic_variants[i]['gene'])
			group_poly.append(0)
			labels_gene_poly.append(genes_dict[genetic_variants[i]['gene']])
		g_poly.add_vertex(genetic_variants[i]['json_id'])
		group_poly.append(2)
		labels_variant_poly.append(genetic_variants[i]['variant_name'])
		g_poly.add_edge(genetic_variants[i]['json_id'], genetic_variants[i]['gene'])
	elif genetic_variants[i]['variant_class'] == 'STR_VUS':
		if not genetic_variants[i]['gene'] in list_of_genes_vus:
			list_of_genes_vus.append(genetic_variants[i]['gene'])
			g_vus.add_vertex(genetic_variants[i]['gene'])
			group_vus.append(0)
			labels_gene_vus.append(genes_dict[genetic_variants[i]['gene']])
		g_vus.add_vertex(genetic_variants[i]['json_id'])
		group_vus.append(2)
		labels_variant_vus.append(genetic_variants[i]['variant_name'])
		g_vus.add_edge(genetic_variants[i]['json_id'], genetic_variants[i]['gene'])

for i in range(len(structured_other_assays)):
  	structured_other_assays[i]['json_id'] = 'ASSAY' + str(structured_other_assays[i]['json_id'])
  	assays_dict[structured_other_assays[i]['json_id']] = structured_other_assays[i]['assay_result_name']

for i in range(len(evidences)):
    evidences[i]['json_id'] = 'EVIDENCE' + str(evidences[i]['json_id'])
    g.add_vertex(evidences[i]['json_id'])
    if evidences[i]['evidence_type'] == 'STR_EVID_TYPE_PREDICTIVE':
        group.append(40)
        js_nodes.append({'data': {'id': evidences[i]['json_id'], 'labels': evidences[i]['ogt_id'] + ' ' + evidences[i]['evidence_level'].split('_')[-1]}, 
            'classes': ['PRED_EVIDENCE']})
        if not removeinfo:
            labels_pred_evidence.append(evidences[i]['ogt_id'] + ' ' + evidences[i]['evidence_level'].split('_')[-1])
        else:
            labels_pred_evidence.append(evidences[i]['ogt_id'])
    else:
        group.append(41)
        js_nodes.append({'data': {'id': evidences[i]['json_id'], 'labels': evidences[i]['ogt_id'] + ' ' + evidences[i]['evidence_level'].split('_')[-1]}, 
            'classes': ['OTHER_EVIDENCE']})
        if not removeinfo:
            labels_evidence.append(evidences[i]['ogt_id'] + ' ' + evidences[i]['evidence_level'].split('_')[-1])
        else:
            labels_evidence.append(evidences[i]['ogt_id'])
    for j in range(len(evidences[i]['drugs'])):
        evidences[i]['drugs'][j] = 'DRUG' + str(evidences[i]['drugs'][j])
        if not evidences[i]['drugs'][j] in list_of_drugs:
            list_of_drugs.append(evidences[i]['drugs'][j])
            g.add_vertex(evidences[i]['drugs'][j])
            js_nodes.append({'data': {'id': evidences[i]['drugs'][j], 'labels': drugs_dict[evidences[i]['drugs'][j]] + ' ' + drug_types[evidences[i]['drug_type']]}, 
                'classes': ['DRUG']})
            group.append(1)
            if not removeinfo:
                labels_drug.append(drugs_dict[evidences[i]['drugs'][j]] + ' ' + drug_types[evidences[i]['drug_type']])
            else:
                labels_drug.append(drugs_dict[evidences[i]['drugs'][j]])
        g.add_edge(evidences[i]['json_id'], evidences[i]['drugs'][j])
        js_edges.append({'data': {'id': evidences[i]['json_id'] + evidences[i]['drugs'][j], 'source': evidences[i]['json_id'], 'target': evidences[i]['drugs'][j]}})
        line_types.append(evidences[i]['evidence_level'])
    for j in range(len(evidences[i]['variant_id'])):
        evidences[i]['variant_id'][j] = 'VARIANT' + str(evidences[i]['variant_id'][j])
        variant_id = evidences[i]['variant_id'][j]
        if not variant_id in list_of_variants:
            list_of_variants.append(variant_id)
            g.add_vertex(variant_id)
            js_nodes.append({'data' :{'id': variant_id, 'labels': variants_dict[variant_id][0]}, 
                'classes': ['VARIANT']})
            group.append(2)
            labels_variant.append(variants_dict[variant_id][0])
            if not variants_dict[variant_id][1] in list_of_genes and addgene:
                list_of_genes.append(variants_dict[variant_id][1])
                g.add_vertex(variants_dict[variant_id][1])
                js_nodes.append({'data': {'id': variants_dict[variant_id][1], 'labels': genes_dict[variants_dict[variant_id][1]]}, 
                    'classes': ['VARIANT']})
                group.append(0)
                labels_gene.append(genes_dict[variants_dict[variant_id][1]])
                g.add_edge(variant_id, variants_dict[variant_id][1])
                line_types.append(evidences[i]['evidence_level'])
                width_lines.append(line_width[evidences[i]['evidence_level']])
        g.add_edge(evidences[i]['json_id'], evidences[i]['variant_id'][j])
        js_edges.append({'data': {'id': evidences[i]['json_id'] + evidences[i]['variant_id'][j], 'source': evidences[i]['json_id'], 'target': evidences[i]['variant_id'][j]}})
        line_types.append(evidences[i]['evidence_level'])
    for j in range(len(evidences[i]['assay_id'])):
        evidences[i]['assay_id'][j] = 'ASSAY' + str(evidences[i]['assay_id'][j]) 
        if not evidences[i]['assay_id'][j] in list_of_assays:
            list_of_assays.append(evidences[i]['assay_id'][j])
            g.add_vertex(evidences[i]['assay_id'][j])
            js_nodes.append({'data': {'id': evidences[i]['assay_id'][j], 'labels': assays_dict[evidences[i]['assay_id'][j]]}, 
                'classes': ['ASSAY']})
            group.append(3)
            labels_assay.append(assays_dict[evidences[i]['assay_id'][j]])
        g.add_edge(evidences[i]['json_id'], evidences[i]['assay_id'][j])
        js_edges.append({'data': {'id': evidences[i]['json_id'] + evidences[i]['assay_id'][j], 'source': evidences[i]['json_id'], 'target': evidences[i]['assay_id'][j]}})
        line_types.append(evidences[i]['evidence_level'])




x_gene = []
y_gene = []

x_drug = []
y_drug = []

x_variant = []
y_variant = []

x_assay = []
y_assay = []

x_pred_evidence = []
y_pred_evidence = []

x_evidence = []
y_evidence = []

#layt = g.layout_auto()
layt = g.layout_fruchterman_reingold(dim=2)
N = len(layt)

for i in range(len(layt)):
    if group[i] == 0:
        x_gene.append(layt[i][0])
        y_gene.append(layt[i][1])
    elif group[i] == 1:
        x_drug.append(layt[i][0])
        y_drug.append(layt[i][1])
    elif group[i] == 2:
        x_variant.append(layt[i][0])
        y_variant.append(layt[i][1])
    elif group[i] == 3:
        x_assay.append(layt[i][0])
        y_assay.append(layt[i][1])
    elif group[i] == 40:
        x_pred_evidence.append(layt[i][0])
        y_pred_evidence.append(layt[i][1])
    elif group[i] == 41:
        x_evidence.append(layt[i][0])
        y_evidence.append(layt[i][1])

Xe_A=[]
Ye_A=[]

Xe_B=[]
Ye_B=[]

Xe_C=[]
Ye_C=[]

Xe_D=[]
Ye_D=[]

Xe_E=[]
Ye_E=[]


for i in range(len(g.es)):
	if line_types[i] == 'STR_EVID_LEVEL_A':
		Xe_A+=[layt[g.es[i].tuple[0]][0],layt[g.es[i].tuple[1]][0], None]
		Ye_A+=[layt[g.es[i].tuple[0]][1],layt[g.es[i].tuple[1]][1], None] 
	if 'STR_EVID_LEVEL_B' in line_types[i]:
		Xe_B+=[layt[g.es[i].tuple[0]][0],layt[g.es[i].tuple[1]][0], None]
		Ye_B+=[layt[g.es[i].tuple[0]][1],layt[g.es[i].tuple[1]][1], None]
	if line_types[i] == 'STR_EVID_LEVEL_C':
		Xe_C+=[layt[g.es[i].tuple[0]][0],layt[g.es[i].tuple[1]][0], None]
		Ye_C+=[layt[g.es[i].tuple[0]][1],layt[g.es[i].tuple[1]][1], None]
	if line_types[i] == 'STR_EVID_LEVEL_D':
		Xe_D+=[layt[g.es[i].tuple[0]][0],layt[g.es[i].tuple[1]][0], None]
		Ye_D+=[layt[g.es[i].tuple[0]][1],layt[g.es[i].tuple[1]][1], None]
	if line_types[i] == 'STR_EVID_LEVEL_E':
		Xe_E+=[layt[g.es[i].tuple[0]][0],layt[g.es[i].tuple[1]][0], None]
		Ye_E+=[layt[g.es[i].tuple[0]][1],layt[g.es[i].tuple[1]][1], None]

 
trace_A=go.Scatter(x=Xe_A,
               y=Ye_A,
               mode='lines',
               line=dict(color=instructions_dict['LINE_COLOR'], width=10),
               hoverinfo='none',
               showlegend=False
               )
trace_B=go.Scatter(x=Xe_B,
               y=Ye_B,
               mode='lines',
               line=dict(color=instructions_dict['LINE_COLOR'], width=6),
               hoverinfo='none',
               showlegend=False
               )
trace_C=go.Scatter(x=Xe_C,
               y=Ye_C,
               mode='lines',
               line=dict(color=instructions_dict['LINE_COLOR'], width=2),
               hoverinfo='none',
               showlegend=False
               )
trace_D=go.Scatter(x=Xe_D,
               y=Ye_D,
               mode='lines',
               line=dict(color=instructions_dict['LINE_COLOR'], width=1, dash='dash'),
               hoverinfo='none',
               showlegend=False
               )
trace_E=go.Scatter(x=Xe_E,
               y=Ye_E,
               mode='lines',
               line=dict(color=instructions_dict['LINE_COLOR'], width=1, dash='dot'),
               hoverinfo='none',
               showlegend=False
               )

trace_gene=go.Scatter(x=x_gene,
    y=y_gene,
    mode='markers+text',
    name=u'Гены',
    marker=dict(symbol=int(instructions_dict['GENE_MARKER']),
        color=instructions_dict['GENE_MARKER_COLOR'], 
        size=int(instructions_dict['GENE_MARKER_SIZE'])),
    text=labels_gene,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )
trace_drug=go.Scatter(x=x_drug,
    y=y_drug,
    mode='markers+text',
    name=u'Препараты',
    marker=dict(symbol=int(instructions_dict['DRUG_MARKER']),
        color=instructions_dict['DRUG_MARKER_COLOR'], 
        size=int(instructions_dict['DRUG_MARKER_SIZE'])),
    text=labels_drug,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )
trace_assay=go.Scatter(x=x_assay,
    y=y_assay,
    mode='markers+text',
    name=u'Экспресионные маркеры',
    marker=dict(symbol=int(instructions_dict['ASSAY_MARKER']),
        color=instructions_dict['ASSAY_MARKER_COLOR'], 
        size=int(instructions_dict['ASSAY_MARKER_SIZE'])),
    text=labels_assay,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )
trace_variant=go.Scatter(x=x_variant,
    y=y_variant,
    mode='markers+text',
    name=u'Генетические маркеры',
    marker=dict(symbol=int(instructions_dict['VARIANT_MARKER']),
        color=instructions_dict['VARIANT_MARKER_COLOR'], 
        size=int(instructions_dict['VARIANT_MARKER_SIZE'])),
    text=labels_variant,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )
trace_pred_evidence=go.Scatter(x=x_pred_evidence,
    y=y_pred_evidence,
    mode='markers+text',
    name=u'Диагностические эвиденсы',
    marker=dict(symbol=int(instructions_dict['PRED_EVIDENCE_MARKER']),
        color=instructions_dict['PRED_EVIDENCE_MARKER_COLOR'], 
        size=int(instructions_dict['PRED_EVIDENCE_MARKER_SIZE'])),
    text=labels_pred_evidence,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )
trace_evidence=go.Scatter(x=x_evidence,
    y=y_evidence,
    mode='markers+text',
    name=u'Эвиденсы',
    marker=dict(symbol=int(instructions_dict['EVIDENCE_MARKER']),
        color=instructions_dict['EVIDENCE_MARKER_COLOR'], 
        size=int(instructions_dict['EVIDENCE_MARKER_SIZE'])),
    text=labels_evidence,
    textfont=dict(size=int(instructions_dict['TEXT_FONT_SIZE'])),
    hoverinfo='text',
    textposition='top center'
    )



layout = go.Layout(
    #title="Придумать название",
    #font=dict(size=35),
	width=int(instructions_dict['PLOT_HEIGHT']),
	height=int(instructions_dict['PLOT_WIDTH']),
	xaxis=dict(
        #autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
    yaxis=dict(
        #autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
	showlegend=True,
    hovermode='closest',
    legend=dict(
        x=0,
        y=1,
        traceorder='normal',
        font=dict(
            family='sans-serif',
            size=25,
            color='#000'
        ),
        bgcolor='#E2E2E2',
        bordercolor='#FFFFFF',
        borderwidth=2
    ),
    annotations=[
           dict(
           showarrow=False,
            text="",
            xref='paper',
            yref='paper',
            x=0,
            y=0.1,
            xanchor='left',
            yanchor='bottom',
            font=dict(
            size=25
            )
            )
        ],    )

data=[trace_A, trace_B, trace_C, trace_D, trace_E, trace_gene, trace_drug, trace_pred_evidence, trace_evidence, trace_variant, trace_assay]
fig=go.Figure(data=data, layout=layout)
clin_sign_link = py.plot(fig, filename='Evidences', auto_open=browser)
pio.write_image(fig, os.path.join(output_path, 'clin_signif.png'))

x_gene = []
y_gene = []

x_variant = []
y_variant = []

layt = g_poly.layout_fruchterman_reingold(dim=2)
N = len(layt)

for i in range(len(layt)):
	if group_poly[i] == 0:
		x_gene.append(layt[i][0])
		y_gene.append(layt[i][1])
	elif group_poly[i] == 2:
		x_variant.append(layt[i][0])
		y_variant.append(layt[i][1])

Xe=[]
Ye=[]
for e in g_poly.es:
    Xe+=[layt[e.tuple[0]][0],layt[e.tuple[1]][0], None]# x-coordinates of edge ends
    Ye+=[layt[e.tuple[0]][1],layt[e.tuple[1]][1], None] 
trace0=go.Scatter(x=Xe,
               y=Ye,
               mode='lines',
               line=dict(color='rgb(125,125,125)', width=1),
               hoverinfo='none',
               showlegend=False
               )
trace_gene=go.Scatter(x=x_gene,
               y=y_gene,
               mode='markers+text',
               name='gene',
               marker=dict(symbol='circle',color='#f6511d', size=15),
               text=labels_gene_poly,
               textfont=dict(size=15),
               hoverinfo='text',
               textposition='top center'
               )
trace_variant=go.Scatter(x=x_variant,
               y=y_variant,
               mode='markers+text',
               name='variant',
               marker=dict(symbol='cross',color='#7fb800', size=15),
               text=labels_variant_poly,
               textfont=dict(size=15),
               hoverinfo='text',
               textposition='top center'
               )


layout = go.Layout(
    title="STR_POLYMORPHISM",
    font=dict(size=25),
	width=2000,
	height=2000,
	xaxis=dict(
        autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
    yaxis=dict(
        autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
	showlegend=True,
    hovermode='closest',
    legend=dict(
        x=0,
        y=1,
        traceorder='normal',
        font=dict(
            family='sans-serif',
            size=25,
            color='#000'
        ),
        bgcolor='#E2E2E2',
        bordercolor='#FFFFFF',
        borderwidth=2
    ),
    annotations=[
           dict(
           showarrow=False,
            text="",
            xref='paper',
            yref='paper',
            x=0,
            y=0.1,
            xanchor='left',
            yanchor='bottom',
            font=dict(
            size=25
            )
            )
        ],    )

data=[trace_gene, trace_variant, trace0]
fig=go.Figure(data=data, layout=layout)
poly_link = py.plot(fig, filename='STR_POLYMORPHISM', auto_open=browser)
pio.write_image(fig, os.path.join(output_path, 'polymorphism.png'))

x_gene = []
y_gene = []

x_variant = []
y_variant = []

layt = g_vus.layout_fruchterman_reingold(dim=2)
N = len(layt)

for i in range(len(layt)):
	if group_vus[i] == 0:
		x_gene.append(layt[i][0])
		y_gene.append(layt[i][1])
	elif group_vus[i] == 2:
		x_variant.append(layt[i][0])
		y_variant.append(layt[i][1])

Xe=[]
Ye=[]
for e in g_vus.es:
    Xe+=[layt[e.tuple[0]][0],layt[e.tuple[1]][0], None]# x-coordinates of edge ends
    Ye+=[layt[e.tuple[0]][1],layt[e.tuple[1]][1], None] 
trace0=go.Scatter(x=Xe,
               y=Ye,
               mode='lines',
               line=dict(color='rgb(125,125,125)', width=1),
               hoverinfo='none',
               showlegend=False
               )
trace_gene=go.Scatter(x=x_gene,
               y=y_gene,
               mode='markers+text',
               name='gene',
               marker=dict(symbol='circle',color='#f6511d', size=20),
               text=labels_gene_vus,
               textfont=dict(size=25),
               hoverinfo='text',
               textposition='top center'
               )
trace_variant=go.Scatter(x=x_variant,
               y=y_variant,
               mode='markers+text',
               name='variant',
               marker=dict(symbol='cross',color='#7fb800', size=20),
               text=labels_variant_vus,
               textfont=dict(size=25),
               hoverinfo='text',
               textposition='top center'
               )


layout = go.Layout(
    title="STR_VUS",
    font=dict(size=25),
	width=1500,
	height=1500,
	xaxis=dict(
        autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
    yaxis=dict(
        autorange=True,
        showgrid=False,
        zeroline=False,
        showline=False,
        ticks='',
        showticklabels=False,
        automargin=True
    ),
	showlegend=True,
    hovermode='closest',
    legend=dict(
        x=0,
        y=1,
        traceorder='normal',
        font=dict(
            family='sans-serif',
            size=25,
            color='#000'
        ),
        bgcolor='#E2E2E2',
        bordercolor='#FFFFFF',
        borderwidth=2
    ),
    annotations=[
           dict(
           showarrow=False,
            text="",
            xref='paper',
            yref='paper',
            x=0,
            y=0.1,
            xanchor='left',
            yanchor='bottom',
            font=dict(
            size=25
            )
            )
        ],    )

data=[trace_gene, trace_variant, trace0]
fig=go.Figure(data=data, layout=layout)
vus_link = py.plot(fig, filename='STR_VUS', auto_open=browser)
pio.write_image(fig, os.path.join(output_path, 'vus.png'))

#with open(os.path.join(output_path, 'plot_links.txt'), 'w') as write_file:
#	write_file.write('Link to STR_CLIN_SIGNIF variants: ' + clin_sign_link + '\n')
#	write_file.write('Link to STR_POLYMORPHISM variants: ' + poly_link + '\n')
#	write_file.write('Link to STR_VUS variants: ' + vus_link + '\n')

#with open('js_out.json', 'w') as write_fil:
#    json.dump({'nodes':js_nodes, 'edges':js_edges}, write_fil, indent=2, ensure_ascii=False)
