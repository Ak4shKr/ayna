import { Button, Input, PasswordInput } from "@mantine/core";
import { useState } from "react";
import service from "../../httpd/service";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";

const Register = () => {
  //global state for loading spinner

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handlers for inputs
  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      notifications.show({
        title: "Registration Error",
        message: "All fields are required.",
        color: "red",
      });
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await service.post("/register", {
        name,
        email,
        password,
      });
      if (response.status === 201) {
        notifications.show({
          title: "Registration Success",
          message: response.data.message,
        });
        setLoading(false);
      }
    } catch (error) {
      notifications.show({
        title: "Registration Error",
        message: error.response?.data?.error || "Something went wrong",
        color: "red",
      });
    }
  };

  return (
    <div className="h-dvh flex justify-center items-center bg-gray-800">
      <div className="w-[95%] md:w-[33%] mx-auto mt-10 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-exo font-bold mb-2 text-white/80 text-center">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <Input.Wrapper label="Name">
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              required
              styles={{
                input: {
                  backgroundColor: "black",
                },
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Email">
            <Input
              placeholder="Enter your email"
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
              my="sm"
              size="sm"
              type="submit"
              color="indigo"
              loading={loading}
            >
              Register
            </Button>
            <p className="text-white text-sm">
              Already have an Account?{" "}
              <Link
                className="text-green-700 font-semibold hover:text-green-600"
                to="/login"
              >
                LogIn
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
