import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const channel = useSelector((state) => state.server?.channels[0]?.name);
  const navigate = useNavigate();

  useEffect(() => {
    if (channel) navigate("./" + channel);
  }, [channel, navigate]);

  return null;
};

export default Redirect;
