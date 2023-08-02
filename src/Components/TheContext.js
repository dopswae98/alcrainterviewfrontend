import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  // Define the values you want to provide to consuming components
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [todoDetailsModal, setTodoDetailsModal] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [auth, setAuth] = useState({ token: false });
  const [addmodal, setAddmodal] = useState(false);
  // const [isauthenticated, setIsAuthenticated] = useState(second)
  const [formData, setFormData] = useState({
    name: "",
    date_of_registration: "",
    company_registration_number: "",
    address: "",
    contact_person: "",
    departments: "",
    num_employees: "",
    employees: "",
    contact_phone: "",
    email: "",
  });
  const employeesApi = () =>
    axios
      .get(`https://talentbackend.onrender.com/employees/`)
      .then((response) => {
        setEmployeeDetails(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  const companiesApi = () =>
    axios
      .get(`https://talentbackend.onrender.com/companies/`)
      .then((response) => {
        setCompanies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  const api = () =>
    axios
      .get(`https://talentbackend.onrender.com/companies/`)
      .then((response) => {
        setCompanies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

  const [fakeAuthService, setFakeAuthService] = useState({
    isAuthenticated: true,
    login(callback) {
      this.isAuthenticated = true;
      setTimeout(callback, 100);
    },
    logout(callback) {
      this.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  });

  // const [isAuthenticated, setIsAuthenticated] = useState(
  //   () => !!localStorage.getItem("token") // Check if token exists in storage
  // );

  // const login = () => {
  //   localStorage.setItem("token", "true"); // Replace 'yourAuthToken' with the actual auth token
  //   setIsAuthenticated(true);
  // };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setIsAuthenticated(false);
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    navigate("/home"); // Redirect to private route after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page after logout
  };

  const contextValue = {
    message: "Hello, Context!",
    setFormData,
    formData,
    handleChange,
    companies,
    setCompanies,
    companyDetails,
    setCompanyDetails,
    api,
    auth,
    setAuth,
    login,
    isAuthenticated,
    setIsAuthenticated,
    logout,
    fakeAuthService,
    setFakeAuthService,
    employeeDetails,
    setEmployeeDetails,
    companiesApi,
    addmodal,
    setAddmodal,
    todoDetailsModal,
    setTodoDetailsModal,
    /* add more values as needed */
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// export default TheContext;
export { DataContext, DataContextProvider };
