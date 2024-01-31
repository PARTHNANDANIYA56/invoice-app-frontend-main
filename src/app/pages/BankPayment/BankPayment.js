import React from "react";
import { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
} from "../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../helpers/Toast";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

function BankPayment() {
  const [show, setShow] = useState(false);
  const [newData, setNewData] = useState({
    userId: "",
    bankName: "",
    accountNumber: "",
    IFSCcode: "",
    taxNumber: "",
  });
  const [bankDataGet, setBankDataGet] = useState([]);
  const [clientDataGet, setClientDataGet] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setNewData({ ...newData, [name]: value });
    console.log(newData);
  };

  const handleSubmit = async () => {
    console.log(newData);
    let body = {
      userId: newData.userId,
      bankName: newData.bankName,
      accountNumber: newData.accountNumber,
      IFSCcode: newData.IFSCcode,
      taxNumber: newData.taxNumber,
    };
    console.log(body);
    await ApiPost("/addBank", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        handleClose();
        // fetchData();
        handlegetdata();
        setNewData({
          userId: "",
          bankName: "",
          accountNumber: "",
          IFSCcode: "",
          taxNumber: "",
        });
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handleclientgetdata = async () => {
    await ApiGet("/getAllUser")
      .then((response) => {
        console.log("dsufg", response.data.data);
        const output = response.data.data.filter((v) => {
          if (v.userType === 1) {
            return v;
          }
        });
        setClientDataGet(output);
        // }
      })
      .catch((err) => ErrorToast(err?.message));
  };

  console.log(clientDataGet);

  const handlegetdata = async () => {
    await ApiGet("/getBank")
      .then((response) => {
        console.log("bank", response.data.data);
        setBankDataGet(response.data.data);
      })
      .catch((err) => ErrorToast(err?.message));
  };

  // console.log(bankDataGet);
  useEffect(() => {
    handlegetdata();
    handleclientgetdata();
  }, []);

  const handledelete = async (id) => {
    console.log("delete-id",id);
    await ApiDelete(`/deleteBank/${id}`)
      .then((response) => {
        SuccessToast(response?.data?.message);
        handlegetdata();
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handleedit = (data) => {
    console.log(data);
    handleShow();
    setNewData({
      id: data._id,
      userId: data.userId,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      IFSCcode: data.IFSCcode,
      taxNumber: data.taxNumber,
      taxType: data.taxType,
    });
    setIsEdit(true);
    console.log(data);
  };

  const handleUpdate = async () => {
    console.log(newData);
    await ApiPut(`/updateBank/${newData.id}`, newData)
      .then((response) => {
        SuccessToast(response?.data?.message);
        handlegetdata();
        setNewData({
          id: "",
          userId: "",
          bankName: "",
          accountNumber: "",
          IFSCcode: "",
          taxNumber: "",
          taxType: "",
        });
        handleClose();
      })
      .catch((err) => ErrorToast(err?.message));
  };

  return (
    <div className="card">
      {/*begin::Card header*/}
      <div className="card-header border-0 pt-6">
        {/*begin::Card title*/}
        <div className="card-title">
          {/*begin::Search*/}
          <div className="d-flex align-items-center position-relative my-1">
            {/*begin::Svg Icon | path: icons/duotune/general/gen021.svg*/}
            <span className="svg-icon svg-icon-1 position-absolute ms-6">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  opacity="0.5"
                  x="17.0365"
                  y="15.1223"
                  width="8.15546"
                  height={2}
                  rx={1}
                  transform="rotate(45 17.0365 15.1223)"
                  fill="currentColor"
                />
                <path
                  d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {/*end::Svg Icon*/}
            <input
              type="text"
              data-kt-user-table-filter="search"
              className="form-control form-control-solid w-250px ps-14"
              placeholder="Search User"
            />
          </div>
          {/*end::Search*/}
        </div>
        {/*begin::Card title*/}
        {/*begin::Card toolbar*/}
        <div className="card-toolbar">
          {/*begin::Toolbar*/}
          <div
            className="d-flex justify-content-end"
            data-kt-user-table-toolbar="base"
          >
            {/*begin::Add user*/}
            <Button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_add_user"
              onClick={handleShow}
            >
              {/*begin::Svg Icon | path: icons/duotune/arrows/arr075.svg*/}
              <span className="svg-icon svg-icon-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.5"
                    x="11.364"
                    y="20.364"
                    width={16}
                    height={2}
                    rx={1}
                    transform="rotate(-90 11.364 20.364)"
                    fill="currentColor"
                  />
                  <rect
                    x="4.36396"
                    y="11.364"
                    width={16}
                    height={2}
                    rx={1}
                    fill="currentColor"
                  />
                </svg>
              </span>
              {/*end::Svg Icon*/}Add Bank
            </Button>
            {/*end::Add user*/}
          </div>
          {/*end::Toolbar*/}
          {/*begin::Group actions*/}
          {/*end::Group actions*/}
          {/*begin::Modal - Adjust Balance*/}
          <div
            className="modal fade"
            id="kt_modal_export_users"
            tabIndex={-1}
            aria-hidden="true"
          >
            {/*begin::Modal dialog*/}
            <div className="modal-dialog modal-dialog-centered mw-650px">
              {/*begin::Modal content*/}
              <div className="modal-content">
                {/*end::Modal header*/}
                <div>
                  <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form.Label htmlFor="bankName">User Name</Form.Label>
                      <Form.Control
                        as="select"
                        id="userId"
                        value={newData.userId}
                        name="userId"
                        onChange={handleChange}
                      >
                        <option />
                        {clientDataGet.map((u) => (
                          <>
                            <option value={u._id}>{u.firstName}</option>
                          </>
                        ))}
                      </Form.Control>
                      <Form.Label htmlFor="bankName">Bank Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="bankName"
                        value={newData.bankName}
                        name="bankName"
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="accountNumber">
                        Account Number
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="accountNumber"
                        value={newData.accountNumber}
                        name="accountNumber"
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="email">IFSCcode</Form.Label>
                      <Form.Control
                        type="text"
                        value={newData.IFSCcode}
                        id="IFSCcode"
                        name="IFSCcode"
                        onChange={handleChange}
                      />
                      <Form.Label htmlFor="taxNumber">Tax Number</Form.Label>
                      <Form.Control
                        type="number"
                        id="taxNumber"
                        value={newData.taxNumber}
                        name="taxNumber"
                        onChange={handleChange}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      {isEdit ? (
                        <Button variant="primary" onClick={handleUpdate}>
                          Update
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={handleSubmit}>
                          Submit
                        </Button>
                      )}
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
              {/*end::Modal content*/}
            </div>
            {/*end::Modal dialog*/}
          </div>
        </div>
        {/*end::Card toolbar*/}
      </div>
      {/*end::Card header*/}
      {/*begin::Card body*/}
      <div className="card-body py-4">
        {/*begin::Table*/}
        <table
          className="table align-middle table-row-dashed fs-6 gy-5"
          id="kt_table_users"
        >
          {/*begin::Table head*/}
          <thead>
            {/*begin::Table row*/}
            <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
              <th className="min-w-90px">BankName</th>
              <th className="min-w-125px">a/c Number</th>
              <th className="min-w-125px">IFSCcode</th>
              <th className="min-w-100px">TaxNumber</th>
              <th className=" min-w-100px">Action</th>
            </tr>
            {/*end::Table row*/}
          </thead>
          {/*end::Table head*/}
          {/*begin::Table body*/}
          <tbody className="text-gray-600 fw-semibold">
            {/*begin::Table row*/}
            {bankDataGet.map((a) => (
              <tr>
                {/*begin::User=*/}
                <td className="d-flex align-items-center">
                  {/*begin::User details*/}
                  <div className="d-flex flex-column">
                    <a
                      href="../../demo1/dist/apps/user-management/users/view.html"
                      className="text-gray-800 text-hover-primary mb-1"
                    >
                      {a.bankName}
                    </a>
                  </div>
                  {/*begin::User details*/}
                </td>
                {/*end::User=*/}
                {/*begin::Role=*/}
                <td>
                  <span>{a.accountNumber}</span>
                </td>
                <td>
                  <span>{a.IFSCcode}</span>
                </td>
                {/*end::Role=*/}
                {/*begin::Last login=*/}
                <td>
                  <span>{a.taxNumber}</span>
                </td>
                {/*begin::Joined*/}
                {/*begin::Action=*/}
                <td className="">
                  <a
                    href="#"
                    className="btn btn-light btn-active-light-primary btn-sm mr-2"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    onClick={() => handleedit(a)}
                  >
                    <AiFillEdit />
                    {/*end::Svg Icon*/}
                  </a>
                  <a
                    href="#"
                    className="btn btn-light btn-active-light-primary btn-sm"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    onClick={() => handledelete(a._id)}
                  >
                    <MdDelete color="red" />
                    {/*end::Svg Icon*/}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BankPayment;
