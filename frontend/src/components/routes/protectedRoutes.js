import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        notifications.show({
          title: "Unauthorized",
          message: "You need to login to access this page",
          color: "red",
        });
        navigate("/login");
      }
      setToken(storedToken);
    };

    getToken();
  }, []);

  if (token) {
    return children;
  } else {
    return navigate("/login");
  }
};

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoutes;
