<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$lang['db_invalid_connection_str'] = 'Não foi possível determinar as configurações do banco de dados a partir da string de conexão enviada.';
$lang['db_unable_to_connect'] = 'Não foi possível conectar ao servidor de banco de dados usando as configurações fornecidas.';
$lang['db_unable_to_select'] = 'Não foi possível selecionar o banco de dados especificado: %s';
$lang['db_unable_to_create'] = 'Não foi possível criar o banco de dados especificado: %s';
$lang['db_invalid_query'] = 'A consulta enviada não é válida.';
$lang['db_must_set_table'] = 'Você deve definir a tabela que será usada na consulta.';
$lang['db_must_use_set'] = 'Você deve usar o método "set" para atualizar um registro.';
$lang['db_must_use_index'] = 'Você deve especificar um índice para atualização em lote.';
$lang['db_batch_missing_index'] = 'Uma ou mais linhas enviadas para atualização em lote não contém o índice especificado.';
$lang['db_must_use_where'] = 'Atualizações não são permitidas sem uma cláusula "where".';
$lang['db_del_must_use_where'] = 'Exclusões não são permitidas sem uma cláusula "where" ou "like".';
$lang['db_field_param_missing'] = 'Para recuperar campos é necessário informar o nome da tabela como parâmetro.';
$lang['db_unsupported_function'] = 'Este recurso não está disponível para o banco de dados usado.';
$lang['db_transaction_failure'] = 'Falha na transação: rollback executado.';
$lang['db_unable_to_drop'] = 'Não foi possível excluir o banco de dados especificado.';
$lang['db_unsupported_feature'] = 'Recurso não suportado pela plataforma do banco de dados.';
$lang['db_unsupported_compression'] = 'O formato de compactação escolhido não é suportado pelo servidor.';
$lang['db_filepath_error'] = 'Não foi possível gravar dados no caminho de arquivo enviado.';
$lang['db_invalid_cache_path'] = 'O caminho do cache enviado não é válido ou não é gravável.';
$lang['db_table_name_required'] = 'É obrigatório informar o nome da tabela para esta operação.';
$lang['db_column_name_required'] = 'É obrigatório informar o nome da coluna para esta operação.';
$lang['db_column_definition_required'] = 'É necessário informar a definição da coluna para esta operação.';
$lang['db_unable_to_set_charset'] = 'Não foi possível definir o conjunto de caracteres da conexão cliente: %s';
$lang['db_error_heading'] = 'Ocorreu um erro no Banco de Dados';
