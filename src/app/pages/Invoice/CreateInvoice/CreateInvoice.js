import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { ApiGet, ApiPost } from "../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function CreateInvoice() {
  const date = new Date();
  // console.log("date.toLocalDateString()", date);
  const [newData, setNewData] = useState({
    from_name: "",
    from_email: "",
    from_address: "",
    to_name: "",
    to_email: "",
    to_address: "",
    taxType: "",
    qty_hour: "",
    paymentStatus: "",
    currency: "",
    tax_rate: "",
    notes: "",
    bill_date: moment(date).format("YYYY-MM-DD"),
    dueDate: "",
  });
  const [addItemform, setAddItemform] = useState({});
  const [itemArray, setItemArray] = useState([]);
  const [userData, setUserData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [clientDataById, setClientDataById] = useState([]);
  const [userDataById, setUserDataById] = useState([]);
  const [itemSubTotal, setItemSubTotal] = useState([0]);
  const [show, setShow] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setNewData({ ...newData, [name]: value });
  };

  const handleItemChange = (e) => {
    const { value, name } = e.target;
    setAddItemform({ ...addItemform, [name]: value });
  };

  const handleAddField = () => {
    setItemArray([...itemArray, addItemform]);
  };

  const subTotal = () => {
    const subTotalVariable =
      (addItemform.qty_hour ? parseInt(addItemform.qty_hour) : 1) *
      parseInt(addItemform.price);
    setItemSubTotal([...itemSubTotal, subTotalVariable]);
  };

  const handleSubmit = async () => {
    let a = itemArray;
    let b = a.push(addItemform);
    let body = {
      userId: newData.from_name,
      clientId: newData.to_name,
      item: itemArray,
      taxType: newData.taxType,
      qty_hour: newData.qty_hour ? parseInt(newData.qty_hour) : 0,
      taxRate: newData.tax_rate,
      currency: newData.currency,
      paymentStatus: newData.paymentStatus
        ? parseInt(newData.paymentStatus)
        : 0,
      notes: newData.notes ? newData.notes : "",
      bill_date: newData.bill_date,
      dueDate: newData.dueDate,
    };
    await ApiPost("/addInvoice", body)
      .then((res) => {
        SuccessToast(res?.data?.message);
        // handleClose();
        // fetchData();
        // handlegetdata();
        console.log(res?.data?.data[0]?._id);
        ApiGet(`/getInvoiceByInvoiceId/${res?.data?.data[0]?._id}`)
          .then((response) => {
            console.log("maon responce", response.data.data);
            setPreviewData(response.data.data);
            handleShow();
          })
          .catch((err) => ErrorToast(err?.message));
        console.log("res", res);
        setNewData({
          from_name: "",
          from_email: "",
          from_address: "",
          to_name: "",
          to_email: "",
          to_address: "",
          taxType: "",
          qty_hour: "",
          paymentStatus: "",
          currency: "",
          tax_rate: "",
          notes: "",
          item: "",
        });
      })
      .catch((err) => ErrorToast(err?.message));

    console.log("Final Data", body);
  };
  console.log("previewData", previewData);
  const fromUserName = async (e) => {
    console.log("e.target.value", e.target.value);
    await ApiGet("/getUserById/" + e.target.value)
      .then((response) => {
        console.log("jhgjh", response.data.data);
        setUserDataById(response.data.data);
        setNewData({
          ...newData,
          from_name: response?.data?.data?._id,
          from_email: response?.data?.data?.email,
          from_address: response?.data?.data?.address,
        });
        console.log(newData);
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const toClientName = async (e) => {
    console.log("e.target.value", e.target.value);
    await ApiGet("/getUserById/" + e.target.value)
      .then((response) => {
        console.log("jhgjh", response.data.data);
        setClientDataById(response.data.data);
        setNewData({
          ...newData,
          to_name: response?.data?.data?._id,
          to_email: response?.data?.data?.email,
          to_address: response?.data?.data?.address,
        });
        console.log(newData);
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handlegetuserdata = async () => {
    await ApiGet("/getAllUser")
      .then((response) => {
        console.log("dsufg", response.data.data);
        const userOutput = response?.data?.data?.filter((v) => {
          if (v.userType === 1) {
            return v;
          }
        });
        setUserData(userOutput);
        const clientOutput = response?.data?.data?.filter((v) => {
          if (v.userType === 2) {
            return v;
          }
        });
        setClientData(clientOutput);
      })
      .catch((err) => ErrorToast(err?.message));
  };

  const handleSendEmail = async (id) => {
    console.log(id);
    await ApiGet(`/Pdf_mail_send/${id}`)
      .then((response) => {
        console.log("send email", response);
      })
      .catch((err) => ErrorToast(err?.message));
  };

  // console.log("user dT", userData);
  // console.log("client dT", clientData);

  useEffect(() => {
    handlegetuserdata();
  }, [itemArray]);

  return (
    <div id="kt_app_content_container" className="app-container container-xxl">
      {/*begin::Layout*/}
      <div className="d-flex flex-column flex-lg-row">
        {/*begin::Content*/}
        <div className="flex-lg-row-fluid mb-10 mb-lg-0 me-lg-7 me-xl-10">
          {/*begin::Card*/}
          <div className="card">
            {/*begin::Card body*/}
            <div className="card-body p-12">
              {/*begin::Form*/}
              <Form name="dynamic_form_nest_item" autoComplete="off">
                {/*begin::Wrapper*/}
                <div className="d-flex flex-column align-items-start flex-xxl-row">
                  {/*begin::Input group*/}
                  <div
                    className="d-flex align-items-center flex-equal fw-row me-4 order-2"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    title="Specify invoice date"
                  >
                    {/*begin::Date*/}
                    <div className="fs-6 fw-bold text-gray-700 text-nowrap">
                      Date:
                    </div>
                    {/*end::Date*/}
                    {/*begin::Input*/}
                    <div className="position-relative d-flex align-items-center w-150px">
                      {/*begin::Datepicker*/}
                      <input
                        className="form-control form-control-transparent fw-bold pe-5"
                        placeholder="Select date"
                        name="bill_date"
                        type="date"
                        value={newData.bill_date}
                        onChange={(e) => {
                          setNewData({ ...newData, bill_date: e.target.value });
                        }}
                      />
                      {/*end::Datepicker*/}
                      {/*begin::Icon*/}
                      {/*begin::Svg Icon | path: icons/duotune/arrows/arr072.svg*/}

                      {/*end::Svg Icon*/}
                      {/*end::Icon*/}
                    </div>
                    {/*end::Input*/}
                  </div>
                  {/*end::Input group*/}
                  {/*begin::Input group*/}
                  <div
                    className="d-flex flex-center flex-equal fw-row text-nowrap order-1 order-xxl-2 me-4"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    title="Enter invoice number"
                  >
                    <span className="fs-2x fw-bold text-gray-800">
                      Invoice #
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-flush fw-bold text-muted fs-3 w-125px"
                      defaultValue={2021001}
                      placehoder="..."
                    />
                  </div>
                  {/*end::Input group*/}
                  {/*begin::Input group*/}
                  <div
                    className="d-flex align-items-center justify-content-end flex-equal order-3 fw-row"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    title="Specify invoice due date"
                  >
                    {/*begin::Date*/}
                    <div className="fs-6 fw-bold text-gray-700 text-nowrap">
                      Due Date:
                    </div>
                    {/*end::Date*/}
                    {/*begin::Input*/}
                    <div className="position-relative d-flex align-items-center w-150px">
                      {/*begin::Datepicker*/}
                      <input
                        className="form-control form-control-transparent fw-bold pe-5"
                        placeholder="Select date"
                        name="dueDate"
                        type="date"
                        onChange={handleChange}
                      />
                      {/*end::Datepicker*/}
                      {/*begin::Icon*/}
                      {/*begin::Svg Icon | path: icons/duotune/arrows/arr072.svg*/}

                      {/*end::Svg Icon*/}
                      {/*end::Icon*/}
                    </div>
                    {/*end::Input*/}
                  </div>
                  {/*end::Input group*/}
                </div>
                {/*end::Top*/}
                {/*begin::Separator*/}
                <div className="separator separator-dashed my-10" />
                {/*end::Separator*/}
                {/*begin::Wrapper*/}
                <div className="mb-0">
                  {/*begin::Row*/}
                  <div className="row gx-10 mb-5">
                    {/*begin::Col*/}
                    <div className="col-lg-6">
                      <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                        Bill From
                      </label>
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <select
                          id="from_name"
                          name="from_name"
                          className="form-control form-control-solid"
                          onChange={fromUserName}
                          defaultValue="0"
                        >
                          <option disabled value="0">
                            User
                          </option>
                          {userData?.map((u) => (
                            <option value={u._id}>{u.firstName}</option>
                          ))}
                        </select>
                      </div>
                      {/*end::Input group*/}
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <input
                          type="email"
                          id="from_email"
                          className="form-control form-control-solid"
                          placeholder="Email"
                          name="from_email"
                          value={userDataById?.email}
                          onChange={handleChange}
                        />
                      </div>
                      {/*end::Input group*/}
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <textarea
                          id="from_address"
                          name="from_address"
                          className="form-control form-control-solid"
                          rows={3}
                          placeholder="Address"
                          value={userDataById?.address}
                          onChange={handleChange}
                        />
                      </div>
                      {/*end::Input group*/}
                    </div>
                    {/*end::Col*/}
                    {/*begin::Col*/}
                    <div className="col-lg-6">
                      <label className="form-label fs-6 fw-bold text-gray-700 mb-3">
                        Bill To
                      </label>
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <select
                          id="to_name"
                          name="to_name"
                          className="form-control form-control-solid"
                          onChange={toClientName}
                          defaultValue="0"
                        >
                          <option disabled value="0">
                            Client
                          </option>
                          {clientData?.map((u) => (
                            <option value={u._id}>{u.firstName}</option>
                          ))}
                        </select>
                      </div>
                      {/*end::Input group*/}
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <input
                          type="email"
                          id="to_email"
                          className="form-control form-control-solid"
                          placeholder="Email"
                          name="to_email"
                          onChange={handleChange}
                          value={clientDataById?.email}
                        />
                      </div>
                      {/*end::Input group*/}
                      {/*begin::Input group*/}
                      <div className="mb-5">
                        <textarea
                          id="to_address"
                          name="to_address"
                          className="form-control form-control-solid"
                          rows={3}
                          placeholder="Address"
                          defaultValue={""}
                          onChange={handleChange}
                          value={clientDataById?.address}
                        />
                      </div>
                      {/*end::Input group*/}
                    </div>
                    {/*end::Col*/}
                  </div>
                  {/*end::Row*/}

                  {/*begin::Table wrapper*/}
                  <div className="table-responsive mb-10">
                    {/*begin::Table*/}
                    <table
                      className="table g-5 gs-0 mb-0 fw-bold text-gray-700"
                      data-kt-element="items"
                    >
                      {/*begin::Table head*/}
                      <thead>
                        <tr className="border-bottom fs-7 fw-bold text-gray-700 text-uppercase">
                          <th className="min-w-300px w-475px">Item</th>
                          <th className="min-w-100px w-100px">QTY</th>
                          <th className="min-w-150px w-150px">Total</th>
                          <th className="min-w-75px w-75px text-end">Action</th>
                        </tr>
                      </thead>
                      {/*end::Table head*/}
                      {/*begin::Table body*/}
                      <tbody>
                        <Form.List name="users">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map(({ key, name, ...restField }) => (
                                <tr
                                  className="border-bottom border-bottom-dashed"
                                  data-kt-element="item"
                                >
                                  <td className="pe-7">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "first"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing first name",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Item name"
                                        id="itemName"
                                        name="itemName"
                                        type="text"
                                        className="form-control form-control-solid mb-2"
                                        onChange={handleItemChange}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "description"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing Description",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Description"
                                        id="description"
                                        name="description"
                                        type="text"
                                        className="form-control form-control-solid mb-2"
                                        onChange={handleItemChange}
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className="ps-0">
                                    <Form.Item
                                      {...restField}
                                      name={[name, "quantity"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing quantity",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder={1}
                                        id="qty_hour"
                                        name="qty_hour"
                                        className="form-control form-control-solid"
                                        type="value"
                                        min={1}
                                        defaultValue={1}
                                        data-kt-element="quantity"
                                        onChange={handleItemChange}
                                      />
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      {...restField}
                                      name={[name, "price"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Missing Price",
                                        },
                                      ]}
                                    >
                                      <Input
                                        placeholder="Price"
                                        id="price"
                                        name="price"
                                        type="value"
                                        className="form-control form-control-solid mb-2"
                                        onChange={handleItemChange}
                                        onBlur={subTotal}
                                      />
                                    </Form.Item>
                                  </td>
                                  <td className="pt-5 text-end">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-icon btn-active-color-primary"
                                      data-kt-element="remove-item"
                                    >
                                      {/*begin::Svg Icon | path: icons/duotune/general/gen027.svg*/}
                                      <span className="svg-icon svg-icon-3">
                                        <MinusCircleOutlined
                                          onClick={() => remove(name)}
                                        />
                                      </span>
                                      {/*end::Svg Icon*/}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              <Button
                                type="dashed"
                                onClick={() => {
                                  add();
                                  if (fields.length !== 0) {
                                    handleAddField();
                                  }
                                }}
                                className="btn btn-link py-1"
                              >
                                Add field
                              </Button>
                            </>
                          )}
                        </Form.List>
                      </tbody>
                      {/*end::Table body*/}
                      {/*begin::Table foot*/}
                      <tfoot>
                        <tr className="border-top border-top-dashed align-top fs-6 fw-bold text-gray-700">
                          <th
                            colSpan={2}
                            className="border-bottom border-bottom-dashed ps-0"
                          >
                            <div className="d-flex flex-column align-items-start">
                              <div className="fs-5 mb-5">Subtotal</div>
                              <div className="mb-5">
                                <select
                                  id="taxType"
                                  name="taxType"
                                  className="form-control form-control-solid"
                                  onChange={handleChange}
                                >
                                  <option hidden>Add Tax</option>
                                  <option value="GST">GST</option>
                                  <option value="TDS">TDS</option>
                                  <option value="SGST">SGST</option>
                                  <option value="CGST">CGST</option>
                                </select>
                              </div>
                              {/* qty_hour */}
                              <div className="mb-5">
                                <select
                                  id="qty_hour"
                                  name="qty_hour"
                                  className="form-control form-control-solid"
                                  onChange={handleChange}
                                >
                                  <option hidden>Select Qty type</option>
                                  <option value="1">Hour</option>
                                  <option value="0">Quantity</option>
                                </select>
                              </div>
                              <div className="mb-5">
                                <select
                                  id="tax_rate"
                                  name="tax_rate"
                                  className="form-control form-control-solid"
                                  onChange={handleChange}
                                >
                                  <option hidden>Select Rate</option>
                                  <option value={18}>18%</option>
                                  <option value={12}>12%</option>
                                  <option value={16}>16%</option>
                                  <option value={15}>15%</option>
                                </select>
                              </div>
                            </div>
                          </th>
                          <th
                            colSpan={2}
                            className="border-bottom border-bottom-dashed text-end"
                          >
                            $
                            <span data-kt-element="sub-total">
                              {itemSubTotal.reduce((a, b) => a + b)}
                            </span>
                          </th>
                        </tr>
                        <tr className="align-top fw-bold text-gray-700">
                          <th />
                          <th colSpan={2} className="fs-4 ps-0">
                            Total
                          </th>
                          <th colSpan={2} className="text-end fs-4 text-nowrap">
                            $
                            <span data-kt-element="grand-total">
                              {itemSubTotal.reduce((a, b) => a + b)}
                            </span>
                          </th>
                        </tr>
                      </tfoot>
                      {/*end::Table foot*/}
                    </table>
                  </div>
                  {/*end::Table*/}
                  {/*begin::Item template*/}
                  <table
                    className="table d-none"
                    data-kt-element="item-template"
                  >
                    <tbody>
                      <tr
                        className="border-bottom border-bottom-dashed"
                        data-kt-element="item"
                      >
                        <td className="pe-7">
                          <input
                            type="text"
                            className="form-control form-control-solid mb-2"
                            name="name[]"
                            placeholder="Item name"
                          />
                          <input
                            type="text"
                            className="form-control form-control-solid"
                            name="description[]"
                            placeholder="Description"
                          />
                        </td>
                        <td className="ps-0">
                          <input
                            className="form-control form-control-solid"
                            type="number"
                            min={1}
                            name="quantity[]"
                            placeholder={1}
                            data-kt-element="quantity"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-solid text-end"
                            name="price[]"
                            placeholder={0.0}
                            data-kt-element="price"
                          />
                        </td>
                        <td className="pt-8 text-end">
                          $<span data-kt-element="total">0.00</span>
                        </td>
                        <td className="pt-5 text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-icon btn-active-color-primary"
                            data-kt-element="remove-item"
                          >
                            {/*begin::Svg Icon | path: icons/duotune/general/gen027.svg*/}
                            <span className="svg-icon svg-icon-3">
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z"
                                  fill="currentColor"
                                />
                                <path
                                  opacity="0.5"
                                  d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z"
                                  fill="currentColor"
                                />
                                <path
                                  opacity="0.5"
                                  d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                            {/*end::Svg Icon*/}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table
                    className="table d-none"
                    data-kt-element="empty-template"
                  >
                    <tbody>
                      <tr data-kt-element="empty">
                        <th
                          colSpan={5}
                          className="text-muted text-center py-10"
                        >
                          No items
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  {/*end::Item template*/}
                  {/*begin::Notes*/}
                  <div className="mb-0">
                    <label className="form-label fs-6 fw-bold text-gray-700">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      className="form-control form-control-solid"
                      rows={3}
                      placeholder="Thanks for your business"
                      onChange={handleChange}
                    />
                  </div>
                  {/*end::Notes*/}
                </div>
                {/*end::Wrapper*/}
              </Form>
              {/*end::Form*/}
            </div>
            {/*end::Card body*/}
          </div>
          {/*end::Card*/}
        </div>
        {/*end::Content*/}
        {/*begin::Sidebar*/}
        <div className="flex-lg-auto min-w-lg-300px">
          {/*begin::Card*/}
          <div
            className="card"
            data-kt-sticky="true"
            data-kt-sticky-name="invoice"
            data-kt-sticky-offset="{default: false, lg: '200px'}"
            data-kt-sticky-width="{lg: '250px', lg: '300px'}"
            data-kt-sticky-left="auto"
            data-kt-sticky-top="150px"
            data-kt-sticky-animation="false"
            data-kt-sticky-zindex={95}
          >
            {/*begin::Card body*/}
            <div className="card-body p-10">
              {/*begin::Input group*/}
              <div className="mb-10">
                {/*begin::Label*/}
                <label className="form-label fw-bold fs-6 text-gray-700">
                  Currency
                </label>
                {/*end::Label*/}
                {/*begin::Select*/}
                <select
                  name="currency"
                  id="currency"
                  // className="form-control form-control-solid"
                  onChange={handleChange}
                  className="form-control form-select form-select-solid"
                >
                  <option hidden>Select Currnecy</option>
                  <option value="USD">USA dollar</option>
                  <option value="GBP">British pound</option>
                  <option value="CAD">Canadian dollar</option>
                  {newData.qty_hour === "" ? (
                    <option hidden>select qty Type</option>
                  ) : newData.qty_hour == 0 ? (
                    <option value="0">&nbsp;&nbsp;Quantity</option>
                  ) : (
                    <option value="1">&nbsp;&nbsp;Hour</option>
                  )}
                </select>
                {/*end::Select*/}
              </div>
              {/*end::Input group*/}
              {/* begin::Input Group */}
              <div className="mb-10">
                {/*begin::Label*/}
                <label className="form-label fw-bold fs-6 text-gray-700">
                  Payment Status
                </label>
                {/*end::Label*/}
                {/*begin::Select*/}
                <select
                  name="paymentStatus"
                  id="paymentStatus"
                  // className="form-control form-control-solid"
                  onChange={handleChange}
                  className="form-control form-select form-select-solid"
                  defaultValue="0"
                >
                  <option hidden>Select Payment Status</option>
                  <option value="1">Payment Paid</option>
                  <option value="0">Payment Unpaid</option>
                  <option value="2">Payment Cancel</option>
                </select>
                {/*end::Select*/}
              </div>
              {/* end::Input Group */}
              {/*begin::Separator*/}
              <div className="separator separator-dashed mb-8" />
              {/*end::Separator*/}
              {/*begin::Input group*/}
              <div className="mb-8">
                {/*begin::Option*/}
                <label className="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack mb-5">
                  <span className="form-check-label ms-5 fw-bold fs-6 text-gray-700">
                    Payment method
                  </span>
                  <input className="form-check-input me-3" type="checkbox" />
                </label>
                {/*end::Option*/}
                {/*begin::Option*/}
                <label className="form-check form-switch form-switch-sm form-check-custom form-check-solid flex-stack mb-5">
                  <span className="form-check-label ms-0 fw-bold fs-6 text-gray-700">
                    Late Fees
                  </span>
                  <input className="form-check-input" type="checkbox" />
                </label>
                {/*end::Option*/}
              </div>
              {/*end::Input group*/}
              {/*begin::Separator*/}
              <div className="separator separator-dashed mb-8" />
              {/*end::Separator*/}
              {/*begin::Actions*/}
              <div className="mb-0">
                <button
                  type="submit"
                  href="#"
                  className="btn btn-primary w-100"
                  id="kt_invoice_submit_button"
                  onClick={handleSubmit}
                >
                  {/*begin::Svg Icon | path: icons/duotune/general/gen016.svg*/}
                  <span className="svg-icon svg-icon-3">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.43 8.56949L10.744 15.1395C10.6422 15.282 10.5804 15.4492 10.5651 15.6236C10.5498 15.7981 10.5815 15.9734 10.657 16.1315L13.194 21.4425C13.2737 21.6097 13.3991 21.751 13.5557 21.8499C13.7123 21.9488 13.8938 22.0014 14.079 22.0015H14.117C14.3087 21.9941 14.4941 21.9307 14.6502 21.8191C14.8062 21.7075 14.9261 21.5526 14.995 21.3735L21.933 3.33649C22.0011 3.15918 22.0164 2.96594 21.977 2.78013C21.9376 2.59432 21.8452 2.4239 21.711 2.28949L15.43 8.56949Z"
                        fill="currentColor"
                      />
                      <path
                        opacity="0.3"
                        d="M20.664 2.06648L2.62602 9.00148C2.44768 9.07085 2.29348 9.19082 2.1824 9.34663C2.07131 9.50244 2.00818 9.68731 2.00074 9.87853C1.99331 10.0697 2.04189 10.259 2.14054 10.4229C2.23919 10.5869 2.38359 10.7185 2.55601 10.8015L7.86601 13.3365C8.02383 13.4126 8.19925 13.4448 8.37382 13.4297C8.54839 13.4145 8.71565 13.3526 8.85801 13.2505L15.43 8.56548L21.711 2.28448C21.5762 2.15096 21.4055 2.05932 21.2198 2.02064C21.034 1.98196 20.8409 1.99788 20.664 2.06648Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  {/*end::Svg Icon*/}Send Invoice
                </button>

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  keyboard={false}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Invoice Bill</Modal.Title>
                  </Modal.Header>

                  {previewData.map((p, i) => (
                    <>
                      <Modal.Body>
                        <div className="preview-pdf-main">
                          <div className="header-design">
                            <div className="logo">
                              <div>
                                <h1>LOGO</h1>
                              </div>
                              <div>
                                <span>Date:-10-12-2022</span>
                              </div>
                            </div>
                            <div className="Invoice_box">
                              <div className="border-1" />
                              <div className="text">INVOICE</div>
                              <div className="border-2" />
                            </div>
                            <div className="invoice_data">
                              <div className="invoce_data_left">
                                <div>
                                  <span>Bill no:-</span>
                                  <span className="fw-normal">
                                    {p.invoiceId}
                                  </span>
                                  <br />
                                  {p.client_data.map((a) => (
                                    <>
                                      <span>Invoice To:-</span>
                                      <span className="fw-normal">
                                        {a.firstName}&nbsp;
                                        {a.lastName}
                                      </span>
                                      <br />
                                      <span>Address:-</span>
                                      <span className="fw-normal">
                                        {a.address}
                                      </span>
                                      <br />
                                      <span>GST No:-</span>
                                      <span className="fw-normal">
                                        {a.taxNumber}
                                      </span>
                                    </>
                                  ))}
                                </div>
                              </div>
                              <div className="invoce_data_right">
                                <p>
                                  <span>Invoice From:-</span>
                                  <span className="fw-normal">
                                    {p.bill_date}
                                  </span>
                                  <br />
                                  <span>Invoice To:-</span>
                                  <span className="fw-normal">{p.dueDate}</span>
                                </p>
                                <a href="./Invoice.pdf" />
                              </div>
                            </div>
                          </div>
                          <div className="item_data">
                            <table className=" item_box">
                              <tbody>
                                <tr className="border">
                                  <th>No</th>
                                  <th>itemname</th>
                                  <th>description</th>
                                  <th>Qty</th>
                                  <th> price</th>
                                  <th> total</th>
                                </tr>
                                {p.item.map((s, l) => (
                                  <tr className="item_1">
                                    <td>{l + 1}</td>
                                    <td>{s.itemName}</td>
                                    <td>{s.description}</td>
                                    <td>{s.qty_hour}</td>
                                    <td>{s.price}</td>
                                    <td>{s.total}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="footer">
                            <div className="payment_details">
                              {p.bank_data.map((a) => (
                                <div className="account_data">
                                  <span className="fs-6">Payment info</span>
                                  <br />
                                  <span>Account No:-</span>
                                  <span className="fw-normal">
                                    {a.accountNumber}
                                  </span>
                                  <br />
                                  <span>IFSC code:-</span>
                                  <span className="fw-normal">
                                    {a.IFSCcode}
                                  </span>
                                  <br />
                                  <span>GST IN:-</span>
                                  <span className="fw-normal">
                                    {a.taxNumber}
                                  </span>
                                </div>
                              ))}
                              <div className="payment_details">
                                <div>
                                  <div className="Subtotal">
                                    <span>Subtotal:-</span>
                                    <span className="fw-normal">
                                      INR {p.subTotal}
                                    </span>
                                  </div>
                                  <div className="Tax">
                                    <span>
                                      Tax({p.taxType})({p.taxRate}):-
                                    </span>
                                    <span className="fw-normal">
                                      INR
                                      {(p.total - p.subTotal).toFixed(1)}
                                    </span>
                                  </div>
                                  <div className="total text-white text-center  ">
                                    <span>Total:-</span>
                                    <span className="fw-normal">
                                      INR {p.total}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="notes">Notes:-{p.notes}</div>
                            <div className="border">
                              Thank you for your business
                            </div>
                          </div>
                        </div>
                      </Modal.Body>

                      <Modal.Footer>
                        {/* <button
                          className="bill-btn"
                          onClick={() => {
                            handleSendEmail(p._id);
                          }}
                        >
                          Send Email
                        </button> */}
                        <a
                          href={`https://test-semicolon.s3.ap-south-1.amazonaws.com/${p._id}/pdf/Invoice.pdf`}
                          // target="_blank"
                          className="bill-btn"
                          download
                        >
                          Download
                        </a>
                      </Modal.Footer>
                    </>
                  ))}
                </Modal>
              </div>
              {/*end::Actions*/}
            </div>
            {/*end::Card body*/}
          </div>
          {/*end::Card*/}
        </div>
        {/*end::Sidebar*/}
      </div>
      {/*end::Layout*/}
    </div>
  );
}

export default CreateInvoice;
