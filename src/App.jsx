import axios from "axios"
import { Route, Routes } from "react-router-dom";
import { LoginComponent } from "./component/authentication/LoginComponent";
import { SignupComponent } from "./component/authentication/SignupComponent";
import { Deshboard } from "./component/Deshboard/Deshboard";
import ProtectedRouterComponent from "./component/Router/ProtectedRouterComponent";
import { UserProfileComponent } from "./component/userProfile/UserProfileComponent";
import { TopNavigarionbarComponent } from "./component/Deshboard/TopNavigarionbarComponent";
import { SessionExpiredComponent } from "./component/authentication/SessionExpiredComponent";
import { AddProductListingComponent } from "./component/Products/AddProductListingComponent";
import { SingleProductListingComponent } from "./component/Products/SingleProductListingComponent";
import { AuthAdminRouter } from './component/Router/AuthAdminRouter';
import { AdminComponent } from "./component/Admin/AdminComponent";
import { useState } from "react";
import { CardAndAddressDetailsComponent } from "./component/userProfile/CardAndAddressDetailsComponent";

function App() {
  axios.defaults.baseURL = "http://localhost:9999/";

  const [drawer, setdrawer] = useState(true);

  return (
    <>
      <TopNavigarionbarComponent drawer={drawer} setdrawer={setdrawer} />
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<SignupComponent />} />
        <Route path="/session-expired" element={<SessionExpiredComponent />} />
        <Route element={<ProtectedRouterComponent />}>
          <Route path="/" element={<Deshboard />} />
          <Route path="/profile/:id" element={<UserProfileComponent />} />
          <Route path="/add-listing" element={<AddProductListingComponent />} />
          <Route path="/single-listing/:id" element={<SingleProductListingComponent />} />
          <Route path="/address-card-details" element={<CardAndAddressDetailsComponent />} />
        </Route>
        <Route element={<AuthAdminRouter />}>
          <Route path="/admin-deshboard" element={<AdminComponent drawer={drawer} setdrawer={setdrawer} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
