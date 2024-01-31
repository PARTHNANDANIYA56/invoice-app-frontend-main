import * as React from "react";
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
function Client_list() {
  const [show, setShow] = useState(false);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
    companyName: "",
    taxNumber: "",
    taxType: "",
  });
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
    let body = {
      firstName: newData.firstName,
      lastName: newData.lastName,
      password: newData.password,
      email: newData.email,
      phoneNumber: newData.phoneNumber,
      address: newData.address,
      companyName: newData.companyName,
      taxNumber: newData.taxNumber,
      taxType: newData.taxType,
      userType: 2,
    };
    console.log(body);
    await ApiPost("/addUser", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        handleClose();
        // fetchData();
        handlegetdata();
        setNewData({
          firstName: "",
          lastName: "",
          password: "",
          email: "",
          phoneNumber: "",
          address: "",
          companyName: "",
          taxNumber: "",
          taxType: "",
          userType: 2,
        });
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handlegetdata = async () => {
    await ApiGet("/getAllUser")
      .then((response) => {
        console.log("dsufg", response.data.data);
        const output = response.data.data.filter((v) => {
          if (v.userType === 2) {
            return v;
          }
        });
        setClientDataGet(output);
        // }
      })
      .catch((err) => ErrorToast(err?.message));
  };

  // console.log(clientDataGet);
  useEffect(() => {
    handlegetdata();
  }, []);

  const handledelete = async (id) => {
    // console.log(a);
    await ApiDelete(`/deleteUser/${id}`)
      .then((response) => {
        SuccessToast(response?.data?.message);
        handlegetdata();
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handleedit = (data) => {
    handleShow();
    setNewData({
      _id: data._id,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      companyName: data.companyName,
      taxNumber: data.taxNumber,
      taxType: data.taxType,
    });
    setIsEdit(true);
    console.log(data);
  };

  const handleUpdate = async () => {
    console.log(newData);
    await ApiPut(`/updateUser/${newData._id}`, newData)
      .then((response) => {
        SuccessToast(response?.data?.message);
        handlegetdata();
        setNewData({
          _id: "",
          firstName: "",
          lastName: "",
          password: "",
          email: "",
          phoneNumber: "",
          address: "",
          companyName: "",
          taxNumber: "",
          taxType: "",
          userType: 2,
        });
        handleClose();
      })
      .catch((err) => ErrorToast(err?.message));
  };

  return (
    <>
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
                placeholder="Search Client"
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
                {/*end::Svg Icon*/}Add Client
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
                        <Form.Label htmlFor="firstName">First Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="firstName"
                          value={newData.firstName}
                          name="firstName"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="lastName">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="lastName"
                          value={newData.lastName}
                          name="lastName"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="email">Email</Form.Label>
                        <Form.Control
                          type="text"
                          aria-describedby="passwordHelpBlock"
                          value={newData.email}
                          id="email"
                          name="email"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="email">Password</Form.Label>
                        <Form.Control
                          type="password"
                          aria-describedby="passwordHelpBlock"
                          value={newData.password}
                          id="password"
                          name="password"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="phoneNumber">Phone</Form.Label>
                        <Form.Control
                          type="number"
                          id="phoneNumber"
                          value={newData.phoneNumber}
                          name="phoneNumber"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="address">Address</Form.Label>
                        <Form.Control
                          type="text"
                          id="address"
                          value={newData.address}
                          name="address"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="companyName">
                          Company Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="companyName"
                          value={newData.companyName}
                          name="companyName"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="taxNumber">Tax Number</Form.Label>
                        <Form.Control
                          type="number"
                          id="taxNumber"
                          value={newData.taxNumber}
                          name="taxNumber"
                          aria-describedby="passwordHelpBlock"
                          onChange={handleChange}
                        />
                        <Form.Label htmlFor="taxType">Tax Type</Form.Label>
                        <Form.Control
                          as="select"
                          id="taxType"
                          name="taxType"
                          onChange={handleChange}
                          value={newData.taxType}
                        >
                          <option hidden>Add Tax</option>
                          <option value="GST">GST</option>
                          <option value="TDS">TDS</option>
                          <option value="SGST">SGST</option>
                          <option value="CGST">CGST</option>
                        </Form.Control>
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
                <th className="min-w-90px">Name</th>
                <th className="min-w-110px">Email</th>
                <th className="min-w-125px">PhoneNumber</th>
                <th className="min-w-125px">Address</th>
                <th className="min-w-125px">CompanyName</th>
                <th className="min-w-100px">TaxNumber</th>
                <th className="min-w-100px">TaxType</th>
                <th className=" min-w-100px">Action</th>
              </tr>
              {/*end::Table row*/}
            </thead>
            {/*end::Table head*/}
            {/*begin::Table body*/}
            <tbody className="text-gray-600 fw-semibold">
              {/*begin::Table row*/}
              {clientDataGet.map((a) => (
                <tr>
                  {/*begin::User=*/}
                  <td className="d-flex align-items-center">
                    {/*begin::User details*/}
                    <div className="d-flex flex-column">
                      <a
                        href="../../demo1/dist/apps/user-management/users/view.html"
                        className="text-gray-800 text-hover-primary mb-1"
                      >
                        {a.firstName}
                      </a>
                      <span>{a.lastName}</span>
                    </div>
                    {/*begin::User details*/}
                  </td>
                  {/*end::User=*/}
                  {/*begin::Role=*/}
                  <td>{a.email}</td>
                  {/*end::Role=*/}
                  {/*begin::Last login=*/}
                  <td>
                    <div className="badge badge-light fw-bold">
                      {a.phoneNumber}
                    </div>
                  </td>
                  <td>
                    <span>{a.address}</span>
                  </td>
                  <td>
                    <span>{a.companyName}</span>
                  </td>
                  <td>
                    <span>{a.taxNumber}</span>
                  </td>
                  <td>
                    <span>{a.taxType}</span>
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
    </>
  );
}

export default Client_list;
