#!/usr/bin/env python3
"""
Script para gerenciar histórico de alterações em arquivos markdown.
Atualiza automaticamente a seção de histórico ao fazer commits.
"""

import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path


def get_commit_info():
    """Obtém informações do commit atual."""
    try:
        # Obtém o autor do commit
        author = subprocess.check_output(
            ['git', 'config', 'user.name'],
            stderr=subprocess.DEVNULL
        ).decode('utf-8').strip()
        
        # Obtém a data atual
        date = datetime.now().strftime('%Y-%m-%d')
        
        # Obtém a mensagem do commit (se disponível)
        try:
            commit_msg = subprocess.check_output(
                ['git', 'log', '-1', '--pretty=%B'],
                stderr=subprocess.DEVNULL
            ).decode('utf-8').strip()
        except:
            commit_msg = "Atualização de arquivo"
        
        return author, date, commit_msg
    except Exception as e:
        print(f"⚠️ Erro ao obter informações do commit: {e}", file=sys.stderr)
        return "Desconhecido", datetime.now().strftime('%Y-%m-%d'), "Atualização"


def get_staged_md_files():
    """Obtém lista de arquivos .md que estão staged para commit."""
    try:
        result = subprocess.check_output(
            ['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'],
            stderr=subprocess.DEVNULL
        ).decode('utf-8')
        
        files = [f for f in result.split('\n') if f.endswith('.md') and f]
        return files
    except Exception as e:
        print(f"⚠️ Erro ao obter arquivos staged: {e}", file=sys.stderr)
        return []


def update_markdown_history(file_path, author, date, commit_msg):
    """
    Atualiza o histórico de alterações em um arquivo markdown.
    
    Args:
        file_path: Caminho do arquivo markdown
        author: Autor do commit
        date: Data do commit
        commit_msg: Mensagem do commit
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verifica se o arquivo já tem a estrutura de histórico
        has_summary = '**Resumo:**' in content
        has_history = '**Histórico de Alterações:**' in content
        
        # Data atual para atualização
        today = datetime.now().strftime('%Y-%m-%d')
        
        if has_history:
            # Atualiza a seção de histórico existente
            # Encontra a linha do histórico
            history_pattern = r'(\*\*Histórico de Alterações:\*\*\s*\n)((?:- \[YYYY-MM-DD\].*\n?)*)'
            match = re.search(history_pattern, content)
            
            if match:
                # Extrai o histórico atual
                current_history = match.group(2)
                
                # Cria nova entrada
                new_entry = f"- {today} - Atualizado por {author} - {commit_msg[:50]}...\n"
                
                # Adiciona a nova entrada no início
                updated_history = new_entry + current_history
                
                # Substitui no conteúdo
                content = re.sub(
                    history_pattern,
                    f'**Histórico de Alterações:**\n{updated_history}',
                    content
                )
                
                # Atualiza também a data de última atualização
                content = re.sub(
                    r'\*\*Última Atualização:\*\* \[YYYY-MM-DD\]',
                    f'**Última Atualização:** {today}',
                    content
                )
                content = re.sub(
                    r'\*\*Última Atualização:\*\* \d{4}-\d{2}-\d{2}',
                    f'**Última Atualização:** {today}',
                    content
                )
                
                # Atualiza "Atualizado por"
                content = re.sub(
                    r'\*\*Atualizado por:\*\* [^\n]+',
                    f'**Atualizado por:** {author}',
                    content
                )
        else:
            # Adiciona a estrutura completa de histórico no final
            footer = '\n\n---\n'
            footer += f'**Resumo:** Arquivo markdown gerenciado com histórico automático\n'
            footer += f'**Data de Criação:** {today}\n'
            footer += f'**Autor:** {author}\n'
            footer += f'**Versão:** 1.0\n'
            footer += f'**Última Atualização:** {today}\n'
            footer += f'**Atualizado por:** {author}\n'
            footer += '**Histórico de Alterações:**\n'
            footer += f'- {today} - Criado por {author} - Versão 1.0\n'
            
            content += footer
        
        # Escreve o conteúdo atualizado
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Histórico atualizado: {file_path}")
        
        # Adiciona o arquivo modificado ao staging area
        subprocess.run(['git', 'add', file_path], stderr=subprocess.DEVNULL)
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao atualizar {file_path}: {e}", file=sys.stderr)
        return False


def main():
    """Função principal."""
    print("🚀 Iniciando atualização de histórico de arquivos markdown...")
    
    # Obtém informações do commit
    author, date, commit_msg = get_commit_info()
    
    # Obtém arquivos .md staged
    md_files = get_staged_md_files()
    
    if not md_files:
        print("ℹ️ Nenhum arquivo .md staged para commit.")
        return 0
    
    print(f"📝 {len(md_files)} arquivo(s) .md encontrado(s) para atualização")
    
    # Atualiza cada arquivo
    success_count = 0
    for file_path in md_files:
        full_path = Path(file_path)
        if full_path.exists():
            if update_markdown_history(full_path, author, date, commit_msg):
                success_count += 1
    
    print(f"🏁 Concluído: {success_count}/{len(md_files)} arquivos atualizados")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
