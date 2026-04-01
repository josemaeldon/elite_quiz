<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$lang['migration_none_found'] = 'Nenhuma migração foi encontrada.';
$lang['migration_not_found'] = 'Não foi possível encontrar uma migração com o número de versão: %s.';
$lang['migration_sequence_gap'] = 'Existe uma lacuna na sequência de migrações perto da versão: %s.';
$lang['migration_multiple_version'] = 'Existem múltiplas migrações com o mesmo número de versão: %s.';
$lang['migration_class_doesnt_exist'] = 'A classe de migração "%s" não foi encontrada.';
$lang['migration_missing_up_method'] = 'A classe de migração "%s" não possui o método "up".';
$lang['migration_missing_down_method'] = 'A classe de migração "%s" não possui o método "down".';
$lang['migration_invalid_filename'] = 'A migração "%s" possui um nome de arquivo inválido.';
