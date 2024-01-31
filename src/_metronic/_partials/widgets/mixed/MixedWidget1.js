import React, { useMemo, useEffect, useState } from "react";
import swal from "sweetalert2";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
// import { Nav, Tab } from "react-bootstrap";
// import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import Pagination from "@material-ui/lab/Pagination";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
// import { DropdownMenu2 } from "../../dropdowns";
// import { toast, ToastContainer } from "react-toastify";
import { Form, Modal } from "react-bootstrap";
// import { DropdownCustomToggler, DropdownMenu4 } from "../../dropdowns";
import {
  ApiDelete,
  ApiGet,
  ApiPost,
  ApiPut,
  Bucket,
  reftoken,
} from "../../../../helpers/API/ApiData";
import { ErrorToast, SuccessToast } from "../../../../helpers/Toast";
// import noDataTable from "../../../../common/noDataTable";
import NoDataTable from "../../../../common/noDataTable";
import { ToastContainer } from "react-toastify";
// import { BreadCrumbs } from "../../../layout/components/subheader/components/BreadCrumbs";

export function MixedWidget1({ className }) {
  const history = useHistory();
  const [accountdata, setaccountdata] = useState({});
  // console.log("accountdata", accountdata);
  const [category, setcategory] = useState([]);
  // const [key, setKey] = useState("Month");
  const uiService = useHtmlClassService();
  const [data, setData] = React.useState([]);
  const [searchData, setsearchData] = React.useState([]);
  const [modelStatus, setmodelStatus] = React.useState("request");
  const [message, setmessage] = React.useState("");
  const [totalpage, settotalpage] = useState(0);
  const [currentpage, setcurrentpage] = useState(1);
  const [pagesize, setpagesize] = useState(4);
  const [state, setState] = React.useState("approve");
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [modal1, setModal1] = React.useState(false);
  const [Id, setId] = React.useState();
  const [rowID, setRowID] = React.useState();
  const [searching, setsearching] = useState("");
  const [price, setPrice] = useState();
  // console.log("datataatatataaaa", data);
  const columns = [
    // {
    //   dataField: "title",
    //   text: "Title",
    //   sort: true,
    // },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: (cell, row) => {
        return (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-50 symbol-light mr-4">
              {/* <span className="symbol-label">
                <span className="svg-icon h-75 align-self-end"> */}
              <img src={Bucket + row.thumbnail} className="img-fluid" />
              {/* </span>
              </span> */}
            </div>
            <div>
              <a className="text-dark-75 font-weight-bolder text-hover-primary mb-1 font-size-lg">
                {row.title}
              </a>
            </div>
          </div>
        );
      },
      // sort: true,
      //   sortCaret: sortCaret,
      // headerSortingClasses,
    },
    {
      dataField: "name",
      text: "Software",
      width: "200",
      sort: true,
      headerStyle: { whiteSpace: "normal", wordWrap: "break-word" },
      formatter: (cell, row) => {
        return (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-30 symbol-light mr-4 d-flex">
              {/* <span className="symbol-label">
                <span className="svg-icon h-75 align-self-end"> */}

              {row?.software?.length > 0 &&
                row?.software.map((record, i) => {
                  return (
                    <>
                      <img
                        src={Bucket + record.image}
                        className="img-fluid"
                        width="30px !important"
                        height="30px !important"
                      />{" "}
                      &nbsp;{" "}
                    </>
                  );
                })}
              {/* </span>
              </span> */}
            </div>
          </div>
        );
      },
    },

    {
      dataField: "action",
      text: "Actions",
      headerStyle: {
        display: "flex",
        justifyContent: "center",
        // flexDirection: "column-reverse",
      },
      formatter: (cell, row) => {
        return (
          <div className="d-flex justify-content-around">
            <a
              title="Edit customer"
              className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
              onClick={() => click(row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </a>
            <> </>

            <a
              title="Delete customer"
              className="btn btn-icon btn-light btn-hover-danger btn-sm"
              onClick={() => {
                // deleted(row._id);
                swal
                  .fire({
                    text: "Are you sure you want to delete ?",
                    icon: "warning",
                    showConfirmButton: true,
                    confirmButtonColor: "#D72852",
                    confirmButtonText: "Yes, Delete",
                    showCancelButton: true,
                    cancelButtonColor: "transparent",
                    cancelButtonText: "No, cancel",
                  })
                  .then((res) => {
                    if (res.isConfirmed) {
                      deleteTheory(row?._id);
                    }
                  });
              }}
            >
              <span className="svg-icon svg-icon-md svg-icon-danger">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                />
              </span>
            </a>
            <> </>

            {/* <a
              title="Change status"
              className="btn btn-icon btn-light btn-hover-info btn-sm"
              onClick={() => changeStatus(row._id)}
            >
              <span className="svg-icon svg-icon-md svg-icon-info">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/General/Settings-1.svg")}
                ></SVG>
              </span>
            </a> */}
            <> </>
          </div>
        );
      },

      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const handleonchnagespagination = (e) => {
    callPanding(1, parseInt(e.target.value), state, searching);
  };
  const handleChange = (e, i) => {
    console.log(i);
    callPanding(i, pagesize, state, searching);
  };
  const click = (v) => {
    setOpen(!open);
    console.log(v._id);
    setRowID(v._id);
  };
  const deleted = (v) => {
    console.log(v);
    setModal(!modal);
    setId(v);
  };
  const changeStatus = (v) => {
    console.log(v);
    setModal1(!modal1);
    setId(v);
  };
  const deleteTheory = (v) => {
    ApiDelete("/post/" + v)
      .then((res) => {
        console.log(res);
        // SuccessToast(res.data.message);
        swal.fire({
          text: "You have Deleted Successfully!!!",
          icon: "success",
          confirmButtonText: "Ok, Got it!",
          confirmButtonColor: "#338DE6",
        });
        setData(
          data.filter(function(el) {
            return el._id != v;
          })
        );
      })
      .catch(async (err) => {
        if (err.status == 410) {
          let ext = await reftoken("ApiDelete", "/sub_category/" + v);
          console.log(ext);
          SuccessToast(ext.data.message);
          setData(
            data.filter(function(el) {
              return el._id != v;
            })
          );
          setsearchData(
            searchData.filter(function(el) {
              return el._id != v;
            })
          );
        } else {
          ErrorToast(err.message);
        }
      });
    // setModal(!modal);
  };
  const deleteTheory1 = (v) => {
    if (modelStatus == "reject" && !message) {
      alert("Please Enter the reason to reject");
    } else {
      let body = {
        postId: v,
        status: modelStatus,
        message: message,
      };
      ApiPost("/post/action_on_post", body)
        .then((res) => {
          console.log(res);
          SuccessToast(res.data.message);
          setState(modelStatus);
          callPanding(1, 4, "request");
          setmodelStatus("request");
          setmessage("");
        })
        .catch(async (err) => {
          if (err.status == 410) {
            let ext = await reftoken("ApiPost", "/post/action_on_post", body);
            console.log(ext);
            SuccessToast(ext.data.message);
            setState(modelStatus);
            callPanding(1, 4, "request");
            setmodelStatus("request");
            setmessage("");
          } else {
            ErrorToast(err.message);
          }
        });
      setModal1(!modal1);
    }
  };
  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily"),
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_1_chart");
    const element2 = document.getElementById("kt_mixed_widget_2_chart");
    const element3 = document.getElementById("kt_mixed_widget_3_chart");
    if (!element) {
      return;
    }
    if (!element2) {
      return;
    }
    if (!element3) {
      return;
    }

    const options = getChartOptions(layoutProps);
    const options2 = getChartOptions1(layoutProps);
    const options3 = getChartOptions2(layoutProps);

    const chart = new ApexCharts(element, options);
    const chart2 = new ApexCharts(element2, options2);
    const chart3 = new ApexCharts(element3, options3);

    chart.render();
    chart2.render();
    chart3.render();
    return function cleanUp() {
      chart.destroy();
      chart2.destroy();
      chart3.destroy();
    };
  }, [layoutProps]);

  const callPanding = (s, p, q, r) => {
    let body = {
      limit: p,
      page: s,
      status: q,
      search: r,
    };
    ApiPost("/post/admin_get_post", body)
      .then((res) => {
        console.log(res);
        setData(res.data?.post_data);
        settotalpage(res?.data.state.page_limit);
        setcurrentpage(res?.data.state.page);
        setpagesize(res?.data.state.limit);
      })
      .catch(async (err) => {
        // if (err.status == 410) {
        //   let ext = await reftoken("ApiPost", "/post/admin_get_post", body);
        //   console.log(ext);
        //   // setData(ext.data.data.menu_categories);
        // } else {
        ErrorToast(err?.message);
        // }
      });
  };
  const fetchdata = async () => {
    await ApiGet("/dashboard/home")
      .then((res) => {
        console.log(res);
        setaccountdata(res.data.data);
      })
      .catch(async (err) => {
        // if (err.status == 410) {
        //   let ext = await reftoken("ApiGet", "/post/admin_dashboard");
        //   console.log(ext);
        //   setaccountdata(ext.data.data);
        //   //   ErrorToast(err.message);
        // } else {
        ErrorToast(err?.message);
        // }
      });
    const body = {
      page: 1,
      limit: 5,
      isCategoryActive: true,
      search: "",
    };
    await ApiPost("/category_pagination", body)
      .then((res) => {
        console.log(res);
        setcategory(res?.data?.category_data);
      })
      .catch(async (err) => {
        // if (err.status == 410) {
        //   let ext = await reftoken("ApiPost", "/category_pagination", body);
        //   console.log(ext);
        //   // setData(ext.data.data.menu_categories);
        // } else {
        ErrorToast(err?.message);
        // }
      });

    callPanding(currentpage, pagesize, state);
  };
  // useEffect(() => {
  //   fetchdata();
  // }, []);

  const handleFlag = (e) => {
    setPrice(e);
    if (e === "1") {
      updateData(true);
    } else {
      updateData(false);
    }
  };
  // console.log("=====", price);
  const updateData = (isPremium) => {
    let body = {
      type: 0,
      isPremium,
    };
    console.log(body);
    ApiPut("/dashboard/put_item", body)
      .then((res) => SuccessToast(res.message))
      .catch((e) => ErrorToast(e.message));
  };

  const fetchItem = () => {
    ApiGet("/dashboard/get_item")
      .then((res) => {
        console.log("dashboard/get_item", res.data);
        if (res.data.data[0].isPremium) {
          setPrice("1");
        } else {
          setPrice("2");
        }
        // setPrice(res.data.data[0].isPremium)
      })
      .catch((e) => {
        ErrorToast(e.message);
      });
  };
  // useEffect(() => {
  //   fetchItem();
  // }, []);
  // console.log("category", category);
  // let dashbord = ["User", "dashboard"]

  return (
    <>
      {/* <BreadCrumbs items={dashbord} /> */}
      <div
        class="subheader py-2 py-lg-6  subheader-transparent "
        id="kt_subheader"
      >
        <ToastContainer />
        <div class=" container-fluid  d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap">
          <div class="d-flex align-items-center flex-wrap mr-1">
            <div class="d-flex align-items-baseline flex-wrap mr-5">
              <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2 font-size-sm">
                <li class="breadcrumb-item">
                  <a
                    class="text-muted"
                    onClick={() => history.push("/dashboard")}
                  >
                    Home
                  </a>
                </li>
                <li class="breadcrumb-item">
                  <a class="text-muted">Dashboard</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mt-10">
        <div className="col-lg-12 col-xxl-12">
          <div className="card card-custom">
            <div class="form-group m-0">
              <div className="row px-4 py-2 align-items-center">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-around align-items-center">
                    <div class="e">
                      <label class="radio m-0">
                        <input
                          type="radio"
                          name="radios2"
                          value="1"
                          onChange={(e) => handleFlag(e.target.value)}
                          checked={price === "1" && true}
                        />
                        <span className="me-2"></span>
                        Primium License
                      </label>
                    </div>
                    <div class="e">
                      <label class="radio m-0">
                        <input
                          type="radio"
                          name="radios2"
                          value="2"
                          onChange={(e) => handleFlag(e.target.value)}
                          checked={price === "2" && true}
                        />
                        <span className="me-2"></span>
                        Free License
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="row mt-10">
        <div className={` ${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header border-0 bg-danger py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_1_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6">
                        {accountdata.active_user}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6"
                      onClick={() => history.push("/user_List")}
                    >
                      Active User
                    </a>
                  </div>
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata.block_user}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/user_List")}
                    >
                      Block Users
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        {accountdata.pending_post}
                      </a>
                    </span>
                    <a
                      className="text-danger font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/post_List")}
                    >
                      Pending Post
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata.post}
                      </a>
                    </span>
                    <a
                      className="text-success font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/post_List")}
                    >
                      Post
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header border-0 bg-danger py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_2_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6">
                        {accountdata.menu_categories}
                      </a>
                    </span>
                    <a
                      className="text-warning font-weight-bold font-size-h6"
                      onClick={() => history.push("/category_List")}
                    >
                      Categories
                    </a>
                  </div>
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata.menu_sub_categories}
                      </a>
                    </span>
                    <a
                      className="text-primary font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/subCategory_List")}
                    >
                      Sub Categories
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        {accountdata.software}
                      </a>
                    </span>
                    <a
                      className="text-danger font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/software_List")}
                    >
                      Software
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata.pending_contact_us}
                      </a>
                    </span>
                    <a
                      className="text-success font-weight-bold font-size-h6 mt-2"
                      onClick={() => history.push("/contact_List")}
                    >
                      Inquiry
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom bg-gray-100">
            <div className="card-header border-0 bg-danger py-5">
              <div className="card-toolbar"></div>
            </div>
            <div className="card-body p-0 position-relative overflow-hidden">
              <div
                id="kt_mixed_widget_3_chart"
                className="card-rounded-bottom bg-danger"
                style={{ height: "200px" }}
              ></div>

              <div className="card-spacer mt-n25">
                <div className="row m-0">
                  <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                      <a className="text-warning font-weight-bold font-size-h6">
                        {accountdata.today}
                      </a>
                    </span>
                    <a className="text-warning font-weight-bold font-size-h6">
                      Today
                    </a>
                  </div>
                  <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                    <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                      <a className="text-primary font-weight-bold font-size-h6 mt-2">
                        {accountdata.today_download}
                      </a>
                    </span>
                    <a className="text-primary font-weight-bold font-size-h6 mt-2">
                      Download
                    </a>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
                    <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                      <a className="text-danger font-weight-bold font-size-h6 mt-2">
                        0
                      </a>
                    </span>
                    <a className="text-danger font-weight-bold font-size-h6 mt-2">
                      Week
                    </a>
                  </div>
                  <div className="col bg-light-success px-6 py-8 rounded-xl">
                    <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                      <a className="text-success font-weight-bold font-size-h6 mt-2">
                        {accountdata.week_downloads}
                      </a>
                    </span>
                    <a className="text-success font-weight-bold font-size-h6 mt-2">
                      Download
                    </a>
                  </div>
                </div>
              </div>

              <div className="resize-triggers">
                <div className="expand-trigger">
                  <div style={{ width: "411px", height: "461px" }} />
                </div>
                <div className="contract-trigger" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className={` ${className} col-lg-4 col-xxl-4`}>
          <div className="card card-custom">
            <div className="card-header border-0">
              <h3 className="card-title font-weight-bolder text-dark">
                Top Categories
              </h3>
              
            </div>

            <div className="card-body pt-2" style={{ height: "448px" }}>
              {category?.length > 0 &&
                category.map((img, i) => (
                  <div className="d-flex align-items-center mb-10">
                    

                    <div className="d-flex flex-column font-weight-bold">
                      <a className="text-dark text-hover-primary mb-1 font-size-lg">
                        {img.name}
                      </a>
                      <span className="text-muted">{img.totalUsed}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={`${className} col-lg-8 col-xxl-8`}>
          <div className="card card-custom" style={{ paddingBottom: "25px" }}>
            <div className="card-header border-0 pt-5">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label font-weight-bolder text-dark">
                  Approve Post
                </span>
                
              </h3>
              
            </div>
            <div className="card-body pt-3 pb-0">
              <div className="table-responsive">
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden"
                  bootstrap4
                  // remote
                  keyField="id"
                  data={data}
                  columns={columns}
                  // pagination={paginationFactory(options)}
                  defaultSorted={defaultSorted}
                  noDataIndication={() => <NoDataTable />}
                  // filter={filterFactory()}
                  // headerClasses="header-class"
                />
                <center>{data.length > 0 ? null : "No Data"}</center>
                {data.length > 0 ? (
                  <div class="d-flex justify-content-between  pt-10">
                    <div className="my-2">
                      <Pagination
                        count={totalpage}
                        page={currentpage}
                        onChange={handleChange}
                        variant="outlined"
                        shape="rounded"
                        className="pagination_"
                      />
                    </div>
                    <div class="my-2 my-md-0">
                      <div class="d-flex align-items-center pagination-drpdown">
                        <select
                          class="form-control pagination-drpdown1 dropdownPage"
                          id="kt_datatable_search_status"
                          onChange={(e) => handleonchnagespagination(e)}
                          value={pagesize}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : null}
                {open && (
                  <Post_Edit
                    open={open}
                    setOpen={setOpen}
                    rowID={rowID}
                    setRowID={setRowID}
                    fetchDatas={callPanding}
                    SetState={setState}
                  />
                )}
                <Modal
                  show={modal}
                  centered
                  onHide={() => setModal(!modal)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Delete Post
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <span>
                      Are you sure you want to delete this Post permanently?
                    </span>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setModal(!modal)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={() => deleteTheory(Id)}
                        className="btn btn-primary btn-elevate"
                      >
                        Delete
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={modal1}
                  centered
                  onHide={() => setModal1(!modal1)}
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Status has been updated for selected Post
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="form-group">
                      <select
                        className="form-control"
                        value={modelStatus}
                        onChange={(e) => setmodelStatus(e.target.value)}
                      >
                        <option value={"public"}>Public</option>
                        <option value={"request"}>Pending</option>
                        <option value={"reject"}>Reject</option>
                      </select>
                    </div>
                    <div className="col-lg-12">
                      <Form.Group md="12">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          type="textarea"
                          placeholder="Enter Message...."
                          label="message"
                          id="message"
                          required
                          name="message"
                          onChange={(e) => setmessage(e.target.value)}
                          value={message}
                        />
                      </Form.Group>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => setModal1(!modal1)}
                        className="btn btn-light btn-elevate"
                      >
                        Cancel
                      </button>
                      <> </>
                      <button
                        type="button"
                        onClick={() => deleteTheory1(Id)}
                        className="btn btn-primary btn-elevate"
                      >
                        Submit
                      </button>
                    </div>
                  </Modal.Footer>
                </Modal>
               
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

function getChartOptions(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 25, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function(val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
function getChartOptions1(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function(val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
function getChartOptions2(layoutProps) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: "Net Profit",
        data: [30, 45, 32, 70, 40, 40, 40],
      },
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 0,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [strokeColor],
    },
    xaxis: {
      categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 80,
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily,
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily,
      },
      y: {
        formatter: function(val) {
          return "$" + val + " thousands";
        },
      },
      marker: {
        show: false,
      },
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3,
    },
  };
  return options;
}
