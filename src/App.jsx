import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import api from "./lib/api";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data: userResponse } = await api.get("auth/me");
      dispatch(setUser(userResponse.user));
      setLoading(false);
    })();
  }, [dispatch]);
  if (loading) return <></>;
  return <Outlet />;
}

export default App;
