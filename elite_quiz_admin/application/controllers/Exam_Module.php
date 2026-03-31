<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Exam_Module extends CI_Controller
{

    public function __construct()
    {
        try {
            parent::__construct();
            if (!$this->session->userdata('isLoggedIn')) {
                redirect('/');
            }
            $this->load->config('quiz');
            $this->result['language'] = $this->Language_model->get_data();
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            show_error($e->getMessage(), 500);
        }
    }

    public function import_questions()
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                if ($this->input->post('btnadd')) {
                    if (!has_permissions('create', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $data = $this->Exam_Module_model->import_data();
                        if ($data['error_code'] == "1") {
                            $this->session->set_flashdata('success', lang('csv_file_successfully_imported'));
                        } else if ($data['error_code'] == "0") {
                            if ($data['error'] != '') {
                                $this->session->set_flashdata('error', $data['error']);
                            } else {
                                $this->session->set_flashdata('error',  lang('please_upload_data_in_csv_file'));
                            }
                        } else if ($data['error_code'] == "2") {
                            if ($data['error'] != '') {
                                $this->session->set_flashdata('error', $data['error']);
                            } else {
                                $this->session->set_flashdata('error', lang('please_fill_all_the_data_in_csv_file'));
                            }
                        } else {
                            $this->session->set_flashdata('error', $data['error']);
                        }
                    }
                    redirect('exam-module-questions-import');
                }
                $this->load->view('exam_module_questions_import');
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function exam_module_result($exam_id)
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                $this->result['exam'] = $this->Exam_Module_model->get_exam_title($exam_id);
                $this->load->view('exam_module_result', $this->result);
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function index()
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                if ($this->input->post('btnadd')) {
                    if (!has_permissions('create', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $this->Exam_Module_model->add_data();
                        $this->session->set_flashdata('success', lang('exam_module_created_successfully'));
                    }
                    redirect('exam-module');
                } else if ($this->input->post('btnupdate')) {
                    if (!has_permissions('update', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $this->Exam_Module_model->update_data();
                        $this->session->set_flashdata('success', lang('exam_module_updated_successfully'));
                    }
                    redirect('exam-module');
                } else if ($this->input->post('btnupdatestatus')) {
                    if (!has_permissions('update', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $contest_id = $this->input->post('update_id');
                        $res = $this->db->where('exam_module_id', $contest_id)->get('tbl_exam_module_question')->result();
                        if (empty($res)) {
                            $data = array(
                                'status' => 0
                            );
                            $this->db->where('id', $contest_id)->update('tbl_exam_module', $data);
                            $this->session->set_flashdata('error',  lang('not_enought_question_for_active_exam_module'));
                        } else {
                            $this->Exam_Module_model->update_exam_module_status();
                            $this->session->set_flashdata('success', lang('exam_module_updated_successfully'));
                        }
                    }
                    redirect('exam-module');
                }
                $this->result['language'] = $this->Language_model->get_data();
                //            $this->result['subcategory'] = $this->Subcategory_model->get_data();
                $this->load->view('exam_module', $this->result);
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function delete_exam_module()
    {
        try {
            if (!has_permissions('delete', 'exam_module')) {
                echo FALSE;
            } else {
                $id = $this->input->post('id');
                $this->Exam_Module_model->delete_data($id);
                echo TRUE;
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function exam_module_questions($id)
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                if ($this->input->post('btnadd')) {
                    if (!has_permissions('create', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $this->Exam_Module_model->add_exam_module_question();
                        $this->session->set_flashdata('success', lang('question_created_successfully'));
                    }
                    redirect('exam-module-questions/' . $id);
                }

                $this->result['exam_module'] = $this->Exam_Module_model->get_data();
                $this->load->view('exam_module_questions', $this->result);
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function exam_module_questions_list($id)
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                $this->load->view('exam_module_questions_list');
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function exam_module_questions_edit($id)
    {
        try {
            if (!has_permissions('read', 'exam_module')) {
                redirect('/');
            } else {
                if ($this->input->post('btnadd')) {
                    if (!has_permissions('update', 'exam_module')) {
                        $this->session->set_flashdata('error', lang(PERMISSION_ERROR_MSG));
                    } else {
                        $this->Exam_Module_model->update_exam_module_question();
                        $this->session->set_flashdata('success', lang('question_updated_successfully'));
                    }
                    redirect('exam-module-questions-edit/' . $id);
                }
                $this->result['data'] = $this->Exam_Module_model->get_exam_questions($id);
                $this->load->view('exam_module_questions', $this->result);
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }

    public function delete_exam_module_questions()
    {
        try {
            if (!has_permissions('delete', 'exam_module')) {
                echo FALSE;
            } else {
                $id = $this->input->post('id');
                $image_url = $this->input->post('image_url');
                $this->Exam_Module_model->delete_exam_module_questions($id, $image_url);
                echo TRUE;
            }
        } catch (mysqli_sql_exception $sql) {
            show_error($sql->getMessage(), 500);
        } catch (Exception $e) {
            $this->session->set_flashdata('error', $e->getMessage());
        }
    }
}
