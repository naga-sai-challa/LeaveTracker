import { Outlet } from "react-router";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";

const AdminLayout = () => {
  return (
    <div>
      <AdminHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AdminLayout;
