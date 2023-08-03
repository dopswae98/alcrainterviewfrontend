import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import Login from "./Pages/Login";
import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.js";
import { DataContextProvider } from "./Components/TheContext";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <DataContextProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute />}>
          <Route path="/home" element={<Homepage />} />
        </Route>
      </Routes>
    </DataContextProvider>
  );
}

export default App;
