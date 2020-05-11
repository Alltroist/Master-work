
list.of.packages <- c("dplyr", "ggplot2", "forcats")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

args = commandArgs(trailingOnly = TRUE)

suppressWarnings(suppressPackageStartupMessages(library(dplyr)))
suppressWarnings(suppressPackageStartupMessages(library(ggplot2)))

global_coverage_distribution <- function(coverage_pr_loci, is_filtering){

    coverage_dist <- data.frame()
    if(!is.null(coverage_pr_loci) & nrow(coverage_pr_loci) > 0){
    	if (is_filtering){
        	coverage_pr_loci <- coverage_pr_loci %>%
            	dplyr::select(START, END, CALLABILITY) %>%
            	dplyr::distinct()
        }
        coverage_pr_loci$n_total <- nrow(coverage_pr_loci)
        coverage_dist <- as.data.frame(
            coverage_pr_loci %>%
                dplyr::group_by(CALLABILITY, n_total) %>%
                dplyr::summarise(n = n()) %>%
                dplyr::mutate(PERCENT = round(as.numeric((n / n_total) * 100),1))
        )
        coverage_dist$CALLABILITY <-  factor(coverage_dist$CALLABILITY, levels = c('NO_COVERAGE','LOW_COVERAGE','MEDIUM_COVERAGE','HIGH_COVERAGE'), ordered = T)
    }
    return(coverage_dist)
}

coverage_distribution_pr_gene <- function(coverage_pr_loci, is_filtering){
    if (is_filtering){
    	callability_pr_gene <- as.data.frame(
        	coverage_pr_loci %>%
            	dplyr::select(SYMBOL, START, END, CALLABILITY) %>%
            	dplyr::distinct() %>%
            	dplyr::group_by(SYMBOL) %>%
            	dplyr::summarise(n_loci = n()))
    
	    b <- as.data.frame(
	        coverage_pr_loci %>%
	            dplyr::select(SYMBOL, START, END, CALLABILITY) %>%
	            dplyr::distinct() %>%
	            dplyr::group_by(SYMBOL, CALLABILITY) %>%
	            dplyr::summarise(n = n()))
	}
    else {
    	callability_pr_gene <- as.data.frame(
        	coverage_pr_loci %>%
            	dplyr::group_by(SYMBOL) %>%
            	dplyr::summarise(n_loci = n()))
    
	    b <- as.data.frame(
	        coverage_pr_loci %>%
	            dplyr::group_by(SYMBOL, CALLABILITY) %>%
	            dplyr::summarise(n = n()))
    }

    c <- dplyr::left_join(b,callability_pr_gene,by=c("SYMBOL")) %>%
        dplyr::mutate(frac = round((n / n_loci) * 100,3))
    d <- as.data.frame(c %>% dplyr::group_by(SYMBOL) %>% dplyr::summarise(tot_loci = sum(n), tot_frac = sum(frac)))
    c <- dplyr::left_join(c,d,by=c("SYMBOL"))
    
    ## RANK GENES FROM FRACTION OF LOCI WITH NO COVERAGE TO GENES WITH ALL LOCI OF HIGH COVERAGE
    c$rank <- 0
    if(nrow(c[c$CALLABILITY == "NO_COVERAGE",]) > 0){
        c[c$CALLABILITY == "NO_COVERAGE",]$rank <- c[c$CALLABILITY == "NO_COVERAGE",]$frac * -2
    }
    if(nrow(c[c$CALLABILITY == "LOW_COVERAGE",]) > 0){
        c[c$CALLABILITY == "LOW_COVERAGE",]$rank <- c[c$CALLABILITY == "LOW_COVERAGE",]$frac * -1
    }
    if(nrow(c[c$CALLABILITY == "MEDIUM_COVERAGE",]) > 0){
        c[c$CALLABILITY == "MEDIUM_COVERAGE",]$rank <- c[c$CALLABILITY == "MEDIUM_COVERAGE",]$frac * 1
    }
    if(nrow(c[c$CALLABILITY == "HIGH_COVERAGE",]) > 0){
        c[c$CALLABILITY == "HIGH_COVERAGE",]$rank <- c[c$CALLABILITY == "HIGH_COVERAGE",]$frac * 2
    }
    
    m <- c %>% dplyr::group_by(SYMBOL) %>% dplyr::summarise(rank_order = sum(rank)) %>% dplyr::arrange(rank_order)
    c <- dplyr::left_join(c, m,by=c("SYMBOL"))
    c <- c %>% dplyr::mutate(SYMBOL = forcats::fct_reorder(SYMBOL, rank_order)) %>% dplyr::arrange(rank_order)
    
    c$CALLABILITY <-  factor(c$CALLABILITY, levels = c('NO_COVERAGE','LOW_COVERAGE','MEDIUM_COVERAGE','HIGH_COVERAGE'), ordered = T)
    
    return(c)
}

plot_gene_distribution <- function(gene_coverage_distribution, filename_suffix, is_unique){
    color_callability_map <- c("NO_COVERAGE" = "#FC4E2A", "LOW_COVERAGE" = "#FD8D3C", 'MEDIUM_COVERAGE' = "#78C679", "HIGH_COVERAGE" = "#207733")
    if (is_unique){
        text = "#reg="
        title = paste0('Clinical significant regions (level ', filename_suffix, ')')
    }
    else {
        text = "#evid="
        title = paste0('Clinical significant evidences (level ', filename_suffix, ')')
    }
    p = ggplot2::ggplot(gene_coverage_distribution,ggplot2::aes(x=SYMBOL, y=frac, fill=CALLABILITY)) +
        ggplot2::geom_bar(position = ggplot2::position_stack(), stat="identity") +
        ggplot2::geom_text(ggplot2::aes(x = SYMBOL, y = tot_frac + 5, label = paste0(text, tot_loci)), size = 3) +
        ggplot2::scale_y_continuous("Percent of all variant loci",breaks=seq(0,100,by=10),labels=seq(0,100,by=10)) +
        ggplot2::ggtitle(title) + 
        ggplot2::coord_flip() +
        ggplot2::theme_classic() +
        ggplot2::theme(axis.text.x = ggplot2::element_text(family = "Helvetica", size = 12, vjust = -0.1),
                       axis.title.x = ggplot2::element_text(family = "Helvetica", size = 13, vjust = -2.5),
                       axis.title.y = ggplot2::element_blank(),
                       legend.title = ggplot2::element_blank(),
                       axis.text.y = ggplot2::element_text(family = "Helvetica", size = 12, hjust = 0.5),
                       plot.margin = (grid::unit(c(0.5, 1, 1, 0.5), "cm")),
                       legend.text = ggplot2::element_text(family = "Helvetica", size = 10))
    p <- p + ggplot2::scale_fill_manual(values = color_callability_map)
    return(p)
}

plot_global_distribution <- function(global_coverage_distribution, filename_suffix, is_unique){
    color_callability_map <- c("NO_COVERAGE" = "#FC4E2A", "LOW_COVERAGE" = "#FD8D3C", "MEDIUM_COVERAGE" = "#78C679", "HIGH_COVERAGE" = "#207733")
    tot_loci <- sum(global_coverage_distribution$n)
    if (is_unique){
        text = "#reg="
        title = paste0('Clinical significant regions (level ', filename_suffix, '), ', 'all gene summary')
    }
    else {
        text = "#evid="
        title = paste0('Clinical significant evidences (level ', filename_suffix, '), ', 'all gene summary')
    }
    p <- ggplot2::ggplot(ggplot2::aes(x="CALLABILITY", y=PERCENT, fill = CALLABILITY), data = global_coverage_distribution) +
        ggplot2::geom_bar(stat = 'identity', position = ggplot2::position_stack()) +
        ggplot2::coord_flip() +
        ggplot2::theme_classic() +
        ggplot2::ggtitle(title) +  
        ggplot2::geom_text(ggplot2::aes(y = 106), label = paste0(text,tot_loci), size = 3) +
        ggplot2::scale_y_continuous("Percent of all variant loci",breaks=seq(0,100,by=10),labels=seq(0,100,by=10)) +
        ggplot2::theme(legend.title = ggplot2::element_blank(),
                       axis.text.x = ggplot2::element_text(family = "Helvetica", size = 12, vjust = -0.1),
                       axis.title.x = ggplot2::element_text(family = "Helvetica", size = 13, vjust = -2.5),
                       axis.title.y = ggplot2::element_blank(),
                       axis.text.y = ggplot2::element_text(family = "Helvetica", size = 12, angle = -90, hjust = 0.5),
                       plot.margin = (grid::unit(c(0.5, 1, 1, 0.5), "cm")),
                       legend.text = ggplot2::element_text(family = "Helvetica", size = 10))
    
    p <- p + ggplot2::scale_fill_manual(values = color_callability_map)
    return(p)
}

filename_path <- as.character(args[1])
table <- read.csv(paste0(filename_path, '/final_result.bed'), sep = '\t', stringsAsFactors = F, 
                 col.names = c('CHR', 'START', 'END', 'ID', 'COV', 'SYMBOL', 'LEVEL'))
table <- dplyr::mutate(table, CALLABILITY = ifelse(COV > 200, 'HIGH_COVERAGE', ifelse(
    COV > 50 , 'MEDIUM_COVERAGE', ifelse(
        COV > 0, 'LOW_COVERAGE', 'NO_COVERAGE'        
    )             
)))

significance_levels = c('STR_EVID_LEVEL_A', 'STR_EVID_LEVEL_B', 'STR_EVID_LEVEL_B1', 'STR_EVID_LEVEL_B2', 
           'STR_EVID_LEVEL_B3','STR_EVID_LEVEL_B4', 'STR_EVID_LEVEL_C', 'STR_EVID_LEVEL_D')

for (x in significance_levels){
    filename_suffix = strsplit(x, '_')[[1]][4]
    filtered_table = table %>% filter(LEVEL == x)
    a <- plot_global_distribution(global_coverage_distribution(filtered_table, TRUE), filename_suffix, TRUE)
    ggsave(paste0(filename_path, '/cacao_regions/global_distribution_', filename_suffix, '.pdf'), plot = a, width = 10, height = 2)
    b <- plot_gene_distribution(coverage_distribution_pr_gene(filtered_table, TRUE), filename_suffix, TRUE)
    ggsave(paste0(filename_path, '/cacao_regions/gene_distribution_', filename_suffix, '.pdf'), plot = b, width = 10, height = 10)
    a <- plot_global_distribution(global_coverage_distribution(filtered_table, FALSE), filename_suffix, FALSE)
    ggsave(paste0(filename_path, '/cacao_evidences/global_distribution_', filename_suffix, '.pdf'), plot = a, width = 10, height = 2)
    b <- plot_gene_distribution(coverage_distribution_pr_gene(filtered_table, FALSE), filename_suffix, FALSE)
    ggsave(paste0(filename_path, '/cacao_evidences/gene_distribution_', filename_suffix, '.pdf'), plot = b, width = 10, height = 10)
}
if (file.exists('Rplots.pdf')) file.remove('Rplots.pdf')