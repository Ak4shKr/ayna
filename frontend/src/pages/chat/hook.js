import { notifications } from "@mantine/notifications";
import service from "../../httpd/service";

export const fetchMessages = async (setMessages, setLoading) => {
  try {
    setLoading(true);
    const response = await service.get("/messages", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    if (response.status === 200) {
      setMessages(response.data.messages);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    notifications.show({
      title: "Error fetching messages",
      message: error.response.data.error || "Something went wrong",
      color: "red",
    });
  } finally {
    setLoading(false);
  }
};

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  notifications.show({
    title: "Logout",
    message: "You have been logged out successfully.",
    color: "green",
  });
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
};

export const deleteChatHistory = async (setMessages) => {
  try {
    const response = await service.delete("/messages", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    if (response.status === 200) {
      notifications.show({
        title: "Chat history deleted",
        message: "Chat history has been deleted successfully.",
        color: "green",
        position: "top-center",
      });
      setMessages([]);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 300);
    }
  } catch (error) {
    console.error("Error deleting chat history:", error);
    notifications.show({
      title: "Error deleting chat history",
      message: error.response.data.error || "Something went wrong",
      color: "red",
    });
  }
};
