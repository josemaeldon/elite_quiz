<?php

defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

class BattleRoom extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        date_default_timezone_set(get_system_timezone());
    }

    private function random_room_code($length = 6)
    {
        $characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        $code = '';
        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[mt_rand(0, strlen($characters) - 1)];
        }
        return $code;
    }

    public function create_post()
    {
        try {
            $owner_id = (int) $this->post('owner_id');
            $category_id = (int) $this->post('category_id');
            $entry_coin = (int) $this->post('entry_coin');
            $max_players = (int) $this->post('max_players') ?: 2;
            $metadata = $this->post('metadata') ? json_encode($this->post('metadata')) : null;
            $room_code = $this->post('room_code') ?: $this->random_room_code();

            $room = [
                'owner_id' => $owner_id,
                'category_id' => $category_id,
                'entry_coin' => $entry_coin,
                'max_players' => $max_players,
                'room_code' => $room_code,
                'metadata' => $metadata,
                'status' => 'waiting',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $this->db->insert('battle_rooms', $room);
            $room_id = $this->db->insert_id();

            $participant = [
                'room_id' => $room_id,
                'user_id' => $owner_id,
                'role' => 'owner',
                'ready' => true,
                'joined_at' => date('Y-m-d H:i:s'),
            ];
            $this->db->insert('battle_room_participants', $participant);

            $response = [
                'error' => false,
                'data' => [
                    'room_id' => $room_id,
                    'room_code' => $room_code,
                ],
            ];
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => 'Could not create room',
                'error_msg' => $e->getMessage(),
            ];
        }

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function join_post()
    {
        try {
            $room_id = $this->post('room_id');
            $user_id = (int) $this->post('user_id');
            $role = $this->post('role') ?: 'player';

            if (!$room_id || !$user_id) {
                return $this->response(['error' => true, 'message' => 'Missing data'], REST_Controller::HTTP_OK);
            }

            $existing = $this->db->where('room_id', $room_id)->where('user_id', $user_id)->get('battle_room_participants')->row_array();
            if (empty($existing)) {
                $this->db->insert('battle_room_participants', [
                    'room_id' => $room_id,
                    'user_id' => $user_id,
                    'role' => $role,
                    'joined_at' => date('Y-m-d H:i:s'),
                ]);
            }

            $participants = $this->db->select('brp.*, u.name, u.profile')->from('battle_room_participants brp')
                ->join('tbl_users u', 'u.id = brp.user_id', 'left')
                ->where('room_id', $room_id)
                ->get()->result_array();

            $this->response(['error' => false, 'participants' => $participants], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(['error' => true, 'message' => 'Join failed', 'error_msg' => $e->getMessage()], REST_Controller::HTTP_OK);
        }
    }

    public function messages_post()
    {
        try {
            $room_id = $this->post('room_id');
            $sender_id = (int) $this->post('sender_id');
            $payload = $this->post('payload') ? json_encode($this->post('payload')) : json_encode(['message' => $this->post('message')]);
            $is_text = $this->post('is_text') !== null ? (bool) $this->post('is_text') : true;

            if (!$room_id || !$sender_id) {
                return $this->response(['error' => true, 'message' => 'Missing data'], REST_Controller::HTTP_OK);
            }

            $this->db->insert('battle_room_messages', [
                'room_id' => $room_id,
                'sender_id' => $sender_id,
                'payload' => $payload,
                'is_text' => $is_text,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            $this->response(['error' => false], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(['error' => true, 'message' => 'Message failed', 'error_msg' => $e->getMessage()], REST_Controller::HTTP_OK);
        }
    }

    public function messages_get()
    {
        $room_id = $this->get('room_id');
        $limit = (int) $this->get('limit') ?: 30;

        if (!$room_id) {
            return $this->response(['error' => true, 'message' => 'room_id required'], REST_Controller::HTTP_OK);
        }

        $messages = $this->db->select('brm.*, u.name, u.profile')
            ->from('battle_room_messages brm')
            ->join('tbl_users u', 'u.id = brm.sender_id', 'left')
            ->where('room_id', $room_id)
            ->order_by('created_at', 'DESC')
            ->limit($limit)
            ->get()
            ->result_array();

        $formated = array_reverse($messages);
        $this->response(['error' => false, 'messages' => $formated], REST_Controller::HTTP_OK);
    }

    public function state_get()
    {
        $room_id = $this->get('room_id');
        if (!$room_id) {
            return $this->response(['error' => true, 'message' => 'room_id required'], REST_Controller::HTTP_OK);
        }

        $room = $this->db->where('id', $room_id)->get('battle_rooms')->row_array();
        if (empty($room)) {
            return $this->response(['error' => true, 'message' => 'Room not found'], REST_Controller::HTTP_OK);
        }

        $participants = $this->db->select('brp.*, u.name, u.profile')
            ->from('battle_room_participants brp')
            ->join('tbl_users u', 'u.id = brp.user_id', 'left')
            ->where('room_id', $room_id)
            ->get()
            ->result_array();

        $messages = $this->db->select('brm.*, u.name')
            ->from('battle_room_messages brm')
            ->join('tbl_users u', 'u.id = brm.sender_id', 'left')
            ->where('room_id', $room_id)
            ->order_by('created_at', 'DESC')
            ->limit(20)
            ->get()
            ->result_array();

        $this->response([
            'error' => false,
            'data' => [
                'room' => $room,
                'participants' => $participants,
                'messages' => array_reverse($messages),
            ],
        ], REST_Controller::HTTP_OK);
    }
}
