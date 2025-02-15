import { useState } from "react";
import { Button, Input, PasswordInput } from "@mantine/core";
import service from "../../httpd/service";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      notifications.show({
        title: "All fields required",
        color: "red",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await service.post("/login", {
        email,
        password,
      });
      if (response.status === 200) {
        const token = response.data.data.token;
        const user = response.data.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        notifications.show({
          title: "Login Success",
          message: "You have been logged in successfully.",
          color: "green",
        });

        navigate("/"); // Navigate to home page smoothly
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Login Error",
        message: error.response.data.error || "Something went wrong",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex justify-center items-center bg-gray-800">
      <div className="w-[95%] md:w-[33%] p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-white/80 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <Input.Wrapper label="Email">
            <Input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              styles={{
                input: {
                  backgroundColor: "black",
                },
              }}
            />
          </Input.Wrapper>

          <PasswordInput
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            styles={{
              innerInput: {
                backgroundColor: "black",
              },
            }}
          />

          <div className="text-center">
            <Button
              w="100%"
              mb="sm"
              size="sm"
              type="submit"
              color="indigo"
              mt="sm"
              disabled={loading}
              loading={loading}
            >
              Login
            </Button>
            <p className="text-white text-sm">
              Don&apos;t have an Account?{" "}
              <Link
                className="text-green-700 font-semibold hover:text-green-600"
                to="/register"
              >
                SignUp
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
