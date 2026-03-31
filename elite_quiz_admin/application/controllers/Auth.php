<?php

defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class Auth extends REST_Controller
{
    private $JWT_SECRET_KEY;
    private $defaultTimezone;

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->library('JWT');
        $jwtKey = is_settings('jwt_key');
        $this->JWT_SECRET_KEY = $jwtKey ?: bin2hex(random_bytes(16));
        $this->defaultTimezone = get_system_timezone() ?: date_default_timezone_get();
        date_default_timezone_set($this->defaultTimezone);
    }

    private function generate_token($user_id)
    {
        $payload = [
            'iat' => time(),
            'iss' => 'EliteQuiz',
            'exp' => time() + (30 * 24 * 60 * 60),
            'user_id' => $user_id,
        ];
        return $this->jwt->encode($payload, $this->JWT_SECRET_KEY);
    }

    private function format_user($user)
    {
        if (!$user) {
            return null;
        }
        if (filter_var($user['profile'], FILTER_VALIDATE_URL) === false) {
            $user['profile'] = $user['profile'] ? base_url() . USER_IMG_PATH . $user['profile'] : '';
        }
        unset($user['password_hash'], $user['password_salt']);
        return $user;
    }

    private function random_string($length = 4)
    {
        $characters = 'abC0DefGHij1KLMnop2qR3STu4vwxY5ZABc6dEFgh7IJ8klm9NOPQrstUVWXyz';
        $string = '';
        for ($i = 0; $i < $length; $i++) {
            $string .= $characters[mt_rand(0, strlen($characters) - 1)];
        }
        return $string;
    }

    public function register_post()
    {
        try {
            $email = trim($this->post('email'));
            $password = $this->post('password');
            if (empty($email) || empty($password)) {
                return $this->response([
                    'error' => true,
                    'message' => '103',
                ], REST_Controller::HTTP_OK);
            }

            $exists = $this->db->where('email', $email)->count_all_results('tbl_users');
            if ($exists) {
                return $this->response([
                    'error' => true,
                    'message' => '130',
                ], REST_Controller::HTTP_OK);
            }

            $name = $this->post('name') ?: '';
            $mobile = $this->post('mobile') ?: '';
            $friends_code = $this->post('friends_code') ?: '';
            $web_language = $this->post('web_language') ?: 'english';
            $app_language = $this->post('app_language') ?: 'english';
            $web_fcm_id = $this->post('web_fcm_id') ?: '';

            $password_hash = password_hash($password, PASSWORD_BCRYPT);

            $insert = [
                'firebase_id' => '',
                'name' => $name,
                'email' => $email,
                'mobile' => $mobile,
                'type' => 'email',
                'profile' => '',
                'fcm_id' => '',
                'web_fcm_id' => $web_fcm_id,
                'coins' => 0,
                'refer_code' => '',
                'friends_code' => $friends_code,
                'remove_ads' => 0,
                'status' => 1,
                'date_registered' => date('Y-m-d H:i:s'),
                'api_token' => '',
                'app_language' => $app_language,
                'web_language' => $web_language,
                'password_hash' => $password_hash,
                'password_salt' => '',
                'last_login' => date('Y-m-d H:i:s'),
            ];
            $this->db->insert('tbl_users', $insert);
            $insert_id = $this->db->insert_id();

            $refer_code = $this->random_string(4) . $insert_id;
            $token = $this->generate_token($insert_id);
            $this->db->where('id', $insert_id)->update('tbl_users', [
                'refer_code' => $refer_code,
                'api_token' => $token,
            ]);

            $user = $this->db->where('id', $insert_id)->get('tbl_users')->row_array();
            $response = [
                'error' => false,
                'message' => '104',
                'data' => $this->format_user($user),
            ];
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => '122',
                'error_msg' => $e->getMessage(),
            ];
        }

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function login_post()
    {
        try {
            $identifier = trim($this->post('email')) ?: trim($this->post('mobile'));
            $password = $this->post('password');

            if (empty($identifier) || empty($password)) {
                return $this->response([
                    'error' => true,
                    'message' => '103',
                ], REST_Controller::HTTP_OK);
            }

            $this->db->group_start()
                ->where('email', $identifier)
                ->or_where('mobile', $identifier)
                ->group_end();
            $user = $this->db->get('tbl_users')->row_array();

            if (empty($user)) {
                return $this->response([
                    'error' => true,
                    'message' => '131',
                ], REST_Controller::HTTP_OK);
            }

            if (!password_verify($password, $user['password_hash'])) {
                return $this->response([
                    'error' => true,
                    'message' => '124',
                ], REST_Controller::HTTP_OK);
            }

            if ($user['status'] != 1) {
                return $this->response([
                    'error' => true,
                    'message' => '126',
                ], REST_Controller::HTTP_OK);
            }

            $token = $this->generate_token($user['id']);
            $this->db->where('id', $user['id'])->update('tbl_users', [
                'api_token' => $token,
                'last_login' => date('Y-m-d H:i:s'),
            ]);

            $user = $this->db->where('id', $user['id'])->get('tbl_users')->row_array();
            $response = [
                'error' => false,
                'message' => '105',
                'data' => $this->format_user($user),
            ];
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => '122',
                'error_msg' => $e->getMessage(),
            ];
        }

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function reset_password_post()
    {
        try {
            $email = trim($this->post('email'));
            $newPassword = $this->post('new_password');

            if (empty($email) || empty($newPassword)) {
                return $this->response([
                    'error' => true,
                    'message' => '103',
                ], REST_Controller::HTTP_OK);
            }

            $user = $this->db->where('email', $email)->get('tbl_users')->row_array();
            if (empty($user)) {
                return $this->response([
                    'error' => true,
                    'message' => '131',
                ], REST_Controller::HTTP_OK);
            }

            $password_hash = password_hash($newPassword, PASSWORD_BCRYPT);
            $token = $this->generate_token($user['id']);
            $this->db->where('id', $user['id'])->update('tbl_users', [
                'password_hash' => $password_hash,
                'api_token' => $token,
            ]);

            $response = [
                'error' => false,
                'message' => '105',
            ];
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => '122',
                'error_msg' => $e->getMessage(),
            ];
        }

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function verify_token_post()
    {
        try {
            $token = $this->jwt->getBearerToken();
            if (empty($token)) {
                $this->response(['error' => true, 'message' => '129'], REST_Controller::HTTP_OK);
                return;
            }
            $payload = $this->jwt->decode($token, $this->JWT_SECRET_KEY, ['HS256']);
            $user = $this->db->where('api_token', $token)->get('tbl_users')->row_array();
            if (empty($user) || $payload->user_id != $user['id']) {
                $this->response(['error' => true, 'message' => '129'], REST_Controller::HTTP_OK);
                return;
            }
            $response = [
                'error' => false,
                'user_id' => $user['id'],
                'status' => $user['status'],
            ];
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => '129',
                'error_msg' => $e->getMessage(),
            ];
        }
        $this->response($response, REST_Controller::HTTP_OK);
    }
}
