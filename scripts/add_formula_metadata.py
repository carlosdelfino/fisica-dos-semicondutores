#!/usr/bin/env python3
"""
Script para adicionar metadados de fonte (página) aos arquivos JSON de fórmulas.

Este script percorre os arquivos JSON em public/formulas e adiciona informações
de página às fórmulas individuais baseando-se no campo processedPages ou em
uma lógica de distribuição de páginas.
"""

import json
import os
from pathlib import Path
from datetime import datetime

# Caminho base do projeto
BASE_DIR = Path(__file__).parent.parent
FORMULAS_DIR = BASE_DIR / "public" / "formulas"

# Mapeamento de livros para metadados
BOOK_METADATA = {
    'Semiconductor physics and devices - Basic - Donald A. Neamen': {
        'title': 'Semiconductor Physics and Devices - Basic',
        'author': 'Donald A. Neamen'
    },
    'Semiconductor Devices - Kanaan Kano': {
        'title': 'Semiconductor Devices',
        'author': 'Kanaan Kano'
    }
}


def add_page_to_formula(formula, page_number, total_formulas, current_index):
    """
    Adiciona informações de página a uma fórmula.
    
    Args:
        formula: Objeto de fórmula (dict)
        page_number: Número da página
        total_formulas: Total de fórmulas no arquivo
        current_index: Índice atual da fórmula
    """
    if not isinstance(formula, dict):
        return formula
    
    # Adiciona campo page se não existir
    if 'page' not in formula:
        formula['page'] = page_number
    
    # Adiciona campo section se não existir e chapter existir
    if 'section' not in formula and 'chapter' in formula:
        # Se chapter tem formato "X.Y", usa como section
        chapter = formula.get('chapter', '')
        if '.' in chapter:
            formula['section'] = chapter
    
    return formula


def process_json_file(file_path):
    """
    Processa um arquivo JSON de fórmulas adicionando metadados de página.
    
    Args:
        file_path: Caminho do arquivo JSON
    """
    print(f"Processando: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"  ❌ Erro ao ler arquivo: {e}")
        return False
    
    modified = False
    
    # Obtém informações de páginas processadas
    processed_pages = data.get('processedPages', [])
    chapter = data.get('chapter', '')
    section = data.get('section', '')
    
    # Coleta todas as fórmulas do arquivo
    all_formulas = []
    
    # Fórmulas em questões
    if 'questions' in data:
        for question in data['questions']:
            if 'formulas' in question:
                for formula in question['formulas']:
                    all_formulas.append({
                        'formula': formula,
                        'type': 'question',
                        'question_number': question.get('number', '')
                    })
    
    # Fórmulas em respostas
    if 'answers' in data:
        for answer in data['answers']:
            if 'formulas' in answer:
                for formula in answer['formulas']:
                    all_formulas.append({
                        'formula': formula,
                        'type': 'answer',
                        'question_number': answer.get('questionNumber', '')
                    })
    
    # Fórmulas independentes
    if 'standaloneFormulas' in data:
        for formula in data['standaloneFormulas']:
            all_formulas.append({
                'formula': formula,
                'type': 'standalone',
                'question_number': ''
            })
    
    # Distribui páginas entre as fórmulas
    total_formulas = len(all_formulas)
    
    if total_formulas > 0 and processed_pages:
        # Se há páginas processadas, distribui entre as fórmulas
        for i, item in enumerate(all_formulas):
            formula = item['formula']
            
            # Adiciona chapter e section se não existirem
            if 'chapter' not in formula and chapter:
                formula['chapter'] = chapter
            if 'section' not in formula and section:
                formula['section'] = section
            
            # Adiciona source se não existir
            if 'source' not in formula:
                formula['source'] = item['type']
            if item['type'] in ['question', 'answer'] and 'questionNumber' not in formula:
                formula['questionNumber'] = item['question_number']
            
            # Calcula página baseada no índice
            if processed_pages:
                # Distribui as páginas entre as fórmulas
                page_index = int((i / total_formulas) * len(processed_pages))
                if page_index < len(processed_pages):
                    page_number = processed_pages[page_index]
                    if 'page' not in formula:
                        formula['page'] = page_number
                        modified = True
    
    # Adiciona metadados do livro se não existirem
    if 'bookTitle' not in data:
        # Extrai nome do livro do caminho do arquivo
        relative_path = file_path.relative_to(FORMULAS_DIR)
        book_folder = relative_path.parts[0] if len(relative_path.parts) > 1 else ''
        
        if book_folder in BOOK_METADATA:
            data['bookTitle'] = BOOK_METADATA[book_folder]['title']
            data['author'] = BOOK_METADATA[book_folder]['author']
            modified = True
    
    # Atualiza timestamp
    data['lastUpdated'] = datetime.now().isoformat()
    
    # Salva o arquivo se foi modificado
    if modified:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"  ✅ Arquivo atualizado com metadados de página")
            return True
        except Exception as e:
            print(f"  ❌ Erro ao salvar arquivo: {e}")
            return False
    else:
        print(f"  ℹ️ Arquivo já possui metadados ou não possui fórmulas")
        return True


def main():
    """Função principal do script."""
    print("🚀 Iniciando adição de metadados de fonte aos arquivos JSON...")
    print()
    
    # Encontra todos os arquivos JSON
    json_files = list(FORMULAS_DIR.rglob("*.json"))
    
    print(f"📁 Encontrados {len(json_files)} arquivos JSON")
    print()
    
    # Processa cada arquivo
    processed = 0
    modified = 0
    
    for json_file in json_files:
        # Pula arquivos que não são de fórmulas (index, metadata, etc.)
        if any(keyword in json_file.name.lower() for keyword in ['index', 'metadata']):
            print(f"⏭️  Pulando arquivo: {json_file.name}")
            continue
        
        if process_json_file(json_file):
            processed += 1
            modified += 1
    
    print()
    print(f"✅ Processamento concluído!")
    print(f"   📊 Arquivos processados: {processed}")
    print(f"   ✏️  Arquivos modificados: {modified}")
    print()
    print("📖 Os arquivos JSON agora incluem metadados de fonte (página, seção, etc.)")
    print("   e os componentes React exibirão essas informações onde as fórmulas forem citadas.")


if __name__ == "__main__":
    main()
