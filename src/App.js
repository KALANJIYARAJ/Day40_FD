import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import { config } from "./config";

function App() {
  const [productList, setProductList] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [productId, setProductId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await axios.get(`${config.api}/products`);
        setProductList(products.data);
      } catch (error) {
        alert("Something get wrong");
      }
    };
    fetchData();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
    },
    onSubmit: async (values) => {
      try {
        if (!isEdit) {
          const product = await axios.post(`${config.api}/product`, values);
          setProductList([...productList, { ...values, _id: product.data.id }]);
          formik.resetForm();
        } else {

          await axios.put(`${config.api}/product/${productId}`, values);
          const pIndex = productList.findIndex((p) => p.id == productId);

          productList[pIndex] = values;
          setProductList([...productList]);
          formik.resetForm();
          setEdit(false);
        }
      } catch (error) {
        alert("Product can't edit");
      }
    },
  });

  const editProduct = async (id) => {
    try {
      const product = await axios.get(`${config.api}/product/${id}`);
      formik.setValues(product.data);
      setProductId(id);
      setEdit(true);
    } catch (error) {
      alert("Product can't get for edit");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${config.api}/product/${id}`);
      const pIndex = productList.findIndex((p) => p.id == id);
      productList.splice(pIndex, 1);
      setProductList([...productList]);
    } catch (error) {
      alert("Product can't delete");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-lg-6">
                <label>Name</label>
                <input
                  type={"text"}
                  className="form-control"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-lg-6">
                <label>Price</label>
                <input
                  type={"text"}
                  className="form-control"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg">
                <input
                  type={"submit"}
                  value={isEdit ? "Update" : "Submit"}
                  className="btn btn-primary"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="col-lg-6">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => {
                return (
                  <tr>
                    <th scope="row">{product._id}</th>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <button
                        onClick={() => editProduct(product._id)}
                        className="btn btn-info btn-sm me-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
