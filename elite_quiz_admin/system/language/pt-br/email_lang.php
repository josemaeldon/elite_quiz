<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$lang['email_must_be_array'] = 'O método de validação de e-mail deve receber um array.';
$lang['email_invalid_address'] = 'Endereço de e-mail inválido: %s';
$lang['email_attachment_missing'] = 'Não foi possível encontrar o anexo de e-mail: %s';
$lang['email_attachment_unreadable'] = 'Não foi possível abrir este anexo: %s';
$lang['email_no_from'] = 'Não é possível enviar e-mail sem o cabeçalho "From".';
$lang['email_no_recipients'] = 'Você deve incluir destinatários: To, Cc ou Bcc';
$lang['email_send_failure_phpmail'] = 'Não foi possível enviar e-mail usando mail() do PHP. Seu servidor pode não estar configurado para este método.';
$lang['email_send_failure_sendmail'] = 'Não foi possível enviar e-mail usando Sendmail do PHP. Seu servidor pode não estar configurado para este método.';
$lang['email_send_failure_smtp'] = 'Não foi possível enviar e-mail usando SMTP do PHP. Seu servidor pode não estar configurado para este método.';
$lang['email_sent'] = 'Sua mensagem foi enviada com sucesso usando o seguinte protocolo: %s';
$lang['email_no_socket'] = 'Não foi possível abrir um socket para o Sendmail. Verifique as configurações.';
$lang['email_no_hostname'] = 'Você não especificou um hostname SMTP.';
$lang['email_smtp_error'] = 'O seguinte erro SMTP foi encontrado: %s';
$lang['email_no_smtp_unpw'] = 'Erro: é necessário informar usuário e senha SMTP.';
$lang['email_failed_smtp_login'] = 'Falha ao enviar comando AUTH LOGIN. Erro: %s';
$lang['email_smtp_auth_un'] = 'Falha ao autenticar o usuário. Erro: %s';
$lang['email_smtp_auth_pw'] = 'Falha ao autenticar a senha. Erro: %s';
$lang['email_smtp_data_failure'] = 'Não foi possível enviar dados: %s';
