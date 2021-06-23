import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { updateCategory , getCategory} from "./helper/adminapicall";

const UpdateCategory = ({match}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();


  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );


  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
        if (data.error) {
            setName({...name, error: data.error });
        } else {
            setName(data.name);
        }
    });
  };


  useEffect(() => {
    preload(match.params.categoryId);
  }, []);



  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //Backend request
    updateCategory(match.params.categoryId,user._id, token, {name})
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const successMessage = () => (
    <div
    className="alert alert-success mt-3"
    style={{ display: success? "" : "none" }}
  >
    <h4>Category updated successfully!</h4>
  </div>
  );

  const warningMessage = () => (
    <div
    className="alert alert-danger mt-3"
    style={{ display: error? "" : "none" }}
  >
    <h4>Failed to update category!</h4>
  </div>
  );

  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          autoFocus
        />
        <button onClick={onSubmit} className="btn btn-outline-info mt-2">
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Update a category here!"
      description=""
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default UpdateCategory;
