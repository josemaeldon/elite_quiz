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

    /**
     * Generate a version 4 (random) UUID.
     * Sets version bits (0x40) and variant bits (0x80) per RFC 4122.
     */
    private function generate_uuid()
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
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

            // Generate UUID in PHP for PostgreSQL
            $room_id = $this->generate_uuid();

            $room = [
                'id' => $room_id,
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
            $roomPayload = array_merge($room, ['room_id' => $room_id]);
            if (!empty($roomPayload['metadata'])) {
                $roomPayload['metadata'] = json_decode($roomPayload['metadata'], true);
            }
            $this->pushRoomEvent($room_id, 'room_created', $roomPayload);
            $this->pushRoomEvent($room_id, 'participant_joined', array_merge($participant, $this->getUserInfo($owner_id), ['room_id' => $room_id]));
        } catch (Exception $e) {
            $response = [
                'error' => true,
                'message' => 'Could not create room',
                'error_msg' => $e->getMessage(),
            ];
        }

        $this->response($response, REST_Controller::HTTP_OK);
    }

    public function join_by_code_post()
    {
        try {
            $room_code = strtoupper(trim($this->post('room_code')));
            $user_id = (int) $this->post('user_id');
            $role = $this->post('role') ?: 'player';

            if (!$room_code || !$user_id) {
                return $this->response(['error' => true, 'message' => 'Missing data'], REST_Controller::HTTP_OK);
            }

            $room = $this->db->where('room_code', $room_code)->get('battle_rooms')->row_array();
            if (empty($room)) {
                return $this->response(['error' => true, 'message' => 'Room not found'], REST_Controller::HTTP_OK);
            }

            $room_id = $room['id'];

            $existing = $this->db->where('room_id', $room_id)->where('user_id', $user_id)->get('battle_room_participants')->row_array();
            if (empty($existing)) {
                $participant = [
                    'room_id' => $room_id,
                    'user_id' => $user_id,
                    'role' => $role,
                    'joined_at' => date('Y-m-d H:i:s'),
                ];
                $this->db->insert('battle_room_participants', $participant);
                $this->pushRoomEvent($room_id, 'participant_joined', array_merge($participant, $this->getUserInfo($user_id)));
            }

            $participants = $this->db->select('brp.*, u.name, u.profile')->from('battle_room_participants brp')
                ->join('tbl_users u', 'u.id = brp.user_id', 'left')
                ->where('room_id', $room_id)
                ->get()->result_array();

            $this->response([
                'error' => false,
                'data' => [
                    'room_id' => $room_id,
                    'room_code' => $room['room_code'],
                    'status' => $room['status'],
                ],
                'participants' => $participants,
            ], REST_Controller::HTTP_OK);
        } catch (Exception $e) {
            $this->response(['error' => true, 'message' => 'Join failed', 'error_msg' => $e->getMessage()], REST_Controller::HTTP_OK);
        }
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
                $participant = [
                    'room_id' => $room_id,
                    'user_id' => $user_id,
                    'role' => $role,
                    'joined_at' => date('Y-m-d H:i:s'),
                ];
                $this->db->insert('battle_room_participants', $participant);
                $this->pushRoomEvent($room_id, 'participant_joined', array_merge($participant, $this->getUserInfo($user_id)));
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

            $messageData = [
                'room_id' => $room_id,
                'sender_id' => $sender_id,
                'payload' => $payload,
                'is_text' => $is_text,
                'created_at' => date('Y-m-d H:i:s'),
            ];
            $this->db->insert('battle_room_messages', $messageData);
            $messageData['id'] = $this->db->insert_id();
            $this->pushRoomEvent($room_id, 'message', array_merge($messageData, $this->getUserInfo($sender_id), ['payload' => json_decode($payload, true)]));

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

    public function stream_get()
    {
        $room_id = $this->get('room_id');
        if (!$room_id) {
            return $this->response(['error' => true, 'message' => 'room_id required'], REST_Controller::HTTP_OK);
        }

        ignore_user_abort(true);
        set_time_limit(0);
        header('Content-Type: text/event-stream; charset=utf-8');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');
        @ob_end_flush();

        $last_sent_id = (int) ($this->get('last_event_id') ?: 0);
        if ($last_sent_id === 0) {
            $lastEventIdValue = null;
            if (!empty($_SERVER['HTTP_LAST_EVENT_ID'])) {
                $lastEventIdValue = $_SERVER['HTTP_LAST_EVENT_ID'];
            } elseif (function_exists('getallheaders')) {
                $headers = getallheaders();
                foreach ($headers as $name => $headerValue) {
                    if (strtolower($name) === 'last-event-id') {
                        $lastEventIdValue = $headerValue;
                        break;
                    }
                }
            }
            if ($lastEventIdValue !== null && $lastEventIdValue !== '') {
                $last_sent_id = (int) $lastEventIdValue;
            }
        }

        while (!connection_aborted()) {
            $events = $this->db->select('id, event_type, payload')
                ->from('battle_room_events')
                ->where('room_id', $room_id)
                ->where('id >', $last_sent_id)
                ->order_by('id', 'ASC')
                ->limit(50)
                ->get()
                ->result_array();

            if (!empty($events)) {
                foreach ($events as $event) {
                    $payload = $event['payload'];
                    $decoded = null;
                    if ($payload !== null) {
                        $decoded = json_decode($payload, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            $decoded = $payload;
                        }
                    }

                    $data = json_encode([
                        'event_type' => $event['event_type'],
                        'payload' => $decoded,
                    ]);

                    echo "id: {$event['id']}\n";
                    echo "event: {$event['event_type']}\n";
                    echo "data: {$data}\n\n";
                    flush();
                    $last_sent_id = $event['id'];
                }
            } else {
                echo ": keep-alive\n\n";
                flush();
            }

            sleep(1);
        }

        exit;
    }

    private function getUserInfo($userId)
    {
        if (!$userId) {
            return [];
        }

        $user = $this->db->select('name, profile')->from('tbl_users')->where('id', $userId)->get()->row_array();
        return $user ?: [];
    }

    private function pushRoomEvent($roomId, $eventType, $payload = null)
    {
        $eventPayload = null;
        if ($payload !== null) {
            $eventPayload = json_encode($payload);
        }

        $this->db->insert('battle_room_events', [
            'room_id' => $roomId,
            'event_type' => $eventType,
            'payload' => $eventPayload,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
