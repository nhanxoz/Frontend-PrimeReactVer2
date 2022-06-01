import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UserService } from "../service/UserService";

const User = () => {
  let emptyUser = {
    Image:null,
    FullName: "",
    Address: "",
    City: "",
    Country:"",
    BirthDay:"",
    Career:"",
  };
 
  const [users, setUsers] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [uri, setUri] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const userService = new UserService();
    userService.getUser().then((data) => {
      setUsers(data);
    });

    
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const saveUser = () => {
    setSubmitted(true);

    if (user.Name.trim()) {
      let _users = [...users];
      let _user = { ...user };
      if (user.ID) {
        const index = findIndexById(user.ID);

        _users[index] = _user;
        const userService = new UserService();
        userService.saveFood(_user);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Updated",
          life: 3000,
        });
      } else {
        _user.ID = 1;

        _user.Image = uri;
        _users.push(_user);
        const userService = new UserService();
        userService.saveFood(_user);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Created",
          life: 3000,
        });
      }

      setUsers(_users);
      setUserDialog(false);
      setUser(emptyUser);
      console.log(_users);
    }
  };

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteUser = (user) => {
    setUser(user);

    setDeleteUserDialog(true);
  };

  const deleteUser = () => {
    const userService = new UserService();

    userService.deleteUser(user.ID);
    let _users = users.filter((val) => val.id !== user.id);
    setUsers(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "User Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].ID === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = () => {
    console.log(selectedUsers);
    const userService = new UserService();
    for (var i in selectedUsers) {
      userService.deleteUser(selectedUsers[i].ID);
    }

    let _users = users.filter((val) => !selectedUsers.includes(val));
    setUsers(_users);

    setDeleteUsersDialog(false);
    setSelectedUsers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Users Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _user = { ...user };
    _user["CategoryID"] = e.value;
    setUser(_user);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  };

  const chooseOptions = { label: "Choose", icon: "pi pi-fw pi-plus" };
  const myUploader = (file) => {
    const userService = new UserService();

    userService
      .uploadImageUser(file.files[0])
      .then((data) => setUri(data));
  };
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="Thêm mới"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        {/* <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        /> */}
        <Button
          label="Xuất file Excel"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };
  
 
  const fullnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Họ tên</span>
        {rowData.FullName}
      </>
    );
  };

  const addressBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Địa chỉ</span>
        {rowData.Address}
      </>
    );
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ảnh</span>

        <img
          src={`http://localhost:1486/Content/food/` + rowData.Alias + `.jpg`}
          alt={rowData.Image}
          className="shadow-2"
          width="100"
        />
      </>
    );
  };

  const cityBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Thành phố</span>
        {rowData.City}
      </>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Quê quán</span>
          {rowData.Country}
      </>
    );
  };
  const birthdayBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Ngày sinh</span>
        <span>
          {rowData.BirthDay}
        </span>
      </>
    );
  };
  const careerBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Nghề nghiệp</span>
        <span>
          {rowData.Career}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Danh sách Mã giảm giá</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </>
  );
  const deleteUserDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteUser}
      />
    </>
  );
  const deleteUsersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedUsers}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="ID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Hiển thị mã từ {first} đến {last} của {totalRecords} mã"
            globalFilter={globalFilter}
            emptyMessage="No users found."
            header={header}
            responsiveLayout="scroll"
          >
            
            <Column
              field="FullName"
              header="Họ tên"
              sortable
              body={fullnameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
           
            {/* <Column
              header="Hình ảnh"
              body={imageBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column> */}
            <Column
              field="Address"
              header="Địa chỉ"
              body={addressBodyTemplate}
              
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            ></Column>
            <Column
              field="City"
              header="Thành phố"
              body={cityBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="Country"
              header="Quê quán"
              body={countryBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="BirthDay"
              header="Ngày sinh"
              body={birthdayBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column
              field="Career"
              header="Nghề nghiệp"
              body={careerBodyTemplate}
              sortable
              headerStyle={{ width: "14%", minWidth: "8rem" }}
            ></Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={userDialog}
            style={{ width: "450px" }}
            header="Chi tiết người dùng"
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            {user.Image && (
              <img
                src={
                  `http://localhost:1486/Content/food/` +
                  user.Alias +
                  `.jpg`
                }
                alt={user.Image}
                className="shadow-2"
                width="100"
              />
            )}
            <div className="field">
              <label htmlFor="name">Tên người dùng</label>
              <InputText
                id="name"
                value={user.Name}
                onChange={(e) => onInputChange(e, "Name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.Name,
                })}
              />
              {submitted && !user.Name && (
                <small className="p-invalid">Yêu cầu nhập tên người dùng</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Mô tả</label>
              <InputTextarea
                id="description"
                value={user.Description}
                onChange={(e) => onInputChange(e, "Description")}
                required
                rows={3}
                cols={20}
              />
            </div>
            <Toolbar
              className="mb-4"
              right={
                <FileUpload
                  chooseOptions={chooseOptions}
                  customUpload
                  uploadHandler={myUploader}
                />
              }
            ></Toolbar>
            

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price">Price</label>
                <InputNumber
                  id="price"
                  value={user.UserPrice}
                  onValueChange={(e) =>
                    onInputNumberChange(e, "UserPrice")
                  }
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
              <div className="field col">
                <label htmlFor="OriginPrice">Giá gốc</label>
                <InputNumber
                  id="OriginPrice"
                  value={user.OriginPrice}
                  onValueChange={(e) => onInputNumberChange(e, "OriginPrice")}
                  mode="currency"
                  currency="VND"
                  locale="vi-VN"
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  Bạn muốn xóa món ăn này?<b>{user.Name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteUsersDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteUsersDialogFooter}
            onHide={hideDeleteUsersDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && <span>Bạn muốn xóa tất cả món ăn đã chọn khum?</span>}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(User, comparisonFn);
